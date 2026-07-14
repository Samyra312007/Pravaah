"use client";

import { X, MapPin, Calendar, Hash, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NetworkNode } from "@/types/network";

interface NodeDetailsProps {
  node: NetworkNode;
  onClose: () => void;
}

const NODE_TYPE_LABELS: Record<string, string> = {
  suspect: "Suspect / Accused",
  victim: "Victim",
  case: "Case / FIR",
  location: "Location",
};

const NODE_TYPE_COLORS: Record<string, "danger" | "info" | "primary" | "success"> = {
  suspect: "danger",
  victim: "info",
  case: "primary",
  location: "success",
};

export function NodeDetails({ node, onClose }: NodeDetailsProps) {
  const d = node.data || {};

  const renderField = (key: string, icon: React.ReactNode, label: string) => {
    const val = d[key];
    if (val === undefined || val === null) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {icon}
        <span>{label}: <strong>{String(val)}</strong></span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Badge variant={NODE_TYPE_COLORS[node.type] || "default"}>
            {NODE_TYPE_LABELS[node.type] || node.type}
          </Badge>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-base">{node.label}</h3>

        {renderField("age", <Hash className="h-3.5 w-3.5 text-gray-400" />, "Age")}
        {renderField("district", <MapPin className="h-3.5 w-3.5 text-gray-400" />, "District")}
        {renderField("date", <Calendar className="h-3.5 w-3.5 text-gray-400" />, "Registered")}
        {renderField("crimeNo", <Hash className="h-3.5 w-3.5 text-gray-400" />, "Crime No")}
        {renderField("status", <AlertTriangle className="h-3.5 w-3.5 text-gray-400" />, "Status")}
        {renderField("cases", <Hash className="h-3.5 w-3.5 text-gray-400" />, "Linked Cases")}

        {!!d.crimeGroup && (
          <div><Badge variant="warning">{String(d.crimeGroup)}</Badge></div>
        )}

        {!!d.mo && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">Modus Operandi</p>
            <p className="text-sm text-gray-700 leading-relaxed">{String(d.mo)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
