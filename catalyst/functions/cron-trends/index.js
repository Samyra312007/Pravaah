const catalyst = require("zcatalyst-sdk-node");

async function handler(context) {
  try {
    const app = catalyst.initialize(context);
    const query = app.datastore().getTable("CaseMaster").getQuery();

    // Calculate monthly averages and detect 2-sigma deviations
    const zcql = `
      SELECT MONTH(CrimeRegisteredDate) as month, YEAR(CrimeRegisteredDate) as year,
             CrimeMajorHeadID, COUNT(*) as count
      FROM CaseMaster
      WHERE CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY year, month, CrimeMajorHeadID
    `;

    const result = await query.execute(zcql);
    // Trend analysis and alert generation logic — Phase 5

    const cache = app.cache();
    await cache.put("nightly_trends", JSON.stringify(result), 43200);

    return { status: "success", recordsProcessed: result.length };
  } catch (err) {
    console.error("Nightly trend job failed:", err.message);
    return { status: "error", message: err.message };
  }
}

module.exports = handler;
