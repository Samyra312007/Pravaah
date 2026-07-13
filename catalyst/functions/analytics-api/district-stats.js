const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const query = getQuery(req);
    const zcql = `
      SELECT d.DistrictName, COUNT(cm.CaseMasterID) as totalCases,
             SUM(CASE WHEN cm.CaseStatusID IN (4,5) THEN 1 ELSE 0 END) as resolvedCases
      FROM District d
      JOIN Unit u ON d.DistrictID = u.DistrictID
      JOIN CaseMaster cm ON u.UnitID = cm.UnitID
      WHERE d.DistrictID = ${id}
      GROUP BY d.DistrictName
    `;
    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result[0] || null });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
