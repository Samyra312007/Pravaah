const { getDb } = require("../common/db");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const table = getDb(req);

    // Soft delete — set status to 'Closed'
    await table.updateRow({ CaseMasterID: parseInt(id), CaseStatusID: 6 });
    res.status(200).json({ status: "success", data: { message: "Case closed successfully" } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
