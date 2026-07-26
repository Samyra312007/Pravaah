const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "district_comparison", async () => {
      const query = getQuery(req);
      const zcql = `
        SELECT d.DistrictName,
               COUNT(cm.CaseMasterID) as totalCases,
               SUM(CASE WHEN g_o.LookupValue = 'Heinous' THEN 1 ELSE 0 END) as heinousCases,
               SUM(CASE WHEN cm.CaseStatusID IN (4,5) THEN 1 ELSE 0 END) as resolvedCases,
               ROUND(SUM(CASE WHEN cm.CaseStatusID IN (4,5) THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(cm.CaseMasterID), 0), 2) as clearanceRate,
               COUNT(DISTINCT cm.PolicePersonID) as investigatorsDeployed
        FROM District d
        JOIN Unit u ON d.DistrictID = u.DistrictID
        JOIN CaseMaster cm ON u.UnitID = cm.UnitID
        LEFT JOIN GravityOffence g_o ON cm.GravityOffenceID = g_o.GravityOffenceID
        GROUP BY d.DistrictName
        ORDER BY totalCases DESC
      `;
      return await query.execute(zcql);
    }, 600);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
