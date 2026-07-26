const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const table = app.datastore().getTable("Victim");
    const query = app.datastore().getTable("Victim").getQuery();

    if (req.method === "GET") {
      const result = await query.execute("SELECT * FROM Victim WHERE CaseMasterID = :id", { id: parseInt(id) });
      return res.status(200).json({ status: "success", data: result });
    }

    if (req.method === "POST") {
      const body = JSON.parse(req.body);
      const row = { CaseMasterID: parseInt(id), VictimName: body.VictimName, AgeYear: body.AgeYear, GenderID: body.GenderID, VictimPolice: body.VictimPolice };
      const created = await table.insertRow(row);
      return res.status(201).json({ status: "success", data: created });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
