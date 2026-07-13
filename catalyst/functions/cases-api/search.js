const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const {
      q, page = 1, perPage = 50,
      districtId, unitId, crimeHeadId, statusId,
      dateFrom, dateTo,
    } = req.query;

    const query = getQuery(req);

    let zcql = `
      SELECT cm.*, d.DistrictName, u.UnitName, cs.CaseStatusName,
             ch.CrimeGroupName, g_o.LookupValue as GravityOffence
      FROM CaseMaster cm
      LEFT JOIN Unit u ON cm.UnitID = u.UnitID
      LEFT JOIN District d ON u.DistrictID = d.DistrictID
      LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
      LEFT JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID
      LEFT JOIN GravityOffence g_o ON cm.GravityOffenceID = g_o.GravityOffenceID
      WHERE 1=1
    `;

    if (q && q.trim()) {
      zcql += ` AND (cm.CrimeNo LIKE '%${q}%' OR cm.CaseNo LIKE '%${q}%' OR cm.BriefFacts LIKE '%${q}%'
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM Accused WHERE AccusedName LIKE '%${q}%')
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM Victim WHERE VictimName LIKE '%${q}%')
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM ComplainantDetails WHERE ComplainantName LIKE '%${q}%'))`;
    }
    if (districtId) zcql += ` AND u.DistrictID = ${parseInt(districtId)}`;
    if (unitId) zcql += ` AND cm.UnitID = ${parseInt(unitId)}`;
    if (crimeHeadId) zcql += ` AND cm.CrimeMajorHeadID = ${parseInt(crimeHeadId)}`;
    if (statusId) zcql += ` AND cm.CaseStatusID = ${parseInt(statusId)}`;
    if (dateFrom) zcql += ` AND cm.CrimeRegisteredDate >= '${dateFrom}'`;
    if (dateTo) zcql += ` AND cm.CrimeRegisteredDate <= '${dateTo}'`;

    const countResult = await query.execute(zcql.replace(/SELECT cm\.\*.*FROM/, "SELECT COUNT(*) as total FROM"));
    const total = countResult[0]?.total || 0;

    zcql += ` ORDER BY cm.CrimeRegisteredDate DESC LIMIT ${parseInt(perPage)} OFFSET ${(parseInt(page) - 1) * parseInt(perPage)}`;
    const result = await query.execute(zcql);

    res.status(200).json({ status: "success", data: result, meta: { page: parseInt(page), perPage: parseInt(perPage), total } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
