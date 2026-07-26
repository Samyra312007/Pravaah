const catalyst = require("zcatalyst-sdk-node");
const { validateRequired, validateDateRange, sanitizeString } = require("../common/validators");

async function handler(req, res) {
  let caseId;
  try {
    const app = catalyst.initialize(req);
    const data = JSON.parse(req.body);

    validateRequired(data, ["CrimeNo", "CaseCategoryID", "GravityOffenceID", "UnitID"]);
    validateDateRange(data.IncidentFromDate, data.IncidentToDate);

    if (data.CrimeRegisteredDate && new Date(data.CrimeRegisteredDate) > new Date()) {
      return res.status(400).json({
        status: "error", error: { code: "VALIDATION", message: "Crime registered date cannot be in the future" },
      });
    }

    const caseMaster = app.datastore().getTable("CaseMaster");
    const row = {
      CrimeNo: sanitizeString(data.CrimeNo),
      CaseNo: sanitizeString(data.CaseNo),
      CrimeRegisteredDate: data.CrimeRegisteredDate,
      IncidentFromDate: data.IncidentFromDate,
      IncidentToDate: data.IncidentToDate,
      InfoReceivedPSDate: data.InfoReceivedPSDate,
      latitude: data.latitude,
      longitude: data.longitude,
      BriefFacts: sanitizeString(data.BriefFacts),
      PolicePersonID: data.PolicePersonID,
      UnitID: data.UnitID,
      CaseCategoryID: data.CaseCategoryID,
      GravityOffenceID: data.GravityOffenceID,
      CrimeMajorHeadID: data.CrimeMajorHeadID,
      CrimeMinorHeadID: data.CrimeMinorHeadID,
      CaseStatusID: data.CaseStatusID || 1,
      CourtID: data.CourtID,
    };

    const created = await caseMaster.insertRow(row);
    caseId = created.CaseMasterID;

    const insertAll = async (tableName, rows, mapper) => {
      if (!rows || rows.length === 0) return;
      const table = app.datastore().getTable(tableName);
      for (const r of rows) {
        await table.insertRow(mapper(r));
      }
    };

    await Promise.all([
      insertAll("Victim", data.victims, (v) => ({
        CaseMasterID: caseId, VictimName: sanitizeString(v.VictimName),
        AgeYear: v.AgeYear, GenderID: v.GenderID, VictimPolice: v.VictimPolice,
      })),
      insertAll("Accused", data.accused, (a) => ({
        CaseMasterID: caseId, AccusedName: sanitizeString(a.AccusedName),
        AgeYear: a.AgeYear, GenderID: a.GenderID, PersonID: a.PersonID,
      })),
      insertAll("ComplainantDetails", data.complainants, (c) => ({
        CaseMasterID: caseId, ComplainantName: sanitizeString(c.ComplainantName),
        AgeYear: c.AgeYear, OccupationID: c.OccupationID, ReligionID: c.ReligionID,
        caste_master_id: c.caste_master_id,
      })),
      insertAll("ActSectionAssociation", data.actSections, (a) => ({
        CaseMasterID: caseId, ActID: a.ActID,
        SectionID: a.SectionID, ActOrderID: a.ActOrderID, SectionOrderID: a.SectionOrderID,
      })),
    ]);

    res.status(201).json({ status: "success", data: { CaseMasterID: caseId } });
  } catch (err) {
    if (caseId) {
      try {
        const app = catalyst.initialize(req);
        await app.datastore().getTable("CaseMaster").deleteRow(caseId);
      } catch (_) {}
    }
    const code = err.message.includes("Required") ? "VALIDATION" : "INTERNAL";
    res.status(code === "VALIDATION" ? 400 : 500).json({
      status: "error", error: { code, message: err.message },
    });
  }
}

module.exports = handler;
