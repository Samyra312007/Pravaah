const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const table = app.datastore().getTable("CaseMaster");

    await table.updateRow({ CaseMasterID: parseInt(id), CaseStatusID: 6 });
    res.status(200).json({ status: "success", data: { CaseMasterID: parseInt(id), CaseStatusID: 6, message: "Case closed (soft delete)" } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
