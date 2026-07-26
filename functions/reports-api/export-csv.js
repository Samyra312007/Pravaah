const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const app = catalyst.initialize(req);
    const query = app.datastore().getTable("CaseMaster").getQuery();

    const { districtId, dateFrom, dateTo, crimeHeadId } = req.query || {};

    let sql = `
      SELECT cm.CrimeNo, cm.CaseNo, cm.CrimeRegisteredDate,
             cg.CrimeGroupName, cs.CaseStatusName, u.UnitName,
             d.DistrictName, g.LookupValue as Gravity,
             cm.BriefFacts
      FROM CaseMaster cm
      LEFT JOIN CrimeHead cg ON cm.CrimeMajorHeadID = cg.CrimeHeadID
      LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
      LEFT JOIN Unit u ON cm.UnitID = u.UnitID
      LEFT JOIN District d ON u.DistrictID = d.DistrictID
      LEFT JOIN GravityOffence g ON cm.GravityOffenceID = g.GravityOffenceID
      WHERE 1=1
    `;
    const params = [];

    if (districtId) { sql += " AND u.DistrictID = ?"; params.push(parseInt(districtId)); }
    if (dateFrom) { sql += " AND cm.CrimeRegisteredDate >= ?"; params.push(dateFrom); }
    if (dateTo) { sql += " AND cm.CrimeRegisteredDate <= ?"; params.push(dateTo); }
    if (crimeHeadId) { sql += " AND cm.CrimeMajorHeadID = ?"; params.push(parseInt(crimeHeadId)); }
    sql += " ORDER BY cm.CrimeRegisteredDate DESC";

    const rows = await query.execute(sql, { params });

    const headers = ["CrimeNo", "CaseNo", "RegisteredDate", "CrimeType", "Status", "Station", "District", "Gravity", "BriefFacts"];
    const csvRows = [headers.join(",")];
    for (const r of rows) {
      const values = headers.map((h) => {
        const val = r[h] || r[h.replace(/([A-Z])/g, "_$1").toUpperCase()] || "";
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvRows.push(values.join(","));
    }

    const csv = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="cases-export-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "EXPORT_FAILED", message: err.message } });
  }
}

module.exports = handler;
