"use client";

/**
 * @fileoverview Contextual execution boundary for frontend/src/app/admin/sessions/page.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { History, Radio, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export default function AdminSessions() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "session-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/admin/stats");
      return res.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  const liveColumns = [
    {
      header: "Course",
      accessorKey: "course" as const,
      className: "font-semibold",
    },
    { header: "Lecturer", accessorKey: "lecturer" as const },
    { header: "Location", accessorKey: "location" as const },
    {
      header: "OTC Code",
      cell: (item: any) => (
        <span className="font-mono bg-slate-100 px-2 py-1 rounded tracking-widest font-semibold">
          {item.otc}
        </span>
      ),
    },
    {
      header: "Status",
      cell: () => (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1.5 animate-pulse">
          <Radio className="w-3 h-3" /> Live
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-babcock-blue" />
            Session Audit
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor currently active classes and review session metrics.
          </p>
        </div>

        {/* System Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-emerald-200 ring-1 ring-emerald-100 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-500">Active Sessions</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {isLoading ? "—" : stats?.activeSessions || "0"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-100 ring-1 ring-blue-50 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-500">Total Students</p>
              <p className="text-3xl font-bold text-babcock-blue mt-1">
                {isLoading ? "—" : stats?.totalStudents || "0"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-100 ring-1 ring-red-50 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-500">Flagged Absences</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {isLoading ? "—" : stats?.flaggedAbsences || "0"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Sessions */}
        <Card className="border-emerald-200 ring-1 ring-emerald-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-emerald-100 bg-emerald-50/30">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
              Live Active Sessions
              {!isLoading && stats?.activeSessions && parseInt(stats.activeSessions) > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-2">
                  {stats.activeSessions} active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Classes currently accepting check-ins across campus.
            </CardDescription>
          </CardHeader>
          <CardContent className="py-8 text-center text-slate-500">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                Loading session data...
              </div>
            ) : stats?.activeSessions && parseInt(stats.activeSessions) > 0 ? (
              <p className="font-medium text-emerald-700">
                {stats.activeSessions} session(s) currently active across the university.
              </p>
            ) : (
              <p>No active sessions at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}