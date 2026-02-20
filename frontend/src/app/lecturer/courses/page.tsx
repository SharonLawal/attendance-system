"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BookOpen, Users, ArrowRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable } from "@/components/ui/DataTable";
import { LECTURER_COURSES } from "@/lib/demodata";

// Mock Student Drill-down Data
const COURSE_STUDENTS = [
    { id: 1, name: "Sharon Lawal", matric: "22/0234", attendance: 68, classesAttended: 13, classesMissed: 6 },
    { id: 2, name: "John Doe", matric: "21/1234", attendance: 95, classesAttended: 18, classesMissed: 1 },
    { id: 3, name: "Jessica Davis", matric: "22/1122", attendance: 84, classesAttended: 16, classesMissed: 3 },
    { id: 4, name: "Michael Johnson", matric: "19/5432", attendance: 45, classesAttended: 8, classesMissed: 11 },
    { id: 5, name: "Emily Brown", matric: "20/4455", attendance: 100, classesAttended: 19, classesMissed: 0 },
];

export default function LecturerCourses() {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const drillDownData = selectedCourseId ? COURSE_STUDENTS : [];
    const courseDetails = LECTURER_COURSES.find(c => c.id === selectedCourseId);

    const studentColumns = [
        { header: "Student", accessorKey: "name" as keyof typeof COURSE_STUDENTS[0], className: "font-semibold text-slate-800" },
        { header: "Matric No", accessorKey: "matric" as keyof typeof COURSE_STUDENTS[0], className: "font-mono text-sm" },
        {
            header: "Attendance Rate",
            cell: (item: typeof COURSE_STUDENTS[0]) => (
                <div className="flex items-center gap-3 w-full max-w-[150px]">
                    <span className="font-semibold text-sm w-8">{item.attendance}%</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${item.attendance < 75 ? 'bg-red-500' : item.attendance < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${item.attendance}%` }}
                        />
                    </div>
                </div>
            )
        },
        {
            header: "Classes",
            cell: (item: typeof COURSE_STUDENTS[0]) => (
                <span className="text-sm text-slate-500">
                    <span className="text-emerald-600 font-medium">{item.classesAttended}</span>
                    {" / "}
                    <span className="text-red-500">{item.classesMissed}</span>
                </span>
            )
        },
    ];

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-babcock-blue" />
                            My Courses
                        </h1>
                        <p className="text-slate-500 mt-1">Manage your assigned modules and monitor student rosters.</p>
                    </div>
                </div>

                {selectedCourseId ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Button variant="ghost" className="gap-2 text-slate-500 hover:text-babcock-blue" onClick={() => setSelectedCourseId(null)}>
                            <ChevronLeft className="w-4 h-4" /> Back to Course Directory
                        </Button>

                        <Card className="border-babcock-blue/20 ring-1 ring-babcock-blue/10 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
                            <CardHeader className="pb-4 border-b border-babcock-blue/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="neutral" className="mb-2 uppercase tracking-wide">{courseDetails?.code}</Badge>
                                        <CardTitle className="text-xl md:text-2xl text-babcock-blue">{courseDetails?.title}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 font-medium">Class Roster</p>
                                        <p className="text-2xl font-bold font-display text-slate-800">{courseDetails?.totalStudents}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    data={drillDownData}
                                    columns={studentColumns}
                                    emptyTitle="No students registered for this course yet."
                                />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <>
                        {LECTURER_COURSES.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {LECTURER_COURSES.map(course => (
                                    <Card
                                        key={course.id}
                                        className="group cursor-pointer hover:shadow-md hover:border-babcock-blue/50 transition-all active:scale-[0.98] border-slate-200"
                                        onClick={() => setSelectedCourseId(course.id)}
                                    >
                                        <CardHeader className="pb-3 border-b border-slate-50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-babcock-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />
                                            <Badge variant="neutral" className="w-fit mb-2 bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-babcock-blue transition-colors">{course.code}</Badge>
                                            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4 flex flex-col gap-4">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                        <Users className="w-4 h-4" />
                                                        <span>{course.totalStudents} Enrolled</span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-babcock-blue group-hover:text-white transition-colors">
                                                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No Assigned Courses"
                                description="You have not been assigned to facilitate any courses for the current semester."
                                icon="folder"
                            />
                        )}
                    </>
                )}

            </div>
        </DashboardLayout>
    );
}

