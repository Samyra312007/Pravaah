const catalyst = require("zcatalyst-sdk-node");
const { validateRequired, validateDateRange, sanitizeString } = require("../common/validators");

async function handler(req, res) {
  try {
    const app = catalyst.initialize(req);
    const data = JSON.parse(req.body);

    validateRequired(data, ["CrimeNo", "CaseCategoryID", "GravityOffenceID", "UnitID"]);
    validateDateRange(data.IncidentFromDate, data.IncidentToDate);

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
    const caseId = created.CaseMasterID;

    // Insert related entities
    if (data.victims && data.victims.length > 0) {
      const victimTable = app.datastore().getTable("Victim");
      for (const v of data.victims) {
        await victimTable.insertRow({
          CaseMasterID: caseId, VictimName: sanitizeString(v.VictimName),
          AgeYear: v.AgeYear, GenderID: v.GenderID, VictimPolice: v.VictimPolice,
        });
      }
    }

    if (data.accused && data.accused.length > 0) {
      const accusedTable = app.datastore().getTable("Accused");
      for (const a of data.accused) {
        await accusedTable.insertRow({
          CaseMasterID: caseId, AccusedName: sanitizeString(a.AccusedName),
          AgeYear: a.AgeYear, GenderID: a.GenderID, PersonID: a.PersonID,
        });
      }
    }

    if (data.complainants && data.complainants.length > 0) {
      const compTable = app.datastore().getTable("ComplainantDetails");
      for (const c of data.complainants) {
        await compTable.insertRow({
          CaseMasterID: caseId, ComplainantName: sanitizeString(c.ComplainantName),
          AgeYear: c.AgeYear, OccupationID: c.OccupationID, ReligionID: c.ReligionID,
          caste_master_id: c.caste_master_id,
        });
      }
    }

    if (data.actSections && data.actSections.length > 0) {
      const asTable = app.datastore().getTable("ActSectionAssociation");
      for (const a of data.actSections) {
        await asTable.insertRow({
          CaseMasterID: caseId, ActID: a.ActID,
          SectionID: a.SectionID, ActOrderID: a.ActOrderID, SectionOrderID: a.SectionOrderID,
        });
      }
    }

    res.status(201).json({ status: "success", data: { CaseMasterID: caseId } });
  } catch (err) {
    const code = err.message.includes("Required") ? "VALIDATION" : "INTERNAL";
    res.status(code === "VALIDATION" ? 400 : 500).json({
      status: "error", error: { code, message: err.message },
    });
  }
}

module.exports = handler;
