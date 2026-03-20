"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { History, Search, Download, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { useStudentHistory } from "@/hooks/useStudentHistory";
import { Loader2, RefreshCcw } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function StudentHistory() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all history (high limit for client-side filtering)
  const { data, isLoading, error, refetch } = useStudentHistory(1, 100);

  // Build unique course list from fetched data
  const courseOptions = useMemo(() => {
    if (!data?.data) return [{ label: "All Courses", value: "all" }];
    const codes = [...new Set(data.data.map((r: any) => r.course).filter(Boolean))];
    return [
      { label: "All Courses", value: "all" },
      ...codes.map((code: string) => ({ label: code, value: code })),
    ];
  }, [data]);

  // Client-side filtering
  const filteredRecords = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((record: any) => {
      const matchesCourse =
        filterCourse === "all" || record.course === filterCourse;
      const matchesSearch =
        !searchTerm ||
        record.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCourse && matchesSearch;
    });
  }, [data, filterCourse, searchTerm]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (val: string) => {
    setFilterCourse(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Course Code",
      accessorKey: "course",
      className: "font-bold text-slate-800",
    },
    { header: "Date", accessorKey: "date" },
    { header: "Time", accessorKey: "time" },
    {
      header: "Verification Method",
      cell: (item: any) => (
        <span className="text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md text-xs">
          {item.method === "Manual_GPS"
            ? "GPS + OTC"
            : item.method === "LMS_Sync"
            ? "LMS Sync"
            : item.method || "GPS + OTC"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <Badge
          variant={
            item.status === "Present"
              ? "success"
              : item.status === "Pending"
              ? "warning"
              : "danger"
          }
          className="uppercase tracking-wider text-[10px]"
        >
          {item.status}
        </Badge>
      ),
    },
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
            <p className="text-slate-500 mt-1">
              Review your historical attendance records across all courses.
            </p>
          </div>
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
              placeholder="Search by course, date, or status..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 shrink-0">
              <Filter className="w-4 h-4" />
              Course:
            </div>
            <div className="min-w-[160px]">
              <Select
                options={courseOptions}
                value={filterCourse}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border text-center border-slate-200 rounded-lg p-1 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-babcock-blue mb-4" />
              <p className="text-slate-500 font-medium">Loading attendance records...</p>
            </div>
          ) : error || !data ? (
            <div className="w-full bg-red-50 p-6 rounded-lg border border-red-100 flex flex-col items-center">
              <h3 className="text-red-800 font-bold mb-2">
                Failed to load attendance history
              </h3>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="gap-2 mt-4 bg-white"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <DataTable
                data={paginatedRecords}
                columns={columns}
                emptyTitle="No records found"
                emptyDescription="There are no attendance logs matching your current filters."
                className="border-0 shadow-none rounded-none"
              />

              {filteredRecords.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center py-3 px-4 border-t border-slate-100 gap-4 mt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Showing{" "}
                    <span className="text-slate-800 font-bold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-slate-800 font-bold">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredRecords.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="text-slate-800 font-bold">
                      {filteredRecords.length}
                    </span>{" "}
                    records
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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