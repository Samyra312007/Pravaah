const catalyst = require("zcatalyst-sdk-node");

async function handler(req, res) {
  try {
    const { id } = req.path_params;
    const caseId = parseInt(id);
    if (isNaN(caseId)) {
      return res.status(400).json({ status: "error", error: { code: "VALIDATION", message: "Invalid case ID" } });
    }

    const app = catalyst.initialize(req);

    const caseTable = app.datastore().getTable("CaseMaster");
    const masters = await caseTable.getRow(caseId);

    if (!masters) {
      return res.status(404).json({ status: "error", error: { code: "NOT_FOUND", message: "Case not found" } });
    }

    const query = app.datastore().getTable("CaseMaster").getQuery();

    const [complainants, victims, accused, actSections, arrests, chargesheets] = await Promise.all([
      query.execute("SELECT * FROM ComplainantDetails WHERE CaseMasterID = :id", { id: caseId }),
      query.execute("SELECT * FROM Victim WHERE CaseMasterID = :id", { id: caseId }),
      query.execute("SELECT * FROM Accused WHERE CaseMasterID = :id", { id: caseId }),
      query.execute("SELECT * FROM ActSectionAssociation WHERE CaseMasterID = :id", { id: caseId }),
      query.execute("SELECT * FROM ArrestSurrender WHERE CaseMasterID = :id", { id: caseId }),
      query.execute("SELECT * FROM ChargesheetDetails WHERE CaseMasterID = :id", { id: caseId }),
    ]);

    const [district, unit, status, crimeHead, gravity, category] = await Promise.all([
      query.execute("SELECT d.* FROM Unit u JOIN District d ON u.DistrictID = d.DistrictID WHERE u.UnitID = :unitId", { unitId: masters.UnitID }),
      query.execute("SELECT * FROM Unit WHERE UnitID = :unitId", { unitId: masters.UnitID }),
      query.execute("SELECT * FROM CaseStatusMaster WHERE CaseStatusID = :statusId", { statusId: masters.CaseStatusID }),
      query.execute("SELECT * FROM CrimeHead WHERE CrimeHeadID = :headId", { headId: masters.CrimeMajorHeadID }),
      query.execute("SELECT * FROM GravityOffence WHERE GravityOffenceID = :gravityId", { gravityId: masters.GravityOffenceID }),
      query.execute("SELECT * FROM CaseCategory WHERE CaseCategoryID = :catId", { catId: masters.CaseCategoryID }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        master: masters,
        complainants: complainants || [],
        victims: victims || [],
        accused: accused || [],
        actSections: actSections || [],
        arrests: arrests || [],
        chargesheet: chargesheets?.[0] || null,
        references: {
          district: district?.[0] || null,
          unit: unit?.[0] || null,
          status: status?.[0] || null,
          crimeHead: crimeHead?.[0] || null,
          gravity: gravity?.[0] || null,
          category: category?.[0] || null,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: { code: "INTERNAL", message: err.message } });
  }
}

module.exports = handler;
