const { getDb } = require("../common/db");
const { validateRequired, validateDateRange } = require("../common/validators");

async function handler(req, res) {
  try {
    const data = JSON.parse(req.body);
    validateRequired(data, ["CrimeNo", "CaseCategoryID", "GravityOffenceID", "UnitID"]);
    validateDateRange(data.IncidentFromDate, data.IncidentToDate);

    const table = getDb(req);
    const result = await table.insertRow(data);
    res.status(201).json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "error", error: { code: "VALIDATION", message: err.message } });
  }
}

module.exports = handler;
