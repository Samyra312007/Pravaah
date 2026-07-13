const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "lookups_crime_heads", async () => {
      const query = getQuery(req);
      return await query.execute("SELECT CrimeHeadID, CrimeGroupName FROM CrimeHead WHERE Active = TRUE ORDER BY CrimeGroupName");
    }, 3600);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
