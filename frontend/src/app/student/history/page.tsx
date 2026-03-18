"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { History, Filter, Search, Download } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { useStudentHistory } from "@/hooks/useStudentHistory";
import { Loader2, RefreshCcw } from "lucide-react";

export default function StudentHistory() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  // React Query handles the data fetching and caching
  const { data, isLoading, error, refetch } = useStudentHistory(
    currentPage, 
    itemsPerPage, 
    searchTerm, 
    filterCourse
  );

  const columns = [
    { header: "Course Code", accessorKey: "course", className: "font-bold text-slate-800" },
    { header: "Date", accessorKey: "date" },
    { header: "Time", accessorKey: "time" },
    {
      header: "Verification Method",
      cell: (item: any) => (
        <span className="text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md text-xs">
          {item.method || "GPS + OTC"}
        </span>
      )
    },
    {
      header: "Status",
      cell: (item: any) => (
        <Badge
          variant={item.status === "Present" ? "success" : item.status === "Late" ? "warning" : "danger"}
          className="uppercase tracking-wider text-[10px]"
        >
          {item.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      cell: () => (
        <button className="text-babcock-blue hover:underline text-xs font-semibold">View Details</button>
      )
    }
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
              <History className="w-6 h-6 text-babcock-blue" />
              Attendance Log
            </h1>
            <p className="text-slate-500 mt-1">Review your historical attendance records across all courses.</p>
          </div>

          <Button variant="outline" className="gap-2 shrink-0">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search */}
          <div className="relative w-full md:w-96 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder-slate-400 bg-slate-50"
              placeholder="Search by course or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 shrink-0">
              <Filter className="w-4 h-4" />
              Course Filter:
            </div>
            <div className="min-w-[140px]">
              <Select
                options={[
                  { label: "All Courses", value: "all" },
                  { label: "GEDS 400", value: "GEDS 400" },
                  { label: "SENG 402", value: "SENG 402" },
                  { label: "COSC 411", value: "COSC 411" },
                  { label: "GEDS 420", value: "GEDS 420" },
                ]}
                value={filterCourse}
                onChange={(val) => {
                  setFilterCourse(val);
                  setCurrentPage(1); // Reset page on filter change
                }}
              />
            </div>
          </div>
        </div>

        {/* DataTable Wrapper */}
        <div className="bg-white border text-center border-slate-200 rounded-lg p-1 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-babcock-blue mb-4" />
              <p className="text-slate-500 font-medium">Loading history records...</p>
            </div>
          ) : error || !data ? (
            <div className="w-full bg-red-50 p-6 rounded-lg border border-red-100 flex flex-col items-center">
              <h3 className="text-red-800 font-bold mb-2">Failed to load attendance history</h3>
              <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4 bg-white">
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <DataTable
                data={data.data}
                columns={columns}
                emptyTitle="No records found"
                emptyDescription="There are no attendance logs matching your current filters."
                className="border-0 shadow-none rounded-none"
              />
              
              {/* Pagination Controls */}
              {data.pagination && data.pagination.totalItems > 0 && (
                <div className="flex justify-between items-center py-2 px-4 border-t border-slate-100 gap-4 mt-2">
                  <p className="text-sm text-slate-500 font-medium pb-2 shrink-0">
                    Showing <span className="text-slate-800 font-bold">{(data.pagination.currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="text-slate-800 font-bold">{Math.min(data.pagination.currentPage * itemsPerPage, data.pagination.totalItems)}</span> of{" "}
                    <span className="text-slate-800 font-bold">{data.pagination.totalItems}</span> records
                  </p>
                  <Pagination
                    currentPage={data.pagination.currentPage}
                    totalPages={data.pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
