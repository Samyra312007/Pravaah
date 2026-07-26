const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const zcql = `
      SELECT a1.AccusedName as accused1, a2.AccusedName as accused2,
             COUNT(DISTINCT a1.CaseMasterID) as casesInCommon
      FROM Accused a1
      JOIN Accused a2 ON a1.CaseMasterID = a2.CaseMasterID AND a1.AccusedMasterID < a2.AccusedMasterID
      GROUP BY a1.AccusedName, a2.AccusedName
      HAVING casesInCommon > 0
      ORDER BY casesInCommon DESC
    `;
    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
