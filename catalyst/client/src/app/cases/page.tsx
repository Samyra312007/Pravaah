"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Search, Eye, RefreshCw,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { api } from "@/lib/catalyst";
import { formatDate } from "@/lib/utils";
import type { CaseListItem, CaseDetail } from "@/types/case";
import type { Role, ApiResponse } from "@/types/common";

const caseMgmtRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

const columnHelper = createColumnHelper<CaseListItem>();

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [crimeFilter, setCrimeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "CrimeRegisteredDate", desc: true }]);
  const [pageIndex, setPageIndex] = useState(0);
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [crimeHeads, setCrimeHeads] = useState<{ id: number; name: string }[]>([]);
  const [statuses, setStatuses] = useState<{ id: number; name: string }[]>([]);
  const pageSize = 25;

  // Fetch lookup data on mount
  useEffect(() => {
    async function fetchLookups() {
      try {
        const [dRes, cRes, sRes] = await Promise.allSettled([
          api.get<ApiResponse<{ DistrictID: number; DistrictName: string }[]>>("/lookups/districts"),
          api.get<ApiResponse<{ CrimeHeadID: number; CrimeGroupName: string }[]>>("/lookups/crime-heads"),
          api.get<ApiResponse<{ CaseStatusID: number; CaseStatusName: string }[]>>("/lookups/case-statuses"),
        ]);

        if (dRes.status === "fulfilled" && dRes.value.data) {
          setDistricts(dRes.value.data.map((d: { DistrictID: number; DistrictName: string }) => ({ id: d.DistrictID, name: d.DistrictName })));
        }
        if (cRes.status === "fulfilled" && cRes.value.data) {
          setCrimeHeads(cRes.value.data.map((c: { CrimeHeadID: number; CrimeGroupName: string }) => ({ id: c.CrimeHeadID, name: c.CrimeGroupName })));
        }
        if (sRes.status === "fulfilled" && sRes.value.data) {
          setStatuses(sRes.value.data.map((s: { CaseStatusID: number; CaseStatusName: string }) => ({ id: s.CaseStatusID, name: s.CaseStatusName })));
        }
      } catch {
        // If lookup APIs fail, use hardcoded fallbacks
        setDistricts([
          { id: 1, name: "Bengaluru Urban" }, { id: 3, name: "Mysuru" },
          { id: 4, name: "Hubballi-Dharwad" }, { id: 5, name: "Belagavi" }, { id: 6, name: "Ballari" },
        ]);
        setCrimeHeads([
          { id: 1, name: "Murder" }, { id: 2, name: "Robbery" }, { id: 3, name: "Burglary" },
          { id: 4, name: "Assault" }, { id: 5, name: "Fraud" }, { id: 7, name: "Cyber Crime" },
        ]);
        setStatuses([
          { id: 1, name: "Under Investigation" }, { id: 2, name: "Chargesheet Filed" },
          { id: 3, name: "Trial in Progress" }, { id: 4, name: "Convicted" },
          { id: 5, name: "Acquitted" }, { id: 6, name: "Closed" },
        ]);
      }
    }
    fetchLookups();
  }, []);

  // Fetch cases with search query - use dedicated search endpoint when query is present
  useEffect(() => {
    async function fetchCases() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ page: String(pageIndex + 1), perPage: String(pageSize) });
        if (searchQuery) qs.set("q", searchQuery);
        if (districtFilter) qs.set("districtId", districtFilter);
        if (crimeFilter) qs.set("crimeHeadId", crimeFilter);
        if (statusFilter) qs.set("statusId", statusFilter);

        const endpoint = searchQuery ? `/cases/search?${qs}` : `/cases?${qs}`;
        const res = await api.get<ApiResponse<CaseListItem[]>>(endpoint);
        if (res.status === "success" && res.data) {
          setCases(res.data);
          setTotal(res.meta?.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch cases", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, [pageIndex, searchQuery, districtFilter, crimeFilter, statusFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor("CrimeNo", {
      header: "Crime No",
      cell: (info) => (
        <Link href={`/cases/${info.row.original.CaseMasterID}`} className="text-ksp-blue font-medium hover:underline">
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("CaseNo", { header: "Case No" }),
    columnHelper.accessor("CrimeRegisteredDate", {
      header: "Date",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("CrimeGroupName", { header: "Crime Type" }),
    columnHelper.accessor("DistrictName", { header: "District" }),
    columnHelper.accessor("UnitName", { header: "Station" }),
    columnHelper.accessor("CaseStatusName", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const colors: Record<string, string> = {
          "Under Investigation": "bg-yellow-100 text-yellow-700",
          "Chargesheet Filed": "bg-blue-100 text-blue-700",
          "Trial in Progress": "bg-purple-100 text-purple-700",
          Convicted: "bg-red-100 text-red-700",
          Acquitted: "bg-green-100 text-green-700",
          Closed: "bg-gray-100 text-gray-600",
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("GravityOffence", {
      header: "Type",
      cell: (info) => (
        <span className={`text-xs font-medium ${info.getValue() === "Heinous" ? "text-red-600" : "text-gray-500"}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <Link
          href={`/cases/${info.row.original.CaseMasterID}`}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-ksp-blue transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: cases,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
  });

  const SortIcon = ({ column }: { column: { getIsSorted: () => false | "asc" | "desc" } }) => {
    const sorted = column.getIsSorted();
    if (!sorted) return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    return sorted === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1 inline text-ksp-blue" />
      : <ArrowDown className="h-3 w-3 ml-1 inline text-ksp-blue" />;
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <RoleGuard roles={caseMgmtRoles}>
      <div className="space-y-6">
        {/* Search & Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPageIndex(0); }}
                placeholder="Search Crime No, Name, Facts..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ksp-blue/20 focus:border-ksp-blue w-72"
              />
            </div>
            <select value={districtFilter} onChange={(e) => { setDistrictFilter(e.target.value); setPageIndex(0); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select value={crimeFilter} onChange={(e) => { setCrimeFilter(e.target.value); setPageIndex(0); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">All Crime Types</option>
              {crimeHeads.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">All Statuses</option>
              {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button onClick={() => { setSearchQuery(""); setDistrictFilter(""); setCrimeFilter(""); setStatusFilter(""); setPageIndex(0); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="/cases/new"
            className="flex items-center gap-2 px-4 py-2 bg-ksp-navy text-white rounded-lg text-sm font-medium hover:bg-ksp-blue transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Case
          </Link>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Case List</h3>
            <span className="text-sm text-gray-400">{total} case{total !== 1 ? "s" : ""}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-gray-100 bg-gray-50">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <SortIcon column={header.column} />}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">Loading cases...</td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No cases found.</td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {pageIndex + 1} of {totalPages || 1} ({total} total)
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600">
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPageIndex(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(pageIndex - 2, totalPages - 5));
                const num = start + i;
                return (
                  <button
                    key={num}
                    onClick={() => setPageIndex(num)}
                    className={`w-8 h-8 rounded text-sm font-medium ${num === pageIndex ? "bg-ksp-navy text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {num + 1}
                  </button>
                );
              })}
              <button onClick={() => setPageIndex(Math.min(totalPages - 1, pageIndex + 1))} disabled={pageIndex >= totalPages - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600">
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
