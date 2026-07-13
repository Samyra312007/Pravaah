const catalyst = require("zcatalyst-sdk-node");
const { sanitizeString } = require("../common/validators");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const app = catalyst.initialize(req);
    const data = JSON.parse(req.body);
    const table = app.datastore().getTable("CaseMaster");

    const row = { CaseMasterID: parseInt(id) };
    const fields = [
      "CrimeNo", "CaseNo", "CrimeRegisteredDate", "IncidentFromDate", "IncidentToDate",
      "InfoReceivedPSDate", "latitude", "longitude", "BriefFacts", "PolicePersonID",
      "UnitID", "CaseCategoryID", "GravityOffenceID", "CrimeMajorHeadID", "CrimeMinorHeadID",
      "CaseStatusID", "CourtID",
    ];
    fields.forEach((f) => {
      if (data[f] !== undefined) row[f] = f === "BriefFacts" || f.endsWith("No") || f.endsWith("Name") ? sanitizeString(data[f]) : data[f];
    });

    const updated = await table.updateRow(row);
    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: { code: "VALIDATION", message: err.message } });
  }
}

module.exports = handler;
