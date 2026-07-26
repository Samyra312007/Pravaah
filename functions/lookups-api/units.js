const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const { districtId } = req.query;
    let zcql = "SELECT UnitID, UnitName FROM Unit WHERE Active = TRUE";
    const params = {};
    if (districtId) { zcql += " AND DistrictID = :districtId"; params.districtId = parseInt(districtId); }
    zcql += " ORDER BY UnitName";
    const data = await query.execute(zcql, Object.keys(params).length > 0 ? params : undefined);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
