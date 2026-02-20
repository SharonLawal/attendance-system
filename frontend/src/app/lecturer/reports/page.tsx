"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, Download, AlertTriangle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ExportModal } from "@/components/ui/ExportModal";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner";
import { LECTURER_COURSES, DETAILED_REPORTS } from "@/lib/demodata";



export default function LecturerReports() {
    const [filterCourse, setFilterCourse] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const itemsPerPage = 5;

    // Filter Logic
    const filteredData = DETAILED_REPORTS.filter(record => {
        const matchesCourse = filterCourse === "all" || record.course === filterCourse;
        const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.matric.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSendWarning = (studentName: string) => {
        toast.success(`Warning email dispatched to ${studentName}`);
    };

    const columns = [
        { header: "Student Name", accessorKey: "name" as keyof typeof DETAILED_REPORTS[0], className: "font-semibold text-slate-800" },
        { header: "Matric No.", accessorKey: "matric" as keyof typeof DETAILED_REPORTS[0] },
        { header: "Course", accessorKey: "course" as keyof typeof DETAILED_REPORTS[0], className: "font-medium" },
        { header: "Date", accessorKey: "date" as keyof typeof DETAILED_REPORTS[0] },
        {
            header: "Status",
            cell: (item: typeof DETAILED_REPORTS[0]) => (
                <Badge variant={item.status === "Present" ? "success" : item.status === "Late" ? "warning" : "danger"} className="uppercase tracking-wider text-[10px]">
                    {item.status}
                </Badge>
            )
        }
    ];

    // Identify Students below 75% for Threshold Alert
    // In a real app this would be computed or fetched from the backend. Muxing it here:
    const atRiskStudents = [
        { name: "John Doe", matric: "21/1234", course: "GEDS 400", attendance: 68 },
        { name: "Emily Brown", matric: "20/4455", course: "GEDS 400", attendance: 45 },
    ];

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-babcock-blue" />
                            Reports & Analytics
                        </h1>
                        <p className="text-slate-500 mt-1">Review course attendance aggregates, identify at-risk students, and export detailed logs.</p>
                    </div>
                </div>

                {/* Course Overview Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {LECTURER_COURSES.map(course => (
                        <Card key={course.id} className="border-0 ring-1 ring-slate-200 shadow-sm relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${course.averageAttendance < 75 ? 'bg-red-500' : course.averageAttendance < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{course.code}</CardTitle>
                                <CardDescription className="line-clamp-1">{course.title}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-medium text-slate-500">{course.totalStudents} Students</p>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold font-display text-slate-800">{course.averageAttendance}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Detailed Data Table */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-babcock-blue focus:border-babcock-blue"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Filter className="w-4 h-4" /> Course:
                                </div>
                                <div className="min-w-[140px]">
                                    <Select
                                        value={filterCourse}
                                        onChange={(v) => { setFilterCourse(v); setCurrentPage(1); }}
                                        options={[
                                            { label: "All Courses", value: "all" },
                                            ...LECTURER_COURSES.map(c => ({ label: c.code, value: c.code }))
                                        ]}
                                    />
                                </div>
                                <Button onClick={() => setIsExportModalOpen(true)} variant="outline" className="gap-2 shrink-0 border-slate-200">
                                    <Download className="w-4 h-4" /> Export
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <DataTable
                                data={paginatedData}
                                columns={columns}
                                emptyTitle="No attendance records found"
                            />
                            <div className="p-3 border-t border-slate-100 flex justify-center bg-slate-50">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Threshold Watchlist */}
                    <div className="lg:col-span-1">
                        <Card className="border-red-100 shadow-sm bg-red-50/30 w-full h-full flex flex-col items-stretch ring-1 ring-red-200">
                            <CardHeader className="pb-3 border-b border-red-100 bg-white/50">
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    Threshold Watchlist
                                </CardTitle>
                                <CardDescription className="text-red-600/80">Students below 75% attendance.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-y-auto">
                                {atRiskStudents.length > 0 ? (
                                    <ul className="divide-y divide-red-100">
                                        {atRiskStudents.map((student, idx) => (
                                            <li key={idx} className="p-4 hover:bg-red-50/80 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                                                        <p className="text-xs text-slate-500">{student.matric} • {student.course}</p>
                                                    </div>
                                                    <Badge variant="danger" className="text-red-700 bg-red-100 border-red-200">{student.attendance}%</Badge>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="w-full mt-2 text-xs bg-white border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                                                    onClick={() => handleSendWarning(student.name)}
                                                >
                                                    Send Warning Notification
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-sm font-medium text-emerald-600">All students are above the required threshold.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </div>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={(format) => {
                    toast.success(`Exporting ${filterCourse} report as ${format.toUpperCase()}`);
                    setTimeout(() => toast.info("Download completed."), 1500);
                }}
            />
        </DashboardLayout>
    );
}

