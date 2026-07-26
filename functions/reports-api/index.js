const catalyst = require("zcatalyst-sdk-node");
const { loadTemplate, render } = require("./template-engine");

async function handler(req, res) {
  try {
    const { districtId, districtName, reportType, periodStart, periodEnd } = JSON.parse(req.body);

    if (reportType === "district-summary") {
      return await handleDistrictSummary(req, res);
    }
    if (reportType === "case-report") {
      return await handleCaseReport(req, res);
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Report generation triggered via Circuits workflow",
        reportId: `pending-${Date.now()}`,
        estimatedCompletion: new Date(Date.now() + 30000).toISOString(),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: { code: "VALIDATION", message: err.message },
    });
  }
}

async function handleDistrictSummary(req, res) {
  const app = catalyst.initialize(req);
  const { districtId, districtName, periodStart, periodEnd } = JSON.parse(req.body);
  const query = app.datastore().getTable("CaseMaster").getQuery();
  const rows = await query.execute(`
    SELECT cm.CaseMasterID, cg.CrimeGroupName, cs.CaseStatusName, u.UnitName, g.LookupValue as Gravity
    FROM CaseMaster cm
    LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
    LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
    LEFT JOIN Unit u ON cm.UnitID = u.UnitID
    LEFT JOIN GravityOffence g ON cm.GravityOffenceID = g.GravityOffenceID
    WHERE u.DistrictID = ?
  `, { params: [parseInt(districtId)] });

  const totalCases = rows.length;
  const activeCases = rows.filter(r => r.CaseStatusName === "Under Investigation").length;
  const resolvedCases = rows.filter(r => ["Convicted", "Closed", "Acquitted"].includes(r.CaseStatusName)).length;
  const clearanceRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

  const crash = {};
  for (const r of rows) {
    const name = r.CrimeGroupName || "Unknown";
    crash[name] = (crash[name] || 0) + 1;
  }
  const categoryRows = Object.entries(crash).map(([name, count]) =>
    `<tr><td>${name}</td><td>${count}</td><td>${totalCases > 0 ? Math.round((count / totalCases) * 100) : 0}%</td><td>—</td></tr>`
  ).join("");

  const stations = [...new Set(rows.map(r => r.UnitName).filter(Boolean))];
  const stationRows = stations.map(s => {
    const sc = rows.filter(r => r.UnitName === s);
    const sr = sc.filter(r => ["Convicted", "Closed", "Acquitted"].includes(r.CaseStatusName)).length;
    return `<tr><td>${s}</td><td>${sc.length}</td><td>${sc.filter(r => r.CaseStatusName === "Under Investigation").length}</td><td>${sr}</td><td>${sc.length > 0 ? Math.round((sr / sc.length) * 100) : 0}%</td></tr>`;
  }).join("");

  const cache = app.cache();
  const cachedAlerts = await cache.get("trend_alerts");
  const alerts = cachedAlerts ? JSON.parse(cachedAlerts) : [];
  const trendAlerts = alerts.filter(a => a.district === districtName).map(a =>
    `<div class="alert-box"><h4>${a.crimeType} — ${a.increase}% Increase</h4><p>${a.message}</p></div>`
  ).join("") || '<p style="color:#64748b;font-size:12px;">No significant trend alerts.</p>';

  const template = loadTemplate("district-summary");
  const html = render(template, {
    DISTRICT_NAME: districtName || `District #${districtId}`,
    PERIOD_START: periodStart || "—",
    PERIOD_END: periodEnd || "—",
    GENERATED_AT: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    TOTAL_CASES: String(totalCases),
    HEINOUS_CASES: String(rows.filter(r => r.Gravity === "Heinous").length),
    CLEARANCE_RATE: String(clearanceRate),
    ACTIVE_CASES: String(activeCases),
    REPEAT_OFFENDERS: "—",
    CRIME_CATEGORY_ROWS: categoryRows,
    STATION_ROWS: stationRows,
    TREND_ALERTS: trendAlerts,
  });

  const smartbrowz = app.smartbrowz();
  const pdfResult = await smartbrowz.generatePdf({ html_content: html, page_size: "A4", margin: "15mm" });

  const stratus = app.stratus();
  const fileKey = `reports/district-${districtId}-${Date.now()}.pdf`;
  const fileResponse = await stratus.saveAsFile({
    file_name: fileKey,
    file_content: pdfResult.pdf_content,
    content_type: "application/pdf",
  });

  res.status(200).json({
    status: "success",
    data: {
      reportId: fileKey,
      downloadUrl: fileResponse.download_url || `/api/reports/download?key=${fileKey}`,
      generatedAt: new Date().toISOString(),
    },
  });
}

async function handleCaseReport(req, res) {
  const app = catalyst.initialize(req);
  const { caseId } = JSON.parse(req.body);
  const query = app.datastore().getTable("CaseMaster").getQuery();

  const caseRows = await query.execute(`
    SELECT cm.*, cg.CrimeGroupName, cs.CaseStatusName, u.UnitName,
           d.DistrictName, g.LookupValue as Gravity, cc.LookupValue as Category
    FROM CaseMaster cm
    LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
    LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
    LEFT JOIN Unit u ON cm.UnitID = u.UnitID
    LEFT JOIN District d ON u.DistrictID = d.DistrictID
    LEFT JOIN GravityOffence g ON cm.GravityOffenceID = g.GravityOffenceID
    LEFT JOIN CaseCategory cc ON cm.CaseCategoryID = cc.CaseCategoryID
    WHERE cm.CaseMasterID = ?
  `, { params: [parseInt(caseId)] });

  if (!caseRows || caseRows.length === 0) {
    return res.status(404).json({ status: "error", error: { code: "NOT_FOUND", message: "Case not found" } });
  }
  const c = caseRows[0];

  const template = loadTemplate("case-report");
  const html = render(template, {
    CRIME_NO: c.CrimeNo || "—",
    CASE_NO: c.CaseNo || "—",
    REGISTERED_DATE: c.CrimeRegisteredDate ? new Date(c.CrimeRegisteredDate).toLocaleDateString("en-IN") : "—",
    DISTRICT: c.DistrictName || "—",
    STATION: c.UnitName || "—",
    CRIME_HEAD: c.CrimeGroupName || "—",
    CASE_CATEGORY: c.Category || "—",
    GRAVITY: c.Gravity || "—",
    STATUS: c.CaseStatusName || "—",
    ACTS_SECTIONS: "—",
    BRIEF_FACTS: c.BriefFacts || "—",
    COMPLAINANT_TABLE: '<p style="color:#64748b;">No complainants recorded.</p>',
    VICTIM_COUNT: "0",
    VICTIM_TABLE: '<p style="color:#64748b;">No victims recorded.</p>',
    ACCUSED_COUNT: "0",
    ACCUSED_TABLE: '<p style="color:#64748b;">No accused recorded.</p>',
    CHARGESHEET_SECTION: "",
    GENERATED_AT: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  });

  const smartbrowz = app.smartbrowz();
  const pdfResult = await smartbrowz.generatePdf({ html_content: html, page_size: "A4", margin: "15mm" });

  const stratus = app.stratus();
  const fileKey = `reports/case-${caseId}-${Date.now()}.pdf`;
  const fileResponse = await stratus.saveAsFile({
    file_name: fileKey,
    file_content: pdfResult.pdf_content,
    content_type: "application/pdf",
  });

  res.status(200).json({
    status: "success",
    data: {
      reportId: fileKey,
      downloadUrl: fileResponse.download_url || `/api/reports/download?key=${fileKey}`,
      generatedAt: new Date().toISOString(),
    },
  });
}

module.exports = handler;
