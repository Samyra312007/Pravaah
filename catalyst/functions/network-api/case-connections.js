const { getQuery } = require("../common/db");

async function handler(req, res) {
  try {
    const { caseId } = req.path_params;
    const query = getQuery(req);

    // Find all accused and victims for the given case
    const accused = await query.execute(
      `SELECT a.AccusedMasterID, a.AccusedName, a.AgeYear, a.GenderID
       FROM Accused a WHERE a.CaseMasterID = ${caseId}`
    );

    const victims = await query.execute(
      `SELECT v.VictimMasterID, v.VictimName, v.AgeYear, v.GenderID
       FROM Victim v WHERE v.CaseMasterID = ${caseId}`
    );

    // For each accused, find other cases they are linked to (repeat offender check)
    const connections = [];
    const personIds = accused
      .filter((a) => a.PersonID)
      .map((a) => a.PersonID);

    if (personIds.length > 0) {
      const otherCases = await query.execute(
        `SELECT a2.AccusedName, a2.PersonID, a2.CaseMasterID,
                cm.CrimeRegisteredDate, cm.CrimeMajorHeadID
         FROM Accused a2
         JOIN CaseMaster cm ON a2.CaseMasterID = cm.CaseMasterID
         WHERE a2.PersonID IN (${personIds.join(",")})
           AND a2.CaseMasterID != ${caseId}
         ORDER BY cm.CrimeRegisteredDate DESC`
      );
      connections.push(...otherCases);
    }

    res.status(200).json({
      status: "success",
      data: {
        caseId,
        accused: accused.map((a) => ({
          id: a.AccusedMasterID,
          name: a.AccusedName,
          age: a.AgeYear,
          genderId: a.GenderID,
        })),
        victims: victims.map((v) => ({
          id: v.VictimMasterID,
          name: v.VictimName,
          age: v.AgeYear,
          genderId: v.GenderID,
        })),
        crossCaseConnections: connections.map((c) => ({
          personName: c.AccusedName,
          personId: c.PersonID,
          linkedCaseId: c.CaseMasterID,
          crimeHeadId: c.CrimeMajorHeadID,
          registeredDate: c.CrimeRegisteredDate,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: { code: "INTERNAL", message: err.message },
    });
  }
}

module.exports = handler;
