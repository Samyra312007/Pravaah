const catalyst = require("zcatalyst-sdk-node");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        throw new Error(`ML service returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`ML service call failed (attempt ${attempt}/${retries}), retrying in ${RETRY_DELAY_MS}ms: ${err.message}`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

async function handler(event, context) {
  try {
    const app = catalyst.initialize(context);
    const newCase = event.data;

    if (!newCase || !newCase.CaseMasterID) {
      return { status: "skipped", reason: "No case data received" };
    }

    // Trigger anomaly detection via AppSail ML service with circuit breaker retries
    const mlEndpoint = process.env.ML_SERVICE_URL || "https://ml-service.ksp.catalystappsail.in";
    const mlResult = await fetchWithRetry(
      `${mlEndpoint}/detect/anomalies`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: newCase.CaseMasterID,
          age_year: newCase.age_year || 0,
          gender_id: newCase.gender_id || 0,
          crime_head_id: newCase.CrimeMajorHeadID || 0,
          district_id: newCase.DistrictID || 0,
          hour_of_day: newCase.hour_of_day || 12,
          day_of_week: newCase.day_of_week || 0,
        }),
      }
    );

    const cache = app.cache();

    // If anomaly detected, create alert via cache and log
    if (mlResult.isAnomaly) {
      const anomalyAlert = {
        caseId: newCase.CaseMasterID,
        anomalyScore: mlResult.anomaly_score,
        detectedAt: new Date().toISOString(),
        crimeHeadId: newCase.CrimeMajorHeadID,
        districtId: newCase.DistrictID,
      };
      await cache.put(
        `anomaly:${newCase.CaseMasterID}`,
        JSON.stringify(anomalyAlert),
        86400
      );
      console.log(`Anomaly detected for case #${newCase.CaseMasterID}, score: ${mlResult.anomaly_score}`);
    }

    return {
      status: "processed",
      anomalyDetected: mlResult.isAnomaly,
      anomalyScore: mlResult.anomaly_score,
    };
  } catch (err) {
    console.error("Anomaly detection failed after retries:", err.message);
    // Cache failure state so the cron job can retry later
    try {
      const app = catalyst.initialize(context);
      const cache = app.cache();
      await cache.put(
        `anomaly_pending:${event.data?.CaseMasterID || "unknown"}`,
        JSON.stringify({ failedAt: new Date().toISOString(), error: err.message }),
        43200
      );
    } catch { /* best-effort */ }

    return { status: "error", message: err.message };
  }
}

module.exports = handler;
