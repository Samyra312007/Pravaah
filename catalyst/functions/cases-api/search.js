const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: "error", error: { code: "VALIDATION", message: "Search query required" } });
    }

    const query = getQuery(req);
    const zcql = `SELECT * FROM CaseMaster WHERE CrimeNo LIKE '%${q}%' OR CaseNo LIKE '%${q}%' OR BriefFacts LIKE '%${q}%'`;
    const result = await query.execute(zcql);

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
