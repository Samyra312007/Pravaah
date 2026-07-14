"use client";

import { useState } from "react";
import { FileText, Download, Loader2, CheckCircle, AlertCircle, FileDown } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { api } from "@/lib/catalyst";
import { formatDate } from "@/lib/utils";
import type { Role, ApiResponse } from "@/types/common";

const reportRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "ANALYST"];

const DISTRICTS = [
  { id: 1, name: "Bengaluru Urban" }, { id: 2, name: "Bengaluru Rural" },
  { id: 3, name: "Mysuru" }, { id: 4, name: "Hubballi-Dharwad" },
  { id: 5, name: "Belagavi" }, { id: 6, name: "Kalaburagi" },
  { id: 7, name: "Mangaluru" }, { id: 8, name: "Shivamogga" },
  { id: 9, name: "Ballari" }, { id: 10, name: "Davangere" },
  { id: 11, name: "Tumakuru" }, { id: 12, name: "Udupi" },
  { id: 13, name: "Hassan" }, { id: 14, name: "Raichur" }, { id: 15, name: "Kolar" },
];

const presetReports = [
  { id: "district-summary", label: "District Intelligence Summary", desc: "Comprehensive KPI report with crime breakdown, station stats, and trend alerts" },
  { id: "trend-analysis", label: "Trend Analysis Report", desc: "Monthly/quarterly trend data with anomaly detection markers" },
  { id: "anomaly-report", label: "Anomaly Detection Report", desc: "ML-flagged anomalous cases with risk scores and socio-economic correlation" },
];

const recentReports = [
  { id: "r1", name: "Bengaluru Urban - Weekly Summary", date: "12 Jul 2026", status: "ready" as const },
  { id: "r2", name: "Mysuru - District Intelligence", date: "11 Jul 2026", status: "ready" as const },
  { id: "r3", name: "Hubballi-Dharwad - Trend Analysis", date: "10 Jul 2026", status: "ready" as const },
  { id: "r4", name: "State-wide Monthly Comparison", date: "09 Jul 2026", status: "generating" as const },
];

export default function ReportsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedReport, setSelectedReport] = useState("district-summary");
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<{ success: boolean; message: string; downloadUrl?: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleGenerate = async () => {
    if (!selectedDistrict) { setGenResult({ success: false, message: "Please select a district" }); return; }
    setGenerating(true);
    setGenResult(null);
    try {
      const district = DISTRICTS.find(d => d.id === parseInt(selectedDistrict));
      const res = await api.post<ApiResponse<{ reportId: string; downloadUrl: string }>>("/reports/generate", {
        districtId: selectedDistrict,
        districtName: district?.name,
        reportType: selectedReport,
        periodStart: dateFrom || undefined,
        periodEnd: dateTo || undefined,
      });
      if (res.status === "success" && res.data) {
        setGenResult({ success: true, message: "Report generated successfully!", downloadUrl: res.data.downloadUrl });
      } else {
        setGenResult({ success: false, message: "Failed to generate report" });
      }
    } catch (err) {
      setGenResult({ success: false, message: err instanceof Error ? err.message : "Failed to generate report" });
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const qs = new URLSearchParams();
      if (selectedDistrict) qs.set("districtId", selectedDistrict);
      if (dateFrom) qs.set("dateFrom", dateFrom);
      if (dateTo) qs.set("dateTo", dateTo);
      const url = `/api/reports/export/csv?${qs}`;

      const token = localStorage.getItem("auth_token");
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `cases-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setGenResult({ success: false, message: "Export failed" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <RoleGuard roles={reportRoles}>
      <div className="space-y-6">
        {/* Report Generation Panel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Intelligence Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Report Type</label>
              <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20">
                {presetReports.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">District</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ksp-blue/20">
                <option value="">All Districts</option>
                {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Period Start</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksp-blue/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Period End</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksp-blue/20" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleGenerate} disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 bg-ksp-navy text-white rounded-lg text-sm font-medium hover:bg-ksp-blue transition-colors disabled:opacity-50">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Report"}
            </button>
            <button onClick={handleExportCSV} disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>

          {/* Generation Result */}
          {genResult && (
            <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              genResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              {genResult.success ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /> : <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />}
              <div>
                <p className={`text-sm font-medium ${genResult.success ? "text-green-800" : "text-red-800"}`}>{genResult.message}</p>
                {genResult.downloadUrl && (
                  <a href={genResult.downloadUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm text-ksp-blue hover:underline">
                    <Download className="h-4 w-4" /> Download Report
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preset Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presetReports.map((report) => (
            <div key={report.id} onClick={() => setSelectedReport(report.id)}
              className={`card p-5 hover:shadow-md transition-all cursor-pointer border-2 ${
                selectedReport === report.id ? "border-ksp-blue bg-ksp-blue/5" : "border-transparent"
              }`}>
              <FileText className="h-6 w-6 text-ksp-blue mb-2" />
              <h3 className="font-semibold text-gray-800">{report.label}</h3>
              <p className="text-sm text-gray-400 mt-1">{report.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Reports</h3>
          {recentReports.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              No reports generated yet. Use the panel above to generate your first report.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {r.status === "ready" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  {r.status === "ready" ? (
                    <button className="flex items-center gap-1 text-xs text-ksp-blue font-medium hover:underline">
                      <Download className="h-3 w-3" /> Download
                    </button>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">Generating...</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
