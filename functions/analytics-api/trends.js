const { getQuery } = require("../common/db");
const { getCache } = require("../common/cache");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const zcql = `
      SELECT YEAR(CrimeRegisteredDate) as year, MONTH(CrimeRegisteredDate) as month, COUNT(*) as count
      FROM CaseMaster
      WHERE CrimeRegisteredDate IS NOT NULL
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT 24
    `;
    const result = await query.execute(zcql);

    // Annotate with anomaly markers using cached 2σ stats from nightly cron
    const cache = getCache(req);
    let threshold = null;
    let mean = null;
    try {
      const stats = await cache.get("trend_stats");
      if (stats) {
        const parsed = JSON.parse(stats);
        mean = parsed.mean;
        threshold = parsed.threshold;
      }
    } catch { /* cache miss — compute inline as fallback */ }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = result.map((r) => {
      const label = `${monthNames[r.month - 1]} ${r.year}`;
      let isAnomaly = false;
      if (threshold !== null && mean !== null) {
        isAnomaly = r.count > threshold;
      }
      return { ...r, label, isAnomaly };
    });

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
