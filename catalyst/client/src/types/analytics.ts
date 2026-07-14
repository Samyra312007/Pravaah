export interface DashboardKPI {
  totalCases: number;
  heinousCases: number;
  resolvedCases: number;
  clearanceRate: number;
  activeInvestigations: number;
  repeatOffenderCount: number;
  anomalyCount: number;
}

export interface TrendDataPoint {
  year: number;
  month: number;
  label: string;
  count: number;
  isAnomaly?: boolean;
}

export interface DistrictComparison {
  districtName: string;
  totalCases: number;
  heinousCases: number;
  resolvedCases: number;
  clearanceRate: number;
  investigatorsDeployed: number;
}

export interface CategoryBreakdown {
  crimeGroupName: string;
  count: number;
  percentage: number;
}

export interface Hotspot {
  districtName: string;
  timeBlock: string;
  latBucket: number;
  lngBucket: number;
  crimeGroupName: string;
  incidentCount: number;
}

export interface RiskScore {
  districtId: number;
  districtName: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  factors: Record<string, number>;
}

export interface AnomalyData {
  caseId: number;
  district: string;
  crimeHead: string;
  anomalyScore: number;
  isAnomaly: boolean;
  registeredDate: string;
  description: string;
}

export interface SocioEconomicData {
  indicator: string;
  coefficient: number;
  pValue: number;
  significant: boolean;
}

export interface SocioEconomicCorrelation {
  correlationCoefficient: number;
  pValue: number;
  significantVariables: string[];
  details: SocioEconomicData[];
}
