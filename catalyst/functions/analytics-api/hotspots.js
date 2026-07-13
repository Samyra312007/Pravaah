const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const zcql = `
      SELECT UnitID, ROUND(latitude, 2) as lat, ROUND(longitude, 2) as lng,
             CrimeMajorHeadID, COUNT(*) as count
      FROM CaseMaster
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      GROUP BY UnitID, lat, lng, CrimeMajorHeadID
      HAVING count > 1
      ORDER BY count DESC
    `;
    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
