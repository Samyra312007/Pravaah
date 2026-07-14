const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "dashboard_kpis", async () => {
      const query = getQuery(req);
      const totalResult = await query.execute("SELECT COUNT(*) as total FROM CaseMaster");
      const totalCases = totalResult[0]?.total || 0;

      const heinousResult = await query.execute(
        `SELECT COUNT(*) as count FROM CaseMaster cm
         JOIN GravityOffence g_o ON cm.GravityOffenceID = g_o.GravityOffenceID
         WHERE g_o.LookupValue = 'Heinous'`
      );
      const heinousCases = heinousResult[0]?.count || 0;

      const resolvedResult = await query.execute(
        "SELECT COUNT(*) as count FROM CaseMaster WHERE CaseStatusID IN (4,5)"
      );
      const resolvedCases = resolvedResult[0]?.count || 0;

      const activeResult = await query.execute(
        "SELECT COUNT(*) as count FROM CaseMaster WHERE CaseStatusID NOT IN (4,5,6)"
      );
      const activeInvestigations = activeResult[0]?.count || 0;

      const repeatResult = await query.execute(
        `SELECT COUNT(DISTINCT a.PersonID) as count FROM Accused a
         WHERE a.PersonID IS NOT NULL`
      );
      const repeatOffenderCount = repeatResult[0]?.count || 0;

      return {
        totalCases,
        heinousCases,
        resolvedCases,
        clearanceRate: totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0,
        activeInvestigations,
        repeatOffenderCount,
        anomalyCount: 0, // computed by cron
      };
    }, 300);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
