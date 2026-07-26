const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const table = app.datastore().getTable("ActSectionAssociation");
    const query = app.datastore().getTable("ActSectionAssociation").getQuery();

    if (req.method === "GET") {
      const result = await query.execute(`SELECT a.*, act.ActDescription, act.ShortName, s.SectionDescription
        FROM ActSectionAssociation a
        JOIN Act act ON a.ActID = act.ActCode
        JOIN Section s ON a.ActID = s.ActCode AND a.SectionID = s.SectionCode
        WHERE a.CaseMasterID = :id`, { id: parseInt(id) });
      return res.status(200).json({ status: "success", data: result });
    }

    if (req.method === "POST") {
      const body = JSON.parse(req.body);
      if (body._action === "remove") {
        await query.execute("DELETE FROM ActSectionAssociation WHERE CaseMasterID = :id AND ActID = :actId AND SectionID = :sectionId", { id: parseInt(id), actId: parseInt(body.ActID), sectionId: body.SectionID });
        return res.status(200).json({ status: "success", data: { removed: true } });
      }
      const row = { CaseMasterID: parseInt(id), ActID: body.ActID, SectionID: body.SectionID, ActOrderID: body.ActOrderID, SectionOrderID: body.SectionOrderID };
      const created = await table.insertRow(row);
      return res.status(201).json({ status: "success", data: created });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
