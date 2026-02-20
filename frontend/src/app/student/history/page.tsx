"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { History, Filter, Search, Download } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";

import { RECENT_HISTORY, EXTENDED_HISTORY } from "@/lib/demodata";

export default function StudentHistory() {
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // Filter Logic
  const filteredData = EXTENDED_HISTORY.filter(record => {
    const matchesCourse = filterCourse === "all" || record.course === filterCourse;
    const matchesSearch = record.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "Course Code", accessorKey: "course" as keyof typeof EXTENDED_HISTORY[0], className: "font-bold text-slate-800" },
    { header: "Date", accessorKey: "date" as keyof typeof EXTENDED_HISTORY[0] },
    { header: "Time", accessorKey: "time" as keyof typeof EXTENDED_HISTORY[0] },
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
      cell: (item: typeof EXTENDED_HISTORY[0]) => (
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
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">

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
        <div className="bg-white border text-center border-slate-200 rounded-2xl p-1 overflow-hidden shadow-sm">
          <DataTable
            data={paginatedData}
            columns={columns}
            emptyTitle="No records found"
            emptyDescription="There are no attendance logs matching your current filters."
            className="border-0 shadow-none rounded-none"
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center py-2 px-1">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{" "}
            <span className="text-slate-800 font-bold">{Math.min(filteredData.length, currentPage * itemsPerPage)}</span> of{" "}
            <span className="text-slate-800 font-bold">{filteredData.length}</span> records
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </DashboardLayout>
  );
}