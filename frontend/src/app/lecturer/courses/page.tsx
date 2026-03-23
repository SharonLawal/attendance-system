"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BookOpen, Users, ArrowRight, ChevronLeft, Loader2, Download, Table, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable } from "@/components/ui/DataTable";
import { useLecturerCoursesSummary } from "@/hooks/useLecturerData";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export default function LecturerCourses() {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"pending" | "roster">("pending");

  const { data: courses = [], isLoading } = useLecturerCoursesSummary();

  // Fetch pending check-ins for the selected course (real enrolled students data)
  const { data: pendingData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["course", selectedCourse?.id, "pending"],
    queryFn: async () => {
      if (!selectedCourse?.id) return [];
      const res = await apiClient.get(`/api/courses/${selectedCourse.id}/pending`);
      return res.data.data || [];
    },
    enabled: !!selectedCourse?.id && viewMode === "pending",
    staleTime: 30 * 1000,
  });

  // Fetch full roster analytics 
  const { data: rosterPayload, isLoading: isLoadingRoster } = useQuery({
    queryKey: ["course", selectedCourse?.id, "roster"],
    queryFn: async () => {
      if (!selectedCourse?.id) return { data: [], totalSessions: 0 };
      const res = await apiClient.get(`/api/courses/${selectedCourse.id}/roster`);
      return res.data;
    },
    enabled: !!selectedCourse?.id && viewMode === "roster",
    staleTime: 30 * 1000,
  });

  const downloadCsv = () => {
    if (!rosterPayload?.data) return;
    const items = rosterPayload.data;
    const csvContent = [
      ["Name", "Matric No", "Email", "Present Count", "Total Sessions", "Score (%)"],
      ...items.map((r: any) => [
        `"${r.fullName}"`,
        r.universityId,
        r.email,
        r.presentCount,
        r.totalSessions,
        r.score
      ])
    ]
      .map(e => e.join(","))
      .join("\n");
      
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedCourse?.code || "course"}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Roster exported successfully.");
  };

  const studentColumns = [
    {
      header: "Student",
      accessorKey: "studentId",
      cell: (item: any) => (
        <span className="font-semibold text-slate-800">
          {item.studentId?.fullName || "Unknown"}
        </span>
      ),
    },
    {
      header: "Matric No",
      cell: (item: any) => (
        <span className="font-mono text-sm text-slate-500">
          {item.studentId?.universityId || "—"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item: any) => (
        <Badge variant={item.status === "Present" ? "success" : item.status === "Pending" ? "warning" : "danger"}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Email",
      cell: (item: any) => (
        <span className="text-sm text-slate-500">{item.studentId?.email || "—"}</span>
      ),
    },
  ];

  const rosterColumns = [
    {
      header: "Student",
      accessorKey: "fullName",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
            {item.profilePicture ? (
                <img src={item.profilePicture} alt={item.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                    {item.fullName?.substring(0, 2).toUpperCase()}
                </div>
            )}
            <span className="font-semibold text-slate-800">{item.fullName}</span>
        </div>
      ),
    },
    {
      header: "Matric No",
      accessorKey: "universityId",
      cell: (item: any) => (
        <span className="font-mono text-sm text-slate-500">{item.universityId}</span>
      ),
    },
    {
      header: "Score",
      cell: (item: any) => (
        <Badge variant={item.score >= 75 ? "success" : item.score >= 50 ? "warning" : "danger"}>
          {item.score}%
        </Badge>
      ),
    },
    {
      header: "Metrics",
      cell: (item: any) => (
        <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
          {item.presentCount} / {item.totalSessions} sessions
        </span>
      ),
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
            <p className="text-slate-500 mt-1">
              Manage your assigned modules and monitor student rosters.
            </p>
          </div>
        </div>

        {selectedCourse ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
              variant="ghost"
              className="gap-2 text-slate-500 hover:text-babcock-blue"
              onClick={() => setSelectedCourse(null)}
            >
              <ChevronLeft className="w-4 h-4" /> Back to Course Directory
            </Button>

            <Card className="border-babcock-blue/20 ring-1 ring-babcock-blue/10 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
              <CardHeader className="pb-4 border-b border-babcock-blue/5">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="neutral" className="mb-2 uppercase tracking-wide">
                      {selectedCourse.code}
                    </Badge>
                    <CardTitle className="text-xl md:text-2xl text-babcock-blue">
                      {selectedCourse.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedCourse.sessionsHeld} sessions held • {selectedCourse.averageAttendance}% avg attendance
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Enrolled</p>
                    <p className="text-2xl font-bold font-display text-slate-800">
                      {selectedCourse.totalStudents}
                    </p>
                  </div>
                </div>
                
                {/* Mode Selector Tabs */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-babcock-blue/5">
                    <Button 
                      variant={viewMode === "pending" ? "babcock" : "outline"} 
                      size="sm" 
                      onClick={() => setViewMode("pending")}
                      className={viewMode === "pending" ? "bg-babcock-blue shadow-md" : "bg-white text-slate-600"}
                    >
                      <Loader2 className={`w-4 h-4 mr-2 ${isLoadingDetails ? 'animate-spin' : ''}`} />
                      Pending Action
                    </Button>
                    <Button 
                      variant={viewMode === "roster" ? "babcock" : "outline"} 
                      size="sm" 
                      onClick={() => setViewMode("roster")}
                      className={viewMode === "roster" ? "bg-slate-800 shadow-md" : "bg-white text-slate-600"}
                    >
                      <Table className="w-4 h-4 mr-2" />
                      Full Roster Analytics
                    </Button>

                    {viewMode === "roster" && (
                        <div className="ml-auto flex items-center gap-2">
                            <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={() => {
                                 const lowAttendance = rosterPayload?.data?.filter((r: any) => r.score < 75)?.length || 0;
                                 if (lowAttendance > 0) {
                                   toast.success(`Warning email queued for ${lowAttendance} students below the 75% threshold.`);
                                 } else {
                                   toast.info("No students currently fall below the 75% threshold.");
                                 }
                               }}
                               className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hidden sm:flex"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" /> Notify Defaulters
                            </Button>
                            <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={downloadCsv}
                               className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                                <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Export CSV</span>
                            </Button>
                        </div>
                    )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === "pending" ? (
                  isLoadingDetails ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-babcock-blue" />
                    </div>
                  ) : !pendingData || pendingData.length === 0 ? (
                    <div className="py-12 px-6 text-center text-slate-500 text-sm">
                      No pending check-ins for this course. Students who check in will appear here for approval.
                    </div>
                  ) : (
                    <DataTable
                      data={pendingData}
                      columns={studentColumns}
                      emptyTitle="No pending check-ins."
                    />
                  )
                ) : (
                  isLoadingRoster ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
                    </div>
                  ) : !rosterPayload?.data || rosterPayload.data.length === 0 ? (
                    <div className="py-12 px-6 text-center text-slate-500 text-sm">
                      No students are currently enrolled in this roster.
                    </div>
                  ) : (
                    <DataTable
                      data={rosterPayload.data}
                      columns={rosterColumns}
                      emptyTitle="Roster is empty."
                    />
                  )
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="w-full py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading courses...</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                  <Card
                    key={course.id}
                    className="group cursor-pointer hover:shadow-md hover:border-babcock-blue/50 transition-all active:scale-[0.98] border-slate-200"
                    onClick={() => {
                        setSelectedCourse(course);
                        setViewMode("pending");
                    }}
                  >
                    <CardHeader className="pb-3 border-b border-slate-50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-babcock-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700 ease-out" />
                      <Badge
                        variant="neutral"
                        className="w-fit mb-2 bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-babcock-blue transition-colors"
                      >
                        {course.code}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-1">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Users className="w-4 h-4" />
                            <span>{course.totalStudents} Enrolled</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {course.sessionsHeld} sessions • {course.averageAttendance}% avg
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
                description="You have not been assigned to facilitate any courses for the current semester. Create a course from the dashboard to get started."
                icon="folder"
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}