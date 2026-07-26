const { getQuery } = require("../common/db");
const { getOrSet } = require("../common/cache");

async function handler(req, res) {
  try {
    const data = await getOrSet(req, "lookups_districts", async () => {
      const query = getQuery(req);
      return await query.execute("SELECT DistrictID, DistrictName FROM District WHERE Active = TRUE ORDER BY DistrictName");
    }, 3600);

    res.status(200).json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
