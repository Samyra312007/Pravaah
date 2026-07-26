"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Association } from "@/types/network";

interface AssociationTableProps {
  associations: Association[];
}

type SortKey = "sourceEntity" | "targetEntity" | "associationType" | "strength" | "casesInCommon";

export function AssociationTable({ associations }: AssociationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("strength");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");

  const sorted = useMemo(() => {
    const filtered = filter
      ? associations.filter(
          (a) =>
            a.sourceEntity.toLowerCase().includes(filter.toLowerCase()) ||
            a.targetEntity.toLowerCase().includes(filter.toLowerCase()) ||
            a.associationType.toLowerCase().includes(filter.toLowerCase())
        )
      : associations;

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [associations, sortKey, sortDir, filter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1 inline text-ksp-blue" />
      : <ArrowDown className="h-3 w-3 ml-1 inline text-ksp-blue" />;
  };

  if (!associations.length) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
        No associations detected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by entity or type..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksp-blue/20 focus:border-ksp-blue"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                { key: "sourceEntity" as SortKey, label: "Source" },
                { key: "targetEntity" as SortKey, label: "Target" },
                { key: "associationType" as SortKey, label: "Association" },
                { key: "strength" as SortKey, label: "Strength" },
                { key: "casesInCommon" as SortKey, label: "Cases" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                >
                  {col.label}
                  <SortIcon columnKey={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((assoc, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{assoc.sourceEntity}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{assoc.targetEntity}</td>
                <td className="px-4 py-3">
                  <Badge variant={assoc.strength > 0.7 ? "danger" : assoc.strength > 0.5 ? "warning" : "info"}>
                    {assoc.associationType}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ksp-blue rounded-full"
                        style={{ width: `${Math.round(assoc.strength * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(assoc.strength * 100)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{assoc.casesInCommon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">{sorted.length} of {associations.length} associations</p>
    </div>
  );
}
