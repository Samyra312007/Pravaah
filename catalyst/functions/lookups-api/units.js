const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const { districtId } = req.query;
    let zcql = "SELECT UnitID, UnitName FROM Unit WHERE Active = TRUE";
    if (districtId) zcql += ` AND DistrictID = ${parseInt(districtId)}`;
    zcql += " ORDER BY UnitName";
    const data = await query.execute(zcql);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
