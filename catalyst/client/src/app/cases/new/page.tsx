"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Save } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { useCreateCase } from "@/hooks/useCases";
import type { Role } from "@/types/common";

const caseRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

type FormData = {
  CrimeNo: string;
  CaseNo: string;
  CrimeRegisteredDate: string;
  IncidentFromDate: string;
  IncidentToDate: string;
  InfoReceivedPSDate: string;
  latitude: string;
  longitude: string;
  BriefFacts: string;
  UnitID: string;
  CaseCategoryID: string;
  GravityOffenceID: string;
  CrimeMajorHeadID: string;
  CrimeMinorHeadID: string;
  CourtID: string;
  PolicePersonID: string;
};

const emptyPerson = { name: "", age: "" };

const steps = [
  { id: 1, label: "Case Details" },
  { id: 2, label: "Complainant" },
  { id: 3, label: "Victims" },
  { id: 4, label: "Accused" },
  { id: 5, label: "Acts & Sections" },
];

export default function NewCasePage() {
  const router = useRouter();
  const { createCase, loading } = useCreateCase();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    CrimeNo: "", CaseNo: "", CrimeRegisteredDate: "", IncidentFromDate: "",
    IncidentToDate: "", InfoReceivedPSDate: "", latitude: "", longitude: "",
    BriefFacts: "", UnitID: "1", CaseCategoryID: "1", GravityOffenceID: "2",
    CrimeMajorHeadID: "", CrimeMinorHeadID: "", CourtID: "", PolicePersonID: "",
  });
  const [complainants, setComplainants] = useState([{ name: "", age: "" }]);
  const [victims, setVictims] = useState([{ name: "", age: "", gender: "", police: "" }]);
  const [accused, setAccused] = useState([{ name: "", age: "", gender: "", personId: "" }]);
  const [actSections, setActSections] = useState([{ actId: "", sectionId: "" }]);

  const updateForm = (field: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleAddArray = <T,>(arr: T[], setter: (arr: T[]) => void, empty: T) => setter([...arr, { ...empty }]);
  const handleRemoveArray = <T,>(arr: T[], setter: (arr: T[]) => void, idx: number) => {
    if (arr.length > 1) setter(arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const payload: Record<string, unknown> = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      UnitID: parseInt(form.UnitID),
      CaseCategoryID: parseInt(form.CaseCategoryID),
      GravityOffenceID: parseInt(form.GravityOffenceID),
      CrimeMajorHeadID: form.CrimeMajorHeadID ? parseInt(form.CrimeMajorHeadID) : undefined,
      CrimeMinorHeadID: form.CrimeMinorHeadID ? parseInt(form.CrimeMinorHeadID) : undefined,
      CourtID: form.CourtID ? parseInt(form.CourtID) : undefined,
      PolicePersonID: form.PolicePersonID ? parseInt(form.PolicePersonID) : undefined,
      complainants: complainants.filter((c) => c.name).map((c) => ({
        ComplainantName: c.name, AgeYear: c.age ? parseInt(c.age) : undefined,
      })),
      victims: victims.filter((v) => v.name).map((v) => ({
        VictimName: v.name, AgeYear: v.age ? parseInt(v.age) : undefined, GenderID: v.gender ? parseInt(v.gender) : undefined, VictimPolice: v.police || undefined,
      })),
      accused: accused.filter((a) => a.name).map((a) => ({
        AccusedName: a.name, AgeYear: a.age ? parseInt(a.age) : undefined, GenderID: a.gender ? parseInt(a.gender) : undefined, PersonID: a.personId ? parseInt(a.personId) : undefined,
      })),
      actSections: actSections.filter((a) => a.actId && a.sectionId).map((a) => ({
        ActID: parseInt(a.actId), SectionID: a.sectionId,
      })),
    };

    const caseId = await createCase(payload);
    if (caseId) router.push(`/cases/${caseId}`);
  };

  const canProceed = () => {
    if (step === 1) return form.CrimeNo && form.UnitID;
    return true;
  };

  return (
    <RoleGuard roles={caseRoles}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Register New Case</h2>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${step === s.id ? "text-ksp-blue" : step > s.id ? "text-green-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  step === s.id ? "border-ksp-blue bg-ksp-blue/10" :
                  step > s.id ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}>
                  {step > s.id ? <Check className="h-4 w-4 text-green-600" /> : s.id}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${step > s.id ? "bg-green-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="card p-6">
          {/* Step 1: Case Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Case Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crime No *</label>
                  <input value={form.CrimeNo} onChange={(e) => updateForm("CrimeNo", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ksp-blue/20 focus:border-ksp-blue outline-none" placeholder="e.g. BLR/001/2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case No</label>
                  <input value={form.CaseNo} onChange={(e) => updateForm("CaseNo", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. CR/01/2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered Date</label>
                  <input type="date" value={form.CrimeRegisteredDate} onChange={(e) => updateForm("CrimeRegisteredDate", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Police Station *</label>
                  <select value={form.UnitID} onChange={(e) => updateForm("UnitID", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="1">Cubbon Park PS</option>
                    <option value="2">Wilson Garden PS</option>
                    <option value="3">Mysuru North PS</option>
                    <option value="4">Hubballi City PS</option>
                    <option value="5">Belagavi Fort PS</option>
                    <option value="6">Ballari Town PS</option>
                    <option value="7">Mangaluru East PS</option>
                    <option value="8">Shivamogga City PS</option>
                    <option value="9">Kalaburagi North PS</option>
                    <option value="10">Udupi Town PS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.CaseCategoryID} onChange={(e) => updateForm("CaseCategoryID", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="1">FIR</option>
                    <option value="2">UDR</option>
                    <option value="3">PAR</option>
                    <option value="4">Zero FIR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gravity</label>
                  <select value={form.GravityOffenceID} onChange={(e) => updateForm("GravityOffenceID", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="2">Non-Heinous</option>
                    <option value="1">Heinous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crime Head</label>
                  <select value={form.CrimeMajorHeadID} onChange={(e) => updateForm("CrimeMajorHeadID", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select...</option>
                    <option value="1">Murder</option>
                    <option value="2">Robbery</option>
                    <option value="3">Burglary</option>
                    <option value="4">Assault</option>
                    <option value="5">Fraud</option>
                    <option value="6">Kidnapping</option>
                    <option value="7">Cyber Crime</option>
                    <option value="8">Narcotics</option>
                    <option value="9">Property Crime</option>
                    <option value="10">Crime Against Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident From</label>
                  <input type="date" value={form.IncidentFromDate} onChange={(e) => updateForm("IncidentFromDate", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident To</label>
                  <input type="date" value={form.IncidentToDate} onChange={(e) => updateForm("IncidentToDate", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input value={form.latitude} onChange={(e) => updateForm("latitude", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="12.9716" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input value={form.longitude} onChange={(e) => updateForm("longitude", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="77.5946" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brief Facts</label>
                <textarea value={form.BriefFacts} onChange={(e) => updateForm("BriefFacts", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          )}

          {/* Step 2: Complainant */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Complainant Details</h3>
              {complainants.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input value={c.name} onChange={(e) => { const u = [...complainants]; u[i].name = e.target.value; setComplainants(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                    <input value={c.age} onChange={(e) => { const u = [...complainants]; u[i].age = e.target.value; setComplainants(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
                  </div>
                  <button onClick={() => handleRemoveArray(complainants, setComplainants, i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => handleAddArray(complainants, setComplainants, emptyPerson)} className="flex items-center gap-2 text-sm text-ksp-blue font-medium hover:underline">
                <Plus className="h-4 w-4" /> Add Complainant
              </button>
            </div>
          )}

          {/* Step 3: Victims */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Victim Details</h3>
              {victims.map((v, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input value={v.name} onChange={(e) => { const u = [...victims]; u[i].name = e.target.value; setVictims(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                    <input value={v.age} onChange={(e) => { const u = [...victims]; u[i].age = e.target.value; setVictims(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
                    <select value={v.gender} onChange={(e) => { const u = [...victims]; u[i].gender = e.target.value; setVictims(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option value="">Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                    <input value={v.police} onChange={(e) => { const u = [...victims]; u[i].police = e.target.value; setVictims(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Police Ref" />
                  </div>
                  <button onClick={() => handleRemoveArray(victims, setVictims, i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => handleAddArray(victims, setVictims, { name: "", age: "", gender: "", police: "" })} className="flex items-center gap-2 text-sm text-ksp-blue font-medium hover:underline">
                <Plus className="h-4 w-4" /> Add Victim
              </button>
            </div>
          )}

          {/* Step 4: Accused */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Accused Details</h3>
              {accused.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input value={a.name} onChange={(e) => { const u = [...accused]; u[i].name = e.target.value; setAccused(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                    <input value={a.age} onChange={(e) => { const u = [...accused]; u[i].age = e.target.value; setAccused(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Age" type="number" />
                    <select value={a.gender} onChange={(e) => { const u = [...accused]; u[i].gender = e.target.value; setAccused(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option value="">Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                    <input value={a.personId} onChange={(e) => { const u = [...accused]; u[i].personId = e.target.value; setAccused(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Person ID" />
                  </div>
                  <button onClick={() => handleRemoveArray(accused, setAccused, i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => handleAddArray(accused, setAccused, { name: "", age: "", gender: "", personId: "" })} className="flex items-center gap-2 text-sm text-ksp-blue font-medium hover:underline">
                <Plus className="h-4 w-4" /> Add Accused
              </button>
            </div>
          )}

          {/* Step 5: Act-Sections */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Acts & Sections</h3>
              {actSections.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <select value={a.actId} onChange={(e) => { const u = [...actSections]; u[i].actId = e.target.value; setActSections(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option value="">Select Act...</option>
                      <option value="1">IPC (Indian Penal Code)</option>
                      <option value="2">CrPC</option>
                      <option value="3">NDPS Act</option>
                      <option value="4">IT Act</option>
                      <option value="5">Arms Act</option>
                    </select>
                    <input value={a.sectionId} onChange={(e) => { const u = [...actSections]; u[i].sectionId = e.target.value; setActSections(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Section (e.g. 302, 376, 420)" />
                  </div>
                  <button onClick={() => handleRemoveArray(actSections, setActSections, i)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => handleAddArray(actSections, setActSections, { actId: "", sectionId: "" })} className="flex items-center gap-2 text-sm text-ksp-blue font-medium hover:underline">
                <Plus className="h-4 w-4" /> Add Section
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-5 py-2 bg-ksp-navy text-white rounded-lg text-sm font-medium hover:bg-ksp-blue transition-colors disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Case"}
              </button>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
