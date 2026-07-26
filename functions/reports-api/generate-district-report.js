const catalyst = require("zcatalyst-sdk-node");
const { loadTemplate, render, renderTable } = require("./template-engine");

function buildAlertHtml(alerts) {
  if (!alerts || alerts.length === 0) {
    return '<p style="color: #64748b; font-size: 12px;">No significant trend alerts for this period.</p>';
  }
  return alerts
    .map(
      (a) => `
    <div class="alert-box">
      <h4>${a.crimeType} — ${a.increase}% Increase</h4>
      <p>${a.message}</p>
    </div>`
    )
    .join("");
}

async function handler(req, res) {
  try {
    const { districtId, districtName, periodStart, periodEnd } = JSON.parse(req.body);
    const app = catalyst.initialize(req);
    const query = app.datastore().getTable("CaseMaster").getQuery();
    const cache = app.cache();

    const cachedAlerts = await cache.get("trend_alerts");
    const alerts = cachedAlerts ? JSON.parse(cachedAlerts) : [];

    const districtQuery = `
      SELECT cm.CaseMasterID, cm.CrimeNo, cm.CrimeRegisteredDate, cm.BriefFacts,
             cg.CrimeGroupName, cs.CaseStatusName, u.UnitName, g.LookupValue as Gravity
      FROM CaseMaster cm
      LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
      LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
      LEFT JOIN Unit u ON cm.UnitID = u.UnitID
      LEFT JOIN GravityOffence g ON cm.GravityOffenceID = g.GravityOffenceID
      WHERE u.DistrictID = ?
    `;
    const rows = await query.execute(districtQuery, { params: [parseInt(districtId)] });

    const totalCases = rows.length;
    const heinousCases = rows.filter((r) => r.Gravity === "Heinous").length;
    const activeCases = rows.filter((r) => r.CaseStatusName === "Under Investigation").length;
    const resolvedCases = rows.filter((r) => ["Convicted", "Closed", "Acquitted"].includes(r.CaseStatusName)).length;
    const clearanceRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;
    const stations = [...new Set(rows.map((r) => r.UnitName).filter(Boolean))];

    const crimeCategories = {};
    for (const r of rows) {
      const name = r.CrimeGroupName || "Unknown";
      crimeCategories[name] = (crimeCategories[name] || 0) + 1;
    }
    const categoryRows = Object.entries(crimeCategories).map(([name, count]) => ({
      category: name,
      count: String(count),
      pct: totalCases > 0 ? Math.round((count / totalCases) * 100) + "%" : "0%",
      trend: "—",
    }));

    const stationRows = stations.map((s) => {
      const stationCases = rows.filter((r) => r.UnitName === s);
      const stationResolved = stationCases.filter((r) =>
        ["Convicted", "Closed", "Acquitted"].includes(r.CaseStatusName)
      ).length;
      const stationActive = stationCases.filter((r) => r.CaseStatusName === "Under Investigation").length;
      return {
        name: s,
        total: String(stationCases.length),
        active: String(stationActive),
        resolved: String(stationResolved),
        clearance:
          stationCases.length > 0
            ? Math.round((stationResolved / stationCases.length) * 100) + "%"
            : "0%",
      };
    });

    const { bodyRows: catBody } = renderTable(categoryRows, [
      { key: "category", label: "Crime Category" },
      { key: "count", label: "Count" },
      { key: "pct", label: "% Total" },
      { key: "trend", label: "Trend" },
    ]);
    const { bodyRows: stationBody } = renderTable(stationRows, [
      { key: "name", label: "Police Station" },
      { key: "total", label: "Total Cases" },
      { key: "active", label: "Active" },
      { key: "resolved", label: "Resolved" },
      { key: "clearance", label: "Clearance %" },
    ]);

    const template = loadTemplate("district-summary");
    const html = render(template, {
      DISTRICT_NAME: districtName || `District #${districtId}`,
      PERIOD_START: periodStart || "—",
      PERIOD_END: periodEnd || "—",
      GENERATED_AT: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      TOTAL_CASES: String(totalCases),
      HEINOUS_CASES: String(heinousCases),
      CLEARANCE_RATE: String(clearanceRate),
      ACTIVE_CASES: String(activeCases),
      REPEAT_OFFENDERS: "—",
      CRIME_CATEGORY_ROWS: catBody,
      STATION_ROWS: stationBody,
      TREND_ALERTS: buildAlertHtml(
        alerts.filter((a) => a.district === districtName)
      ),
    });

    const smartbrowz = app.smartbrowz();
    const pdfResult = await smartbrowz.generatePdf({
      html_content: html,
      page_size: "A4",
      margin: "15mm",
      scale: 1,
    });

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
        pages: pdfResult.page_count || 1,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: { code: "REPORT_GEN_FAILED", message: err.message },
    });
  }
}

module.exports = handler;
