const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const zcql = `
      SELECT a.AccusedName, a.PersonID, COUNT(DISTINCT a.CaseMasterID) as caseCount
      FROM Accused a
      GROUP BY a.AccusedName, a.PersonID
      HAVING caseCount > 1
      ORDER BY caseCount DESC
    `;
    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
