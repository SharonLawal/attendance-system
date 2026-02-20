"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { COURSES_DATA, Course } from "@/lib/demodata";

export default function StudentCourses() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network fetch
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "safe": return "bg-emerald-500";
      case "warning": return "bg-amber-500";
      case "critical": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusBadge = (status: Course["status"]) => {
    switch (status) {
      case "safe": return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Good Standing</Badge>;
      case "warning": return <Badge variant="warning" className="gap-1"><AlertTriangle className="w-3.5 h-3.5" /> At Risk</Badge>;
      case "critical": return <Badge variant="danger" className="gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Probation</Badge>;
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">View your registered courses and track your attendance progress.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-sm ring-1 ring-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : COURSES_DATA.length === 0 ? (
          <EmptyState
            title="No Registered Courses"
            description="You are currently not registered for any courses this semester. Please contact course registration."
            icon="folder"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {COURSES_DATA.map((course) => (
              <Card key={course.id} className="border-0 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="w-4 h-4 text-babcock-blue" />
                        {course.code}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-1">{course.title}</CardDescription>
                      <p className="text-xs text-slate-400 mt-2 font-medium">{course.instructor}</p>
                    </div>
                    <div className="shrink-0">{getStatusBadge(course.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attendance</p>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {course.attendedClasses} / {course.totalClasses} Classes
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-display text-slate-900">{course.attendancePercentage}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
                      {/* 75% Threshold Marker */}
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-400/50 z-10" title="75% Requirement Mark" />

                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${getStatusColor(course.status)}`}
                        style={{ width: `${course.attendancePercentage}%` }}
                      />
                    </div>
                    {course.attendancePercentage < 75 && (
                      <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {75 - course.attendancePercentage}% short of required minimum
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}