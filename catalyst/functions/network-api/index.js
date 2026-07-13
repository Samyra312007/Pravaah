const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const { entityId } = req.path_params;
    const query = getQuery(req);

    const cases = await query.execute(
      `SELECT * FROM CaseMaster WHERE CaseMasterID = ${entityId}`
    );

    const accused = await query.execute(
      `SELECT * FROM Accused WHERE CaseMasterID = ${entityId}`
    );

    const victims = await query.execute(
      `SELECT * FROM Victim WHERE CaseMasterID = ${entityId}`
    );

    const nodes = [];
    const edges = [];

    if (cases.length > 0) {
      nodes.push({ id: `case-${entityId}`, label: `Case #${entityId}`, type: "case" });
    }

    accused.forEach((a) => {
      nodes.push({ id: `accused-${a.AccusedMasterID}`, label: a.AccusedName, type: "suspect" });
      edges.push({ source: `accused-${a.AccusedMasterID}`, target: `case-${entityId}`, type: "involved-in" });
    });

    victims.forEach((v) => {
      nodes.push({ id: `victim-${v.VictimMasterID}`, label: v.VictimName, type: "victim" });
      edges.push({ source: `victim-${v.VictimMasterID}`, target: `case-${entityId}`, type: "involved-in" });
    });

    res.status(200).json({ status: "success", data: { nodes, edges } });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
