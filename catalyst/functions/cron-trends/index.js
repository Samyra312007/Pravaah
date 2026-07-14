const catalyst = require("zcatalyst-sdk-node");

async function handler(context) {
  try {
    const app = catalyst.initialize(context);
    const query = app.datastore().getTable("CaseMaster").getQuery();
    const cache = app.cache();

    // ── 1. Compute monthly trends with 2σ anomaly detection ──
    const zcql = `
      SELECT MONTH(CrimeRegisteredDate) as month, YEAR(CrimeRegisteredDate) as year,
             CrimeMajorHeadID, COUNT(*) as count
      FROM CaseMaster
      WHERE CrimeRegisteredDate >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
      GROUP BY year, month, CrimeMajorHeadID
    `;
    const rows = await query.execute(zcql);

    // Aggregate into monthly totals across all crime heads
    const monthlyTotals = {};
    for (const r of rows) {
      const key = `${r.year}-${String(r.month).padStart(2, "0")}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + r.count;
    }
    const monthlyKeys = Object.keys(monthlyTotals).sort();
    const counts = monthlyKeys.map((k) => monthlyTotals[k]);

    // Compute mean and standard deviation
    const n = counts.length;
    const mean = counts.reduce((s, v) => s + v, 0) / n;
    const variance = counts.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);
    const threshold = mean + 2 * stdDev;

    // Generate trend alerts when a monthly count exceeds 2σ
    const alerts = [];
    for (let i = 0; i < monthlyKeys.length; i++) {
      if (counts[i] > threshold) {
        const [year, month] = monthlyKeys[i].split("-");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        alerts.push({
          period: `${monthNames[parseInt(month) - 1]} ${year}`,
          count: counts[i],
          threshold: Math.round(threshold),
          deviation: Math.round(((counts[i] - mean) / mean) * 100),
          message: `Monthly case count (${counts[i]}) exceeded 2σ alert threshold (${Math.round(threshold)}) by ${Math.round(counts[i] - threshold)} cases`,
        });
      }
    }

    await cache.put("nightly_trends", JSON.stringify(rows), 43200);
    await cache.put("trend_alerts", JSON.stringify(alerts), 43200);
    await cache.put("trend_stats", JSON.stringify({ mean: Math.round(mean), stdDev: Math.round(stdDev), threshold: Math.round(threshold), totalMonths: n }), 43200);

    // ── 2. Call ML service for risk score recalculation ──
    const mlEndpoint = process.env.ML_SERVICE_URL || "https://ml-service.ksp.catalystappsail.in";
    const districts = [
      { id: 1, name: "Bengaluru Urban" }, { id: 2, name: "Bengaluru Rural" }, { id: 3, name: "Mysuru" },
      { id: 4, name: "Hubballi-Dharwad" }, { id: 5, name: "Belagavi" }, { id: 6, name: "Kalaburagi" },
      { id: 7, name: "Mangaluru" }, { id: 8, name: "Shivamogga" }, { id: 9, name: "Ballari" },
      { id: 10, name: "Davangere" }, { id: 11, name: "Tumakuru" }, { id: 12, name: "Udupi" },
      { id: 13, name: "Hassan" }, { id: 14, name: "Raichur" }, { id: 15, name: "Kolar" },
    ];

    const riskScores = [];
    for (const d of districts) {
      try {
        const res = await fetch(`${mlEndpoint}/predict/risk-score/${d.id}`);
        const data = await res.json();
        riskScores.push({ districtId: d.id, districtName: d.name, riskScore: data.risk_score, riskLevel: data.risk_level });
      } catch {
        riskScores.push({ districtId: d.id, districtName: d.name, riskScore: null, riskLevel: "Unknown" });
      }
    }

    await cache.put("nightly_risk_scores", JSON.stringify(riskScores), 43200);

    console.log(`Cron job complete: ${rows.length} trend rows, ${alerts.length} alerts, ${riskScores.length} risk scores`);
    return {
      status: "success",
      recordsProcessed: rows.length,
      alertsGenerated: alerts.length,
      riskScoresUpdated: riskScores.length,
    };
  } catch (err) {
    console.error("Nightly trend job failed:", err.message);
    return { status: "error", message: err.message };
  }
}

module.exports = handler;
