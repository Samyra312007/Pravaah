const { getDb } = require("../common/db");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const table = getDb(req);
    const result = await table.getRow(id);

    if (!result) {
      return res.status(404).json({ status: "error", error: { code: "NOT_FOUND", message: "Case not found" } });
    }

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
