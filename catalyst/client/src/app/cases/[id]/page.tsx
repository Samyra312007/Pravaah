"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Calendar, User, Scale, FileText,
  Pencil, Trash2, Plus, X, Check, Download, Loader2,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { api } from "@/lib/catalyst";
import { useCaseDetail, useCaseUpdate, useDeleteCase } from "@/hooks/useCases";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types/common";
import type { CaseMaster, Victim, Accused, Complainant, ActSectionAssociation, ArrestSurrender } from "@/types/case";

const caseRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

function DetailCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;
  const { caseDetail, loading, error, refetch } = useCaseDetail(caseId);
  const updateCase = useCaseUpdate();
  const deleteCase = useDeleteCase();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CaseMaster>>({});
  const [deleting, setDeleting] = useState(false);

  // Sub-entity add forms
  const [newVictim, setNewVictim] = useState({ VictimName: "", AgeYear: "", GenderID: "" });
  const [newAccused, setNewAccused] = useState({ AccusedName: "", AgeYear: "", GenderID: "" });
  const [newComplainant, setNewComplainant] = useState({ ComplainantName: "", AgeYear: "" });
  const [newSection, setNewSection] = useState({ ActID: "", SectionID: "" });
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleEdit = () => {
    if (caseDetail) {
      setEditForm({ ...caseDetail.master });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    await updateCase.updateCase(caseId, editForm);
    setIsEditing(false);
    refetch();
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/reports/case-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ caseId: parseInt(caseId), reportType: "case-report" }),
      });
      const data = await res.json();
      if (data.status === "success" && data.data?.downloadUrl) {
        window.open(data.data.downloadUrl, "_blank");
      } else {
        alert("Failed to generate PDF report");
      }
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to close this case?")) return;
    setDeleting(true);
    await deleteCase.deleteCase(caseId);
    setDeleting(false);
    router.push("/cases");
  };

  const handleAddVictim = async () => {
    if (!newVictim.VictimName) return;
    await api.post(`/cases/${caseId}/victims`, {
      VictimName: newVictim.VictimName,
      AgeYear: newVictim.AgeYear ? parseInt(newVictim.AgeYear) : undefined,
      GenderID: newVictim.GenderID ? parseInt(newVictim.GenderID) : undefined,
    });
    setNewVictim({ VictimName: "", AgeYear: "", GenderID: "" });
    setAddingTo(null);
    refetch();
  };

  const handleAddAccused = async () => {
    if (!newAccused.AccusedName) return;
    await api.post(`/cases/${caseId}/accused`, {
      AccusedName: newAccused.AccusedName,
      AgeYear: newAccused.AgeYear ? parseInt(newAccused.AgeYear) : undefined,
      GenderID: newAccused.GenderID ? parseInt(newAccused.GenderID) : undefined,
    });
    setNewAccused({ AccusedName: "", AgeYear: "", GenderID: "" });
    setAddingTo(null);
    refetch();
  };

  const handleAddComplainant = async () => {
    if (!newComplainant.ComplainantName) return;
    await api.post(`/cases/${caseId}/complainants`, {
      ComplainantName: newComplainant.ComplainantName,
      AgeYear: newComplainant.AgeYear ? parseInt(newComplainant.AgeYear) : undefined,
    });
    setNewComplainant({ ComplainantName: "", AgeYear: "" });
    setAddingTo(null);
    refetch();
  };

  const handleAddSection = async () => {
    if (!newSection.ActID || !newSection.SectionID) return;
    await api.post(`/cases/${caseId}/act-sections`, {
      ActID: parseInt(newSection.ActID),
      SectionID: newSection.SectionID,
    });
    setNewSection({ ActID: "", SectionID: "" });
    setAddingTo(null);
    refetch();
  };

  const handleRemoveSection = async (actId: number, sectionId: string) => {
    await api.post(`/cases/${caseId}/act-sections`, {
      _action: "remove", ActID: actId, SectionID: sectionId,
    });
    refetch();
  };

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

  type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
  const statusColors: Record<string, BadgeVariant> = {
    "Under Investigation": "warning", "Chargesheet Filed": "info",
    "Trial in Progress": "primary", Convicted: "danger",
    Acquitted: "success", Closed: "default",
  };

  const AddForm = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {addingTo === label ? (
        <div className="space-y-2">
          {children}
          <div className="flex gap-2">
            <button onClick={() => {
              if (label === "Victim") handleAddVictim();
              else if (label === "Accused") handleAddAccused();
              else if (label === "Complainant") handleAddComplainant();
              else if (label === "Section") handleAddSection();
            }} className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"><Check className="h-3 w-3" /> Add</button>
            <button onClick={() => setAddingTo(null)} className="flex items-center gap-1 text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100"><X className="h-3 w-3" /> Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAddingTo(label)} className="flex items-center gap-1 text-xs text-ksp-blue font-medium hover:underline">
          <Plus className="h-3 w-3" /> Add {label}
        </button>
      )}
    </div>
  );

  return (
    <RoleGuard roles={caseRoles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/cases" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Case {master.CrimeNo || `#${master.CaseMasterID}`}
              </h2>
              <Badge variant={statusColors[refs.status?.CaseStatusName || ""] || "default"}>
                {refs.status?.CaseStatusName || "—"}
              </Badge>
              <Badge variant={refs.gravity?.LookupValue === "Heinous" ? "danger" : "default"}>
                {refs.gravity?.LookupValue || "—"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{master.CaseNo ? `Case No: ${master.CaseNo}` : ""}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportPDF} disabled={exporting} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
            <button onClick={handleEdit} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-3 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> {deleting ? "Closing..." : "Close"}
            </button>
          </div>
        </div>

        {/* Inline Edit Mode */}
        {isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-3">Editing Case Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Crime No", field: "CrimeNo" },
                { label: "Case No", field: "CaseNo" },
                { label: "Registered Date", field: "CrimeRegisteredDate", type: "date" },
                { label: "Brief Facts", field: "BriefFacts", span: true },
              ].map(({ label, field, type, span }) => (
                <div key={field} className={span ? "col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  {span ? (
                    <textarea value={(editForm as any)[field] || ""} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm" rows={2} />
                  ) : (
                    <input type={type || "text"} value={(editForm as any)[field] || ""} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveEdit} disabled={updateCase.loading} className="flex items-center gap-2 px-4 py-2 bg-ksp-blue text-white rounded-lg text-sm font-medium hover:bg-ksp-navy">
                <Check className="h-4 w-4" /> {updateCase.loading ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information */}
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
              <AddForm label="Complainant">
                <input value={newComplainant.ComplainantName} onChange={(e) => setNewComplainant({ ...newComplainant, ComplainantName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                <input value={newComplainant.AgeYear} onChange={(e) => setNewComplainant({ ...newComplainant, AgeYear: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
              </AddForm>
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
                    </tr>
                  </thead>
                  <tbody>
                    {victims.map((v) => (
                      <tr key={v.VictimMasterID} className="border-b border-gray-50">
                        <td className="py-2 text-gray-800">{v.VictimName}</td>
                        <td className="py-2 text-gray-500">{v.AgeYear || "—"}</td>
                        <td className="py-2 text-gray-500">{v.GenderID === 1 ? "Male" : v.GenderID === 2 ? "Female" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <AddForm label="Victim">
                <input value={newVictim.VictimName} onChange={(e) => setNewVictim({ ...newVictim, VictimName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                <div className="flex gap-2">
                  <input value={newVictim.AgeYear} onChange={(e) => setNewVictim({ ...newVictim, AgeYear: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
                  <select value={newVictim.GenderID} onChange={(e) => setNewVictim({ ...newVictim, GenderID: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
              </AddForm>
            </DetailCard>

            {/* Chargesheet */}
            {chargesheet && (
              <DetailCard title="Chargesheet">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm"><span className="text-gray-400">Date:</span> <span className="font-medium">{chargesheet.csdate ? formatDate(chargesheet.csdate) : "—"}</span></div>
                  <div className="text-sm"><span className="text-gray-400">Type:</span> <span className="font-medium">{chargesheet.cstype || "—"}</span></div>
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
              <AddForm label="Accused">
                <input value={newAccused.AccusedName} onChange={(e) => setNewAccused({ ...newAccused, AccusedName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                <div className="flex gap-2">
                  <input value={newAccused.AgeYear} onChange={(e) => setNewAccused({ ...newAccused, AgeYear: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
                  <select value={newAccused.GenderID} onChange={(e) => setNewAccused({ ...newAccused, GenderID: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Gender</option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </select>
                </div>
              </AddForm>
            </DetailCard>

            {/* Act-Sections */}
            <DetailCard title={`Acts & Sections (${actSections.length})`}>
              {actSections.length === 0 ? (
                <p className="text-sm text-gray-400">No sections applied.</p>
              ) : (
                <div className="space-y-2">
                  {actSections.map((as, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-sm p-2 hover:bg-gray-50 rounded-lg group">
                      <div className="flex items-start gap-2">
                        <Scale className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-medium text-gray-800">
                            {as.ShortName || `Act ${as.ActID}`} § {as.SectionID}
                          </span>
                          {as.SectionDescription && (
                            <p className="text-xs text-gray-400">{as.SectionDescription}</p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveSection(as.ActID, as.SectionID)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AddForm label="Section">
                <div className="flex gap-2">
                  <select value={newSection.ActID} onChange={(e) => setNewSection({ ...newSection, ActID: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Act</option>
                    <option value="1">IPC</option>
                    <option value="2">CrPC</option>
                    <option value="3">NDPS</option>
                    <option value="4">IT Act</option>
                    <option value="5">Arms Act</option>
                    <option value="6">POCSO</option>
                  </select>
                  <input value={newSection.SectionID} onChange={(e) => setNewSection({ ...newSection, SectionID: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Section (e.g. 302)" />
                </div>
              </AddForm>
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
