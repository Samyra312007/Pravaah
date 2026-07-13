const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const { page = 1, perPage = 50, districtId, unitId, crimeHeadId, statusId } = req.query;

    let zcql = `SELECT * FROM CaseMaster`;
    const conditions = [];

    if (districtId) conditions.push(`UnitID IN (SELECT UnitID FROM Unit WHERE DistrictID = ${districtId})`);
    if (unitId) conditions.push(`UnitID = ${unitId}`);
    if (crimeHeadId) conditions.push(`CrimeMajorHeadID = ${crimeHeadId}`);
    if (statusId) conditions.push(`CaseStatusID = ${statusId}`);

    if (conditions.length > 0) {
      zcql += ` WHERE ${conditions.join(" AND ")}`;
    }

    zcql += ` LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`;

    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result, meta: { page, perPage } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
