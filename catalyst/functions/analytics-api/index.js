const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "dashboard_kpis", async () => {
      const query = getQuery(req);
      const totalResult = await query.execute("SELECT COUNT(*) as total FROM CaseMaster");
      // Additional KPI queries would go here
      return {
        totalCases: totalResult[0]?.total || 0,
        activeInvestigations: 0,
        clearanceRate: 0,
        anomalyCount: 0,
      };
    }, 300);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
