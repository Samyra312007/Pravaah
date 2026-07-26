/**
 * Training Data Export Script for Zia AutoML
 *
 * Run this script as a Catalyst Function (Advanced I/O) or locally with the SDK
 * to export historical case + census data for Zia AutoML training.
 *
 * Usage:
 *   catalyst: Deploy as a Function and invoke, or run locally:
 *     node export-training-data.js
 *
 * Output:
 *   - exports/risk_score_training.csv
 *   - exports/anomaly_detection_training.csv
 */

const catalyst = require("zcatalyst-sdk-node");

async function exportRiskScoreData(req) {
  const app = catalyst.initialize(req);
  const query = app.datastore().getTable("CaseMaster").getQuery();

  // Export district-level aggregated crime data joined with census indicators
  const zcql = `
    SELECT
      d.DistrictID as district_id,
      d.DistrictName as district_name,
      COUNT(cm.CaseMasterID) as cases_last_quarter,
      ROUND(COUNT(cm.CaseMasterID) * 100000.0 / NULLIF(c.population, 0), 2) as crime_rate_per_100k,
      c.population_density,
      c.urbanization_index,
      c.literacy_rate,
      ROUND(AVG(cm.ResponseTimeMinutes), 2) as avg_response_time,
      ROUND(SUM(CASE WHEN a.PersonID IS NOT NULL THEN 1 ELSE 0 END) * 1.0 / NULLIF(COUNT(cm.CaseMasterID), 0), 4) as repeat_offender_ratio,
      ROUND(0.15 * COUNT(cm.CaseMasterID) / 2000
        + 0.20 * (COUNT(cm.CaseMasterID) * 100000.0 / NULLIF(c.population, 0)) / 500
        + 0.10 * c.population_density / 12000
        + 0.10 * c.urbanization_index / 95
        - 0.15 * c.literacy_rate / 98
        + 0.15 * (1 - AVG(cm.ResponseTimeMinutes) / 60)
        + 0.15 * SUM(CASE WHEN a.PersonID IS NOT NULL THEN 1 ELSE 0 END) / NULLIF(COUNT(cm.CaseMasterID), 0) / 0.35, 4) as risk_score
    FROM District d
    JOIN Unit u ON d.DistrictID = u.DistrictID
    JOIN CaseMaster cm ON u.UnitID = cm.UnitID
    LEFT JOIN Accused a ON cm.CaseMasterID = a.CaseMasterID
    LEFT JOIN CensusData c ON d.DistrictID = c.DistrictID
    WHERE cm.CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
    GROUP BY d.DistrictID, d.DistrictName, c.population, c.population_density, c.urbanization_index, c.literacy_rate
    ORDER BY d.DistrictID
  `;

  const rows = await query.execute(zcql);
  return rows;
}

async function exportAnomalyData(req) {
  const app = catalyst.initialize(req);
  const query = app.datastore().getTable("CaseMaster").getQuery();

  // Export individual case features for anomaly detection training
  const zcql = `
    SELECT
      cm.CaseMasterID as case_id,
      v.AgeYear as age_year,
      v.GenderID as gender_id,
      HOUR(cm.CrimeRegisteredDate) as hour_of_day,
      DAYOFWEEK(cm.CrimeRegisteredDate) as day_of_week,
      cm.CrimeMajorHeadID as crime_head_id,
      cm.UnitID as district_id
    FROM CaseMaster cm
    JOIN Victim v ON cm.CaseMasterID = v.CaseMasterID
    WHERE cm.CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    LIMIT 10000
  `;

  const rows = await query.execute(zcql);
  return rows;
}

async function handler(context) {
  try {
    const req = { context }; // mock request object for catalyst.initialize
    const riskData = await exportRiskScoreData(req);
    const anomalyData = await exportAnomalyData(req);

    return {
      status: "success",
      riskScoreRows: riskData.length,
      anomalyRows: anomalyData.length,
      riskScoreExport: riskData,
      anomalyExport: anomalyData,
    };
  } catch (err) {
    console.error("Export failed:", err.message);
    return { status: "error", message: err.message };
  }
}

module.exports = handler;

// If run directly (not as Catalyst Function), log the export data
if (require.main === module) {
  console.log("Training Data Export Utility");
  console.log("Deploy as a Catalyst Function and invoke, or use catalyst.initialize() in a Function context.");
  console.log("\nExported files would contain:");
  console.log("  - exports/risk_score_training.csv: District-level aggregated risk features");
  console.log("  - exports/anomaly_detection_training.csv: Individual case features for anomaly detection");
}
