"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, Download, AlertTriangle, Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import { ExportModal } from "@/components/ui/ExportModal";
import { toast } from "sonner";
import { WEEKLY_ATTENDANCE, DEPARTMENT_RATES, CRITICAL_STUDENTS } from "@/lib/demodata";

export default function AdminReports() {
    const [exportFormat, setExportFormat] = useState("csv");
    const [exportScope, setExportScope] = useState("all");
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleExport = (format: "csv" | "excel" | "pdf") => {
        toast.success(`Generating ${format.toUpperCase()} report for ${exportScope === 'all' ? 'Entire University' : exportScope}... `);
        setTimeout(() => toast.info("Report downloaded successfully."), 2000);
    };

    const watchlistColumns = [
        { header: "Student", accessorKey: "name" as keyof typeof CRITICAL_STUDENTS[0], className: "font-semibold text-slate-800" },
        { header: "Matric No", accessorKey: "matric" as keyof typeof CRITICAL_STUDENTS[0], className: "font-mono" },
        { header: "Department", accessorKey: "dept" as keyof typeof CRITICAL_STUDENTS[0] },
        {
            header: "Overall Attendance",
            cell: (item: typeof CRITICAL_STUDENTS[0]) => (
                <div className="flex items-center gap-3 w-full max-w-[150px]">
                    <Badge variant="danger" className="w-12 justify-center">{item.attendance}%</Badge>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${item.attendance < 50 ? 'bg-red-600' : 'bg-red-400'}`}
                            style={{ width: `${item.attendance}%` }}
                        />
                    </div>
                </div>
            )
        },
        {
            header: "Action",
            cell: () => (
                <Button variant="outline" size="sm" className="h-8 text-xs border-slate-300 text-slate-600" onClick={() => toast.success("Dean notified.")}>
                    Notify Dean
                </Button>
            )
        }
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-babcock-blue" />
                        System Analytics & Reports
                    </h1>
                    <p className="text-slate-500 mt-1">Global attendance trends and official university exports.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Charts & Visualizers */}
                    <div className="lg:col-span-2 space-y-6">

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg">Weekly Network Attendance</CardTitle>
                                <CardDescription>System-wide check-in rates over the past 5 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {/* CSS Bar Chart Implementation */}
                                <div className="h-64 flex items-end justify-between gap-2 px-2 sm:px-8">
                                    {WEEKLY_ATTENDANCE.map((stat) => (
                                        <div key={stat.day} className="flex flex-col items-center gap-3 w-full group">
                                            <div className="relative w-full h-48 bg-slate-50 rounded-t-lg overflow-hidden flex items-end justify-center group-hover:bg-slate-100 transition-colors">
                                                <div
                                                    className={`w-full ${stat.rate < 80 ? 'bg-amber-400' : 'bg-babcock-blue'} transition-all duration-1000 ease-out flex items-start justify-center pt-2`}
                                                    style={{ height: `${stat.rate}%` }}
                                                >
                                                    <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {stat.rate}%
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600">{stat.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg">Departmental Performance</CardTitle>
                                <CardDescription>Average attendance rates across major faculties.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                {DEPARTMENT_RATES.map((dept) => (
                                    <div key={dept.dept} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-semibold text-slate-700">{dept.dept}</span>
                                            <span className="text-sm font-bold text-slate-900">{dept.rate}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${dept.rate}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-red-200 ring-1 ring-red-100 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    University-wide Threshold Watchlist
                                </CardTitle>
                                <CardDescription className="text-red-800/70">All students currently below the 75% graduation mandate.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    data={CRITICAL_STUDENTS}
                                    columns={watchlistColumns}
                                />
                            </CardContent>
                        </Card>

                    </div>

                    {/* Export Hub */}
                    <div className="lg:col-span-1">
                        <Card className="border-babcock-gold/30 ring-1 ring-babcock-gold/20 shadow-lg bg-gradient-to-b from-white to-amber-50/20 sticky top-6">
                            <CardHeader className="border-b border-babcock-gold/10 pb-4">
                                <div className="w-12 h-12 bg-babcock-gold/20 rounded-lg flex items-center justify-center mb-3">
                                    <Download className="w-6 h-6 text-yellow-700" />
                                </div>
                                <CardTitle className="text-xl text-slate-900">Report Export Hub</CardTitle>
                                <CardDescription>Generate official documentation for senate meetings or faculty reviews.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Scope</label>
                                        <Select
                                            value={exportScope}
                                            onChange={setExportScope}
                                            options={[
                                                { label: "Entire University", value: "all" },
                                                { label: "Computing & Engineering", value: "sat" },
                                                { label: "Babcock Business School", value: "bbs" },
                                                { label: "Specific Course Only", value: "course" }
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Time Range</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <select className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-babcock-blue appearance-none">
                                                <option>Current Semester (Alpha)</option>
                                                <option>Last 30 Days</option>
                                                <option>Previous Semester (Omega)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button onClick={() => setIsExportModalOpen(true)} className="w-full gap-2 mt-2 shadow-md shadow-babcock-blue/20">
                                        <Download className="w-4 h-4" /> Export Report Options
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
                title="System Export"
                description={`Exporting comprehensive data for ${exportScope === 'all' ? 'the entire institution' : exportScope}.`}
            />
        </DashboardLayout>
    );
}

