"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, User, Scale, FileText } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { useCaseDetail } from "@/hooks/useCases";
import { formatDate } from "@/lib/utils";
import type { Role } from "@/types/common";

const caseRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs font-medium text-gray-400 w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800">{value ?? "—"}</span>
    </div>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { caseDetail, loading, error } = useCaseDetail(caseId);

  if (loading) {
    return (
      <RoleGuard roles={caseRoles}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading case details...</p>
        </div>
      </RoleGuard>
    );
  }

  if (error || !caseDetail) {
    return (
      <RoleGuard roles={caseRoles}>
        <div className="text-center py-16">
          <p className="text-red-500 font-medium">{error || "Case not found"}</p>
          <Link href="/cases" className="text-ksp-blue text-sm mt-2 inline-block hover:underline">Back to cases</Link>
        </div>
      </RoleGuard>
    );
  }

  const { master, victims, accused, complainants, actSections, arrests, chargesheet, references } = caseDetail;
  const refs = references || {};

  return (
    <RoleGuard roles={caseRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/cases" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Case {master.CrimeNo || `#${master.CaseMasterID}`}
            </h2>
            <p className="text-sm text-gray-400">{master.CaseNo ? `Case No: ${master.CaseNo}` : ""}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              refs.status?.CaseStatusName === "Under Investigation" ? "bg-yellow-100 text-yellow-700" :
              refs.status?.CaseStatusName === "Chargesheet Filed" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {refs.status?.CaseStatusName || "—"}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              refs.gravity?.LookupValue === "Heinous" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
            }`}>
              {refs.gravity?.LookupValue || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Details */}
            <DetailCard title="Case Information">
              <div className="grid grid-cols-2 gap-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Registered:</span>
                  <span className="font-medium">{formatDate(master.CrimeRegisteredDate || "")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Incident:</span>
                  <span className="font-medium">
                    {master.IncidentFromDate ? formatDate(master.IncidentFromDate) : "—"}
                    {master.IncidentToDate ? ` - ${formatDate(master.IncidentToDate)}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">District:</span>
                  <span className="font-medium">{refs.district?.DistrictName || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Station:</span>
                  <span className="font-medium">{refs.unit?.UnitName || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Scale className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Crime Head:</span>
                  <span className="font-medium">{refs.crimeHead?.CrimeGroupName || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{refs.category?.LookupValue || "—"}</span>
                </div>
              </div>
              {master.latitude && master.longitude && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Field label="Coordinates" value={`${master.latitude}, ${master.longitude}`} />
                </div>
              )}
              {master.BriefFacts && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-400 block mb-1">Brief Facts</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{master.BriefFacts}</p>
                </div>
              )}
            </DetailCard>

            {/* Complainants */}
            <DetailCard title={`Complainants (${complainants.length})`}>
              {complainants.length === 0 ? (
                <p className="text-sm text-gray-400">No complainants recorded.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complainants.map((c) => (
                      <tr key={c.ComplainantID} className="border-b border-gray-50">
                        <td className="py-2 text-gray-800">{c.ComplainantName}</td>
                        <td className="py-2 text-gray-500">{c.AgeYear || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </DetailCard>

            {/* Victims */}
            <DetailCard title={`Victims (${victims.length})`}>
              {victims.length === 0 ? (
                <p className="text-sm text-gray-400">No victims recorded.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Age</th>
                      <th className="pb-2 font-medium">Gender</th>
                      <th className="pb-2 font-medium">Police</th>
                    </tr>
                  </thead>
                  <tbody>
                    {victims.map((v) => (
                      <tr key={v.VictimMasterID} className="border-b border-gray-50">
                        <td className="py-2 text-gray-800">{v.VictimName}</td>
                        <td className="py-2 text-gray-500">{v.AgeYear || "—"}</td>
                        <td className="py-2 text-gray-500">{v.GenderID === 1 ? "Male" : v.GenderID === 2 ? "Female" : "—"}</td>
                        <td className="py-2 text-gray-500">{v.VictimPolice || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </DetailCard>

            {/* Chargesheet */}
            {chargesheet && (
              <DetailCard title="Chargesheet">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="CS Date" value={chargesheet.csdate ? formatDate(chargesheet.csdate) : null} />
                  <Field label="CS Type" value={chargesheet.cstype} />
                </div>
              </DetailCard>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Accused */}
            <DetailCard title={`Accused (${accused.length})`}>
              {accused.length === 0 ? (
                <p className="text-sm text-gray-400">No accused recorded.</p>
              ) : (
                <div className="space-y-3">
                  {accused.map((a) => (
                    <div key={a.AccusedMasterID} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-ksp-blue" />
                        <span className="font-medium text-sm text-gray-800">{a.AccusedName}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-400 ml-6">
                        Age: {a.AgeYear || "—"} | Person ID: {a.PersonID || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DetailCard>

            {/* Act-Sections */}
            <DetailCard title={`Acts & Sections (${actSections.length})`}>
              {actSections.length === 0 ? (
                <p className="text-sm text-gray-400">No sections applied.</p>
              ) : (
                <div className="space-y-2">
                  {actSections.map((as, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Scale className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800">
                          {(as as any).ShortName || `Act ${as.ActID}`} § {as.SectionID}
                        </span>
                        {(as as any).SectionDescription && (
                          <p className="text-xs text-gray-400">{(as as any).SectionDescription}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DetailCard>

            {/* Arrests */}
            {arrests.length > 0 && (
              <DetailCard title={`Arrests (${arrests.length})`}>
                <div className="space-y-2">
                  {arrests.map((ar) => (
                    <div key={ar.ArrestSurrenderID} className="text-sm">
                      <span className="text-gray-800">{ar.ArrestSurrenderDate ? formatDate(ar.ArrestSurrenderDate) : "—"}</span>
                    </div>
                  ))}
                </div>
              </DetailCard>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
