const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);

    // Spatiotemporal query: group by time block AND location
    const zcql = `
      SELECT
        UnitID,
        ROUND(latitude, 2) as latBucket,
        ROUND(longitude, 2) as lngBucket,
        CrimeMajorHeadID,
        CASE
          WHEN HOUR(CrimeRegisteredDate) BETWEEN 0 AND 3 THEN '00-04'
          WHEN HOUR(CrimeRegisteredDate) BETWEEN 4 AND 7 THEN '04-08'
          WHEN HOUR(CrimeRegisteredDate) BETWEEN 8 AND 11 THEN '08-12'
          WHEN HOUR(CrimeRegisteredDate) BETWEEN 12 AND 15 THEN '12-16'
          WHEN HOUR(CrimeRegisteredDate) BETWEEN 16 AND 19 THEN '16-20'
          ELSE '20-24'
        END as timeBlock,
        COUNT(*) as incidentCount
      FROM CaseMaster
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
      GROUP BY UnitID, latBucket, lngBucket, CrimeMajorHeadID, timeBlock
      HAVING incidentCount > 0
      ORDER BY incidentCount DESC
    `;
    const result = await query.execute(zcql);

    // Also fetch district name for each unit
    const districtMap = {};
    try {
      const units = await query.execute(
        `SELECT u.UnitID, d.DistrictName
         FROM Unit u JOIN District d ON u.DistrictID = d.DistrictID`
      );
      for (const u of units) {
        districtMap[u.UnitID] = u.DistrictName;
      }
    } catch { /* best-effort */ }

    // Enrich with district name and crime head name
    const enriched = result.map((r) => ({
      districtName: districtMap[r.UnitID] || `District ${r.UnitID}`,
      timeBlock: r.timeBlock,
      latBucket: r.latBucket,
      lngBucket: r.lngBucket,
      crimeGroupName: `CrimeHead ${r.CrimeMajorHeadID}`,
      incidentCount: r.incidentCount,
    }));

    res.status(200).json({ status: "success", data: enriched });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
