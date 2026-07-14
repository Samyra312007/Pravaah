const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const {
      q, page = 1, perPage = 50,
      districtId, unitId, crimeHeadId, statusId,
      dateFrom, dateTo,
    } = req.query;

    const query = getQuery(req);
    const conditions = [];
    const params = {};

    if (q && q.trim()) {
      conditions.push(`(cm.CrimeNo LIKE :q OR cm.CaseNo LIKE :q OR cm.BriefFacts LIKE :q
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM Accused WHERE AccusedName LIKE :q2)
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM Victim WHERE VictimName LIKE :q2)
                 OR cm.CaseMasterID IN (SELECT CaseMasterID FROM ComplainantDetails WHERE ComplainantName LIKE :q2))`);
      params.q = `%${q}%`;
      params.q2 = `%${q}%`;
    }
    if (districtId) { conditions.push("u.DistrictID = :districtId"); params.districtId = parseInt(districtId); }
    if (unitId) { conditions.push("cm.UnitID = :unitId"); params.unitId = parseInt(unitId); }
    if (crimeHeadId) { conditions.push("cm.CrimeMajorHeadID = :crimeHeadId"); params.crimeHeadId = parseInt(crimeHeadId); }
    if (statusId) { conditions.push("cm.CaseStatusID = :statusId"); params.statusId = parseInt(statusId); }
    if (dateFrom) { conditions.push("cm.CrimeRegisteredDate >= :dateFrom"); params.dateFrom = dateFrom; }
    if (dateTo) { conditions.push("cm.CrimeRegisteredDate <= :dateTo"); params.dateTo = dateTo; }

    const baseColumns = `
      SELECT cm.*, d.DistrictName, u.UnitName, cs.CaseStatusName,
             ch.CrimeGroupName, g_o.LookupValue as GravityOffence
      FROM CaseMaster cm
      LEFT JOIN Unit u ON cm.UnitID = u.UnitID
      LEFT JOIN District d ON u.DistrictID = d.DistrictID
      LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
      LEFT JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID
      LEFT JOIN GravityOffence g_o ON cm.GravityOffenceID = g_o.GravityOffenceID
    `;

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : " WHERE 1=1";

    const countZcql = `SELECT COUNT(*) as total FROM CaseMaster cm LEFT JOIN Unit u ON cm.UnitID = u.UnitID${where}`;
    const countResult = await query.execute(countZcql, params);
    const total = countResult[0]?.total || 0;

    const pageInt = parseInt(page);
    const perPageInt = parseInt(perPage);
    const offset = (pageInt - 1) * perPageInt;
    const dataZcql = `${baseColumns}${where} ORDER BY cm.CrimeRegisteredDate DESC LIMIT ${perPageInt} OFFSET ${offset}`;
    const result = await query.execute(dataZcql, params);

    res.status(200).json({ status: "success", data: result, meta: { page: pageInt, perPage: perPageInt, total } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
