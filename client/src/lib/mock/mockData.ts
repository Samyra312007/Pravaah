import type { DashboardKPI, TrendDataPoint, DistrictComparison, CategoryBreakdown, Hotspot, RiskScore, AnomalyData, SocioEconomicCorrelation } from "@/types/analytics";

export const districts = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad", "Belagavi",
  "Kalaburagi", "Mangaluru", "Shivamogga", "Ballari", "Davangere",
  "Tumakuru", "Udupi", "Hassan", "Raichur", "Kolar",
];

export const crimeHeads = [
  "Crimes Against Body", "Crimes Against Property", "Crimes Against Women",
  "Crimes Against Children", "Cyber Crimes", "Economic Offences",
  "Narcotics", "Organised Crime",
];

export const stations: Record<string, string[]> = {
  "Bengaluru Urban": ["Cubbon Park", "Ulsoor", "Jayanagar", "Koramangala", "Whitefield", "Yeshwanthpur"],
  "Mysuru": ["K R Nagar", "Kuvempunagar", "Vijayanagar", "Lashkar"],
  "Hubballi-Dharwad": ["Hubballi Town", "Dharwad Town", "Gokul Road"],
  "Belagavi": ["Belagavi City", "M K Hubli"],
};

export const crimeTypes = ["Theft", "Assault", "Burglary", "Robbery", "Homicide", "Fraud", "Cyber Crime", "Narcotics"];
export const timeBlocks = ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"];

export const mockKpis: DashboardKPI = {
  totalCases: 12478,
  heinousCases: 2341,
  resolvedCases: 8792,
  clearanceRate: 70.5,
  activeInvestigations: 3686,
  repeatOffenderCount: 892,
  anomalyCount: 47,
};

export function generateMockTrends(): TrendDataPoint[] {
  const trends: TrendDataPoint[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let year = 2024; year <= 2026; year++) {
    for (let m = 0; m < 12; m++) {
      if (year === 2026 && m > 6) break;
      const base = year === 2024 ? 800 : year === 2025 ? 950 : 1050;
      const noise = Math.floor(Math.random() * 400) - 200;
      const count = Math.max(100, base + noise);
      const isAnomaly = count > base + 300;
      trends.push({
        year,
        month: m + 1,
        label: `${months[m]} ${year}`,
        count,
        isAnomaly,
      });
    }
  }
  return trends;
}

export function generateMockDistrictComparison(): DistrictComparison[] {
  return districts.map((name) => {
    const total = Math.floor(Math.random() * 2000) + 200;
    const heinous = Math.floor(total * (0.1 + Math.random() * 0.2));
    const resolved = Math.floor(total * (0.5 + Math.random() * 0.3));
    return {
      districtName: name,
      totalCases: total,
      heinousCases: heinous,
      resolvedCases: resolved,
      clearanceRate: Math.round((resolved / total) * 100),
      investigatorsDeployed: Math.floor(Math.random() * 80) + 20,
    };
  });
}

export function generateMockCategoryBreakdown(): CategoryBreakdown[] {
  const total = 12478;
  const counts = crimeHeads.map(() => Math.floor(Math.random() * 2500) + 300);
  const sum = counts.reduce((a, b) => a + b, 0);
  return crimeHeads.map((name, i) => ({
    crimeGroupName: name,
    count: counts[i],
    percentage: Math.round((counts[i] / sum) * 1000) / 10,
  }));
}

export function generateMockHotspots(): Hotspot[] {
  const hotspots: Hotspot[] = [];
  const baseLat = 12.9;
  const baseLng = 77.5;

  for (let i = 0; i < 200; i++) {
    hotspots.push({
      districtName: districts[Math.floor(Math.random() * districts.length)],
      timeBlock: timeBlocks[Math.floor(Math.random() * timeBlocks.length)],
      latBucket: baseLat + (Math.random() - 0.5) * 2.5,
      lngBucket: baseLng + (Math.random() - 0.5) * 2.5,
      crimeGroupName: crimeHeads[Math.floor(Math.random() * crimeHeads.length)],
      incidentCount: Math.floor(Math.random() * 20) + 1,
    });
  }
  return hotspots;
}

export function generateMockRiskScores(): RiskScore[] {
  return districts.map((name, i) => {
    const score = Math.floor(Math.random() * 100);
    let riskLevel: RiskScore["riskLevel"] = "Low";
    if (score > 75) riskLevel = "Critical";
    else if (score > 60) riskLevel = "High";
    else if (score > 40) riskLevel = "Medium";
    return {
      districtId: i + 1,
      districtName: name,
      riskScore: score,
      riskLevel,
      factors: {
        population_density: Math.floor(Math.random() * 5000),
        urbanization_index: Math.floor(Math.random() * 100),
        literacy_rate: Math.floor(Math.random() * 40) + 50,
        repeat_offender_ratio: Math.floor(Math.random() * 30) + 5,
      },
    };
  });
}

export interface DrillDownData {
  districtName: string;
  stations: Array<{
    stationName: string;
    lat: number;
    lng: number;
    totalCases: number;
    activeCases: number;
  }>;
}

export function generateMockAnomalies(): AnomalyData[] {
  const anomalies: AnomalyData[] = [];
  const districts = ["Bengaluru Urban", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Kalaburagi", "Mangaluru"];
  const crimeHeads = ["Cyber Crimes", "Crimes Against Women", "Crimes Against Body", "Narcotics", "Economic Offences"];
  const count = Math.floor(Math.random() * 4) + 3;
  for (let i = 0; i < count; i++) {
    const isAnom = Math.random() > 0.4;
    anomalies.push({
      caseId: 10000 + Math.floor(Math.random() * 90000),
      district: districts[Math.floor(Math.random() * districts.length)],
      crimeHead: crimeHeads[Math.floor(Math.random() * crimeHeads.length)],
      anomalyScore: isAnom ? 0.6 + Math.random() * 0.4 : Math.random() * 0.3,
      isAnomaly: isAnom,
      registeredDate: `2026-${String(Math.floor(Math.random() * 6) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      description: isAnom
        ? "Unusual pattern: case characteristics deviate significantly from historical norms"
        : "Normal pattern: case falls within expected parameters",
    });
  }
  return anomalies;
}

export function generateMockSocioEconomic(): SocioEconomicCorrelation {
  return {
    correlationCoefficient: 0.42,
    pValue: 0.003,
    significantVariables: ["unemployment_rate", "literacy_rate", "urbanization_index"],
    details: [
      { indicator: "unemployment_rate", coefficient: 0.68, pValue: 0.001, significant: true },
      { indicator: "literacy_rate", coefficient: -0.54, pValue: 0.002, significant: true },
      { indicator: "poverty_index", coefficient: 0.31, pValue: 0.078, significant: false },
      { indicator: "urbanization_index", coefficient: 0.47, pValue: 0.015, significant: true },
      { indicator: "police_per_capita", coefficient: -0.22, pValue: 0.210, significant: false },
    ],
  };
}

export function generateMockDistrictDrillDown(districtName: string): DrillDownData {
  const districtStations = stations[districtName] || [`${districtName} HQ`, `${districtName} Town`, `${districtName} Rural`];
  const baseLat = 12.9 + (Math.random() - 0.5) * 1;
  const baseLng = 77.5 + (Math.random() - 0.5) * 1;

  return {
    districtName,
    stations: districtStations.map((name, i) => ({
      stationName: name,
      lat: baseLat + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1,
      totalCases: Math.floor(Math.random() * 500) + 50,
      activeCases: Math.floor(Math.random() * 100) + 10,
    })),
  };
}
