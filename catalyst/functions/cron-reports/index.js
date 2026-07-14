const catalyst = require("zcatalyst-sdk-node");

const DISTRICTS = [
  { id: 1, name: "Bengaluru Urban" }, { id: 2, name: "Bengaluru Rural" },
  { id: 3, name: "Mysuru" }, { id: 4, name: "Hubballi-Dharwad" },
  { id: 5, name: "Belagavi" }, { id: 6, name: "Kalaburagi" },
  { id: 7, name: "Mangaluru" }, { id: 8, name: "Shivamogga" },
  { id: 9, name: "Ballari" }, { id: 10, name: "Davangere" },
  { id: 11, name: "Tumakuru" }, { id: 12, name: "Udupi" },
  { id: 13, name: "Hassan" }, { id: 14, name: "Raichur" },
  { id: 15, name: "Kolar" },
];

async function handler(context) {
  try {
    const app = catalyst.initialize(context);
    const reports = [];

    for (const d of DISTRICTS) {
      try {
        const query = app.datastore().getTable("CaseMaster").getQuery();
        const rows = await query.execute(`
          SELECT cm.CaseMasterID, cm.CrimeNo, cg.CrimeGroupName, cs.CaseStatusName, u.UnitName
          FROM CaseMaster cm
          LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
          LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
          LEFT JOIN Unit u ON cm.UnitID = u.UnitID
          WHERE u.DistrictID = ? AND cm.CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
        `, { params: [d.id] });

        const totalCases = rows.length;
        const activeCases = rows.filter(r => r.CaseStatusName === "Under Investigation").length;
        const resolvedCases = rows.filter(r => ["Convicted", "Closed"].includes(r.CaseStatusName)).length;

        const crimeCategories = {};
        for (const r of rows) {
          const name = r.CrimeGroupName || "Unknown";
          crimeCategories[name] = (crimeCategories[name] || 0) + 1;
        }

        const crashSummary = Object.entries(crimeCategories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => `${name}: ${count}`)
          .join("; ");

        const html = `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e3a5f; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">Weekly Report — ${d.name}</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #e2e8f0;">
              <p><strong>Period:</strong> Last 7 Days</p>
              <p><strong>Total Cases:</strong> ${totalCases}</p>
              <p><strong>Active Investigations:</strong> ${activeCases}</p>
              <p><strong>Resolved:</strong> ${resolvedCases}</p>
              <p><strong>Crime Breakdown:</strong><br/>${crashSummary || "No data"}</p>
            </div>
          </div>
        `;

        const smartbrowz = app.smartbrowz();
        const pdf = await smartbrowz.generatePdf({ html_content: html, page_size: "A4" });

        const stratus = app.stratus();
        const fileKey = `reports/weekly-${d.id}-${Date.now()}.pdf`;
        await stratus.saveAsFile({
          file_name: fileKey,
          file_content: pdf.pdf_content,
          content_type: "application/pdf",
        });

        const mail = app.mail();
        await mail.sendMail({
          to: [`sp-${d.name.toLowerCase().replace(/\s+/g, "")}@ksp.karnataka.gov.in`, `scrb-team@ksp.karnataka.gov.in`],
          subject: `Weekly Intelligence Report — ${d.name}`,
          html: `<p>The weekly intelligence report for <strong>${d.name}</strong> is ready.</p><p>Total cases: ${totalCases}</p>`,
          category: "weekly-report",
        });

        reports.push({ districtId: d.id, districtName: d.name, totalCases, generated: true });
      } catch (err) {
        console.error(`Failed to generate report for ${d.name}:`, err.message);
        reports.push({ districtId: d.id, districtName: d.name, totalCases: 0, generated: false, error: err.message });
      }
    }

    const successCount = reports.filter(r => r.generated).length;
    return { status: "success", districtsProcessed: DISTRICTS.length, reportsGenerated: successCount, reports };
  } catch (err) {
    console.error("Weekly report cron failed:", err.message);
    return { status: "error", message: err.message };
  }
}

module.exports = handler;
