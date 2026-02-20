"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { History, Radio, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";

// Mock Session Data
const LIVE_SESSIONS = [
    { id: "S-1002", course: "GEDS 400", lecturer: "Dr. Jane Smith", location: "BBS Room 1", otc: "A8X2B9", startedAt: "10:00 AM", checkins: 42, active: true },
    { id: "S-1003", course: "COSC 411", lecturer: "Prof. Alan Turing", location: "SAT Hub", otc: "7Y4M21", startedAt: "10:30 AM", checkins: 88, active: true },
];

const SESSION_HISTORY = [
    { id: "S-0998", course: "SENG 402", lecturer: "Dr. Ada Lovelace", location: "LT 1", date: "Oct 24, 2023", duration: "1h 15m", totalCheckins: 112 },
    { id: "S-0997", course: "GEDS 400", lecturer: "Dr. Jane Smith", location: "BBS Room 1", date: "Oct 23, 2023", duration: "55m", totalCheckins: 45 },
    { id: "S-0996", course: "COSC 411", lecturer: "Prof. Alan Turing", location: "SAT Hub", date: "Oct 23, 2023", duration: "1h 05m", totalCheckins: 89 },
    { id: "S-0995", course: "MATH 101", lecturer: "Dr. Issac Newton", location: "Auditorium", date: "Oct 22, 2023", duration: "45m", totalCheckins: 210 },
];

export default function AdminSessions() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCourse, setFilterCourse] = useState("all");

    const filteredHistory = SESSION_HISTORY.filter(session => {
        const matchesSearch = session.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = filterCourse === 'all' || session.course === filterCourse;
        return matchesSearch && matchesCourse;
    });

    const liveColumns = [
        { header: "Session ID", accessorKey: "id" as keyof typeof LIVE_SESSIONS[0], className: "font-mono text-sm text-slate-500" },
        { header: "Course", accessorKey: "course" as keyof typeof LIVE_SESSIONS[0], className: "font-semibold" },
        { header: "Lecturer", accessorKey: "lecturer" as keyof typeof LIVE_SESSIONS[0] },
        { header: "Location", accessorKey: "location" as keyof typeof LIVE_SESSIONS[0] },
        {
            header: "OTC",
            cell: (item: typeof LIVE_SESSIONS[0]) => (
                <span className="font-mono bg-slate-100 px-2 py-1 rounded tracking-widest font-semibold">{item.otc}</span>
            )
        },
        {
            header: "Status",
            cell: () => (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 animate-pulse">
                    <Radio className="w-3 h-3" /> Live
                </Badge>
            )
        }
    ];

    const historyColumns = [
        { header: "Session ID", accessorKey: "id" as keyof typeof SESSION_HISTORY[0], className: "font-mono text-sm text-slate-500" },
        { header: "Course", accessorKey: "course" as keyof typeof SESSION_HISTORY[0], className: "font-semibold" },
        { header: "Lecturer", accessorKey: "lecturer" as keyof typeof SESSION_HISTORY[0] },
        { header: "Date", accessorKey: "date" as keyof typeof SESSION_HISTORY[0] },
        { header: "Duration", accessorKey: "duration" as keyof typeof SESSION_HISTORY[0], className: "text-slate-500" },
        { header: "Check-ins", accessorKey: "totalCheckins" as keyof typeof SESSION_HISTORY[0] },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <History className="w-6 h-6 text-babcock-blue" />
                        Session Audit
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor currently active classes and review historical attendance records.</p>
                </div>

                {/* Live Sessions */}
                <Card className="border-emerald-200 ring-1 ring-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/10">
                    <CardHeader className="pb-4 border-b border-emerald-100 bg-emerald-50/30">
                        <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                            <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
                            Live Active Sessions
                        </CardTitle>
                        <CardDescription>Classes currently accepting check-ins across the university map.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            data={LIVE_SESSIONS}
                            columns={liveColumns}
                            emptyTitle="No active sessions at the moment."
                        />
                    </CardContent>
                </Card>

                {/* Historical Audit Log */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-500" />
                                Historical Audit Log
                            </CardTitle>
                            <CardDescription>Immutable record of all completed sessions.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <SearchBar
                                placeholder="Search ID, Lecturer, Course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 bg-white"
                            />
                            <div className="w-full sm:w-40">
                                <Select
                                    value={filterCourse}
                                    onChange={setFilterCourse}
                                    options={[
                                        { label: "All Courses", value: "all" },
                                        { label: "GEDS 400", value: "GEDS 400" },
                                        { label: "COSC 411", value: "COSC 411" },
                                        { label: "SENG 402", value: "SENG 402" },
                                        { label: "MATH 101", value: "MATH 101" }
                                    ]}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable
                            data={filteredHistory}
                            columns={historyColumns}
                            emptyTitle="No past sessions match your criteria."
                        />
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
}

