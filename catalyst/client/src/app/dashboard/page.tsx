"use client";

import { useState } from "react";
import { FolderSearch, FileSearch, TrendingUp, AlertTriangle, Scale, Users, Gavel, Brain } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { KpiCard, TrendChart, CategoryBreakdownChart, DistrictComparisonChart, RiskScoreMap, AnomalyCards, SocioEconomicChart } from "@/components/charts";
import { TrendAlertBadge } from "@/components/alerts/TrendAlertBadge";
import { TrendAlertIndicator } from "@/components/alerts/TrendAlertIndicator";
import { useDashboard, useTrends, useDistrictComparison, useCategoryBreakdown, useTrendAlerts, useRiskScores, useAnomalies, useSocioEconomic } from "@/hooks/useMockAnalytics";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

export default function DashboardPage() {
  const { kpis, loading: kpiLoading } = useDashboard();
  const { trends, loading: trendsLoading } = useTrends();
  const { comparison, loading: comparisonLoading } = useDistrictComparison();
  const { data: categoryData, loading: categoryLoading } = useCategoryBreakdown();
  const { alerts, loading: alertsLoading } = useTrendAlerts();
  const { scores, loading: scoresLoading } = useRiskScores();
  const { anomalies, loading: anomaliesLoading } = useAnomalies();
  const { data: socioEconomic, loading: socioLoading } = useSocioEconomic();
  const [quarterlyView, setQuarterlyView] = useState(false);

  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        {/* Alerts Bar */}
        {!alertsLoading && alerts.length > 0 && (
          <TrendAlertIndicator alerts={alerts} />
        )}

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            label="Total Cases"
            value={kpis?.totalCases ?? "—"}
            icon={<FolderSearch className="h-5 w-5" />}
            color="text-ksp-blue"
            trend={{ direction: "up", value: "4.2%" }}
            loading={kpiLoading}
          />
          <KpiCard
            label="Active Investigations"
            value={kpis?.activeInvestigations ?? "—"}
            icon={<FileSearch className="h-5 w-5" />}
            color="text-amber-600"
            trend={{ direction: "down", value: "2.1%" }}
            loading={kpiLoading}
          />
          <KpiCard
            label="Clearance Rate"
            value={kpis ? `${kpis.clearanceRate}%` : "—"}
            icon={<TrendingUp className="h-5 w-5" />}
            color="text-green-600"
            trend={{ direction: "up", value: "1.8%" }}
            loading={kpiLoading}
          />
          <KpiCard
            label="Anomaly Flags"
            value={kpis?.anomalyCount ?? "—"}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="text-red-600"
            trend={{ direction: "up", value: `${alerts.length} alerts` }}
            loading={kpiLoading}
          />
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            label="Heinous Crimes"
            value={kpis?.heinousCases ?? "—"}
            icon={<Scale className="h-5 w-5" />}
            color="text-red-600"
            loading={kpiLoading}
          />
          <KpiCard
            label="Repeat Offenders"
            value={kpis?.repeatOffenderCount ?? "—"}
            icon={<Users className="h-5 w-5" />}
            color="text-purple-600"
            loading={kpiLoading}
          />
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-2">Quick Actions</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ksp-blue/10 text-xs font-medium text-ksp-blue">
                <Gavel className="h-3 w-3" />
                New FIR
              </span>
              <TrendAlertBadge count={alerts.length} severity={alerts.some(a => a.increase > 50) ? "high" : "medium"} />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Crime Trends</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuarterlyView(!quarterlyView)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    quarterlyView
                      ? "bg-ksp-blue text-white border-ksp-blue"
                      : "text-gray-400 bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {quarterlyView ? "Quarterly" : "Monthly"}
                </button>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">2024-2026</span>
              </div>
            </div>
            {trendsLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
            ) : (
              <TrendChart data={trends} showQuarterly={quarterlyView} />
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Crime Category Breakdown</h3>
            {categoryLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
            ) : (
              <CategoryBreakdownChart data={categoryData} />
            )}
          </div>
        </div>

        {/* District Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">District Comparison</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Top 15 districts</span>
          </div>
          {comparisonLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
          ) : (
            <DistrictComparisonChart data={comparison} />
          )}
        </div>

        {/* Phase 5: ML Intelligence Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-ksp-blue" />
            <h2 className="text-lg font-semibold text-gray-800">ML Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Risk Score Choropleth Map */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">District Risk Scores</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Random Forest Model</span>
              </div>
              <RiskScoreMap scores={scores} loading={scoresLoading} />
            </div>

            {/* Anomaly Detection Call-Outs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Anomaly Flags</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Isolation Forest Model</span>
              </div>
              <AnomalyCards anomalies={anomalies} loading={anomaliesLoading} />
            </div>
          </div>

          {/* Socio-Economic Correlation */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Socio-Economic vs Crime Correlation</h3>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Pearson Correlation</span>
            </div>
            <SocioEconomicChart
              details={socioEconomic?.details ?? []}
              loading={socioLoading}
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
