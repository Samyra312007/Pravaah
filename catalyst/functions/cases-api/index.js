const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const {
      page = 1, perPage = 50, sortBy = "CrimeRegisteredDate", sortOrder = "DESC",
      districtId, unitId, crimeHeadId, statusId, gravityId,
      dateFrom, dateTo, searchQuery
    } = req.query;

    const query = getQuery(req);

    let baseQuery = `
      SELECT cm.*, d.DistrictName, u.UnitName, cs.CaseStatusName,
             ch.CrimeGroupName, g_o.LookupValue as GravityOffence,
             (SELECT COUNT(*) FROM Victim WHERE CaseMasterID = cm.CaseMasterID) as VictimCount,
             (SELECT COUNT(*) FROM Accused WHERE CaseMasterID = cm.CaseMasterID) as AccusedCount
      FROM CaseMaster cm
      LEFT JOIN Unit u ON cm.UnitID = u.UnitID
      LEFT JOIN District d ON u.DistrictID = d.DistrictID
      LEFT JOIN CaseStatusMaster cs ON cm.CaseStatusID = cs.CaseStatusID
      LEFT JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID
      LEFT JOIN GravityOffence g_o ON cm.GravityOffenceID = g_o.GravityOffenceID
    `;

    const conditions = [];
    const params = {};

    if (districtId) { conditions.push("u.DistrictID = :districtId"); params.districtId = parseInt(districtId); }
    if (unitId) { conditions.push("cm.UnitID = :unitId"); params.unitId = parseInt(unitId); }
    if (crimeHeadId) { conditions.push("cm.CrimeMajorHeadID = :crimeHeadId"); params.crimeHeadId = parseInt(crimeHeadId); }
    if (statusId) { conditions.push("cm.CaseStatusID = :statusId"); params.statusId = parseInt(statusId); }
    if (gravityId) { conditions.push("cm.GravityOffenceID = :gravityId"); params.gravityId = parseInt(gravityId); }
    if (dateFrom) { conditions.push("cm.CrimeRegisteredDate >= :dateFrom"); params.dateFrom = dateFrom; }
    if (dateTo) { conditions.push("cm.CrimeRegisteredDate <= :dateTo"); params.dateTo = dateTo; }

    if (searchQuery) {
      conditions.push("(cm.CrimeNo LIKE :search OR cm.CaseNo LIKE :search OR cm.BriefFacts LIKE :search2)");
      params.search = `%${searchQuery}%`;
      params.search2 = `%${searchQuery}%`;
    }

    let countQuery = `SELECT COUNT(*) as total FROM CaseMaster cm LEFT JOIN Unit u ON cm.UnitID = u.UnitID`;
    if (conditions.length > 0) {
      const where = ` WHERE ${conditions.join(" AND ")}`;
      baseQuery += where;
      countQuery += where;
    }

    const allowedSort = ["CrimeRegisteredDate", "CrimeNo", "CaseNo", "CrimeMajorHeadID", "CaseStatusID"];
    const col = allowedSort.includes(sortBy) ? sortBy : "CrimeRegisteredDate";
    const order = sortOrder === "ASC" ? "ASC" : "DESC";
    baseQuery += ` ORDER BY cm.${col} ${order}`;

    const offset = (parseInt(page) - 1) * parseInt(perPage);
    baseQuery += ` LIMIT ${parseInt(perPage)} OFFSET ${offset}`;

    const [totalResult, cases] = await Promise.all([
      query.execute(countQuery),
      query.execute(baseQuery),
    ]);

    res.status(200).json({
      status: "success",
      data: cases,
      meta: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total: totalResult[0]?.total || 0,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
