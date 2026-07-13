"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Search, Eye,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { useCases } from "@/hooks/useCases";
import { formatDate } from "@/lib/utils";
import type { CaseListItem } from "@/types/case";
import type { Role } from "@/types/common";

const caseMgmtRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR"];

const columnHelper = createColumnHelper<CaseListItem>();

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [crimeFilter, setCrimeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "CrimeRegisteredDate", desc: true }]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 25;

  const params = useMemo(() => {
    const p: Record<string, string | number> = { page: pageIndex + 1, perPage: pageSize };
    if (searchQuery) p.searchQuery = searchQuery;
    if (districtFilter) p.districtId = districtFilter;
    if (crimeFilter) p.crimeHeadId = crimeFilter;
    if (statusFilter) p.statusId = statusFilter;
    return p;
  }, [pageIndex, searchQuery, districtFilter, crimeFilter, statusFilter]);

  const { cases, total, loading } = useCases(params);

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
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex, pageSize, pageSize });
        setPageIndex(next.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
  });

  const SortIcon = ({ column }: { column: { isSorted: false | "asc" | "desc" } }) => {
    if (!column.isSorted) return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    return column.isSorted === "asc"
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
              <option value="1">Bengaluru Urban</option>
              <option value="3">Mysuru</option>
              <option value="4">Hubballi-Dharwad</option>
              <option value="5">Belagavi</option>
              <option value="6">Ballari</option>
            </select>
            <select value={crimeFilter} onChange={(e) => { setCrimeFilter(e.target.value); setPageIndex(0); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">All Crime Types</option>
              <option value="1">Murder</option>
              <option value="2">Robbery</option>
              <option value="3">Burglary</option>
              <option value="4">Assault</option>
              <option value="5">Fraud</option>
              <option value="7">Cyber Crime</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">All Statuses</option>
              <option value="1">Under Investigation</option>
              <option value="2">Chargesheet Filed</option>
              <option value="3">Trial in Progress</option>
              <option value="4">Convicted</option>
              <option value="5">Acquitted</option>
              <option value="6">Closed</option>
            </select>
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
