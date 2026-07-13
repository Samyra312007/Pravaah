const catalyst = require("zcatalyst-sdk-node");

async function handler(event, context) {
  try {
    const app = catalyst.initialize(context);
    const newCase = event.data;

    // Trigger anomaly detection via AppSail ML service
    const mlEndpoint = process.env.ML_SERVICE_URL || "https://ml-service.ksp.catalystappsail.in";
    const response = await fetch(`${mlEndpoint}/detect/anomalies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCase),
    });

    const result = await response.json();

    // If anomaly detected, create alert via cache/mail
    if (result.isAnomaly) {
      const cache = app.cache();
      await cache.put(`anomaly:${newCase.CaseMasterID}`, JSON.stringify(result), 86400);
    }

    return { status: "processed", anomalyDetected: result.isAnomaly };
  } catch (err) {
    console.error("Anomaly detection failed:", err.message);
    return { status: "error", message: err.message };
  }
}

module.exports = handler;
