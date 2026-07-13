const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const query = getQuery(req);
    const zcql = `
      SELECT YEAR(CrimeRegisteredDate) as year, MONTH(CrimeRegisteredDate) as month, COUNT(*) as count
      FROM CaseMaster
      WHERE CrimeRegisteredDate IS NOT NULL
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT 24
    `;
    const result = await query.execute(zcql);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
