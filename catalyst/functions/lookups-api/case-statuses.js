const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "lookups_case_statuses", async () => {
      const query = getQuery(req);
      return await query.execute("SELECT CaseStatusID, CaseStatusName FROM CaseStatusMaster ORDER BY CaseStatusID");
    }, 3600);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
