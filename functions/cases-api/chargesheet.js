const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const table = app.datastore().getTable("ChargesheetDetails");
    const query = app.datastore().getTable("ChargesheetDetails").getQuery();

    if (req.method === "GET") {
      const result = await query.execute("SELECT * FROM ChargesheetDetails WHERE CaseMasterID = :id", { id: parseInt(id) });
      return res.status(200).json({ status: "success", data: result[0] || null });
    }

    if (req.method === "POST") {
      const body = JSON.parse(req.body);
      const existing = await query.execute("SELECT * FROM ChargesheetDetails WHERE CaseMasterID = :id", { id: parseInt(id) });
      if (existing.length > 0) {
        const row = { CSID: existing[0].CSID, CaseMasterID: parseInt(id), csdate: body.csdate, cstype: body.cstype, IOID: body.IOID };
        const updated = await table.updateRow(row);
        return res.status(200).json({ status: "success", data: updated });
      }
      const row = { CaseMasterID: parseInt(id), csdate: body.csdate, cstype: body.cstype, IOID: body.IOID };
      const created = await table.insertRow(row);
      return res.status(201).json({ status: "success", data: created });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
