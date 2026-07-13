const { getDb } = require("../common/db");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const data = JSON.parse(req.body);
    data.CaseMasterID = parseInt(id);

    const table = getDb(req);
    const result = await table.updateRow(data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(400).json({ status: "error", error: { code: "VALIDATION", message: err.message } });
  }
}

module.exports = handler;
