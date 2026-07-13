const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const table = app.datastore().getTable("ArrestSurrender");
    const query = app.datastore().getTable("ArrestSurrender").getQuery();

    if (req.method === "GET") {
      const result = await query.execute(`SELECT * FROM ArrestSurrender WHERE CaseMasterID = ${id}`);
      return res.status(200).json({ status: "success", data: result });
    }

    if (req.method === "POST") {
      const body = JSON.parse(req.body);
      const row = {
        CaseMasterID: parseInt(id), ArrestSurrenderTypeID: body.ArrestSurrenderTypeID,
        ArrestSurrenderDate: body.ArrestSurrenderDate, ArrestSurrenderStateId: body.ArrestSurrenderStateId,
        ArrestSurrenderDistrictId: body.ArrestSurrenderDistrictId, UnitID: body.UnitID,
        IOID: body.IOID, CourtID: body.CourtID, AccusedMasterID: body.AccusedMasterID,
      };
      const created = await table.insertRow(row);
      return res.status(201).json({ status: "success", data: created });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
