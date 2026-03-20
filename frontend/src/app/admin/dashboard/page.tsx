"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowRight, ActivitySquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users, AlertTriangle, Play } from "lucide-react";
import { useAdminDashboard, useAdminUsers } from "@/hooks/useAdminData";
import { useQuery } from "@tanstack/react-query";
import * as adminService from "@/services/adminService";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: dashboardData, isLoading: isLoadingStats } = useAdminDashboard();
  const { data: usersData, isLoading: isLoadingUsers } = useAdminUsers(1, 3, searchTerm, "All");

  // Fetch real audit logs
  const { data: auditLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: async () => {
      const res = await adminService.getAuditLogs(10);
      return Array.isArray(res) ? res : [];
    },
    staleTime: 60 * 1000,
  });

  const filteredUsers = usersData?.users || [];

  const adminStats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents || "0",
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
      border: "border-blue-100",
    },
    {
      title: "Active Sessions",
      value: dashboardData?.activeSessions || "0",
      icon: Play,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      border: "border-emerald-100",
    },
    {
      title: "Flagged Absences",
      value: dashboardData?.flaggedAbsences || "0",
      icon: AlertTriangle,
      bg: "bg-red-50",
      color: "text-red-600",
      border: "border-red-100",
    },
    {
      title: "System Health",
      value: dashboardData?.systemHealth || "0%",
      icon: ActivitySquare,
      bg: "bg-babcock-blue/10",
      color: "text-babcock-blue",
      border: "border-babcock-blue/20",
    },
  ];

  const userColumns = [
    {
      header: "Name",
      accessorKey: "name" as const,
      className: "font-semibold",
    },
    {
      header: "ID",
      accessorKey: "identifier" as const,
      className: "text-slate-500 text-sm",
    },
    { header: "Role", accessorKey: "role" as const },
    {
      header: "Status",
      cell: (item: any) => (
        <Badge
          variant={
            item.status === "Active"
              ? "success"
              : item.status === "Suspended"
              ? "danger"
              : "neutral"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            System Command Center
          </h1>
          <p className="text-slate-500 mt-1">
            High-level overview of university attendance metrics and system health.
          </p>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat, idx) => (
            <Card
              key={idx}
              className={`border-0 ring-1 ${stat.border} shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-all`}
            >
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${stat.bg
                  .replace("bg-", "bg-")
                  .replace("50", "400")}`}
              />
              <CardContent className="p-5 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-500 truncate">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold font-display text-slate-800">
                    {isLoadingStats ? "-" : stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick User Directory */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <CardTitle className="text-lg">Quick User Search</CardTitle>
                  <CardDescription>Rapidly locate students or staff.</CardDescription>
                </div>
                <Link href="/admin/users">
                  <Button
                    variant="ghost"
                    className="text-babcock-blue hover:text-babcock-blue/80 hover:bg-blue-50 gap-2 text-sm"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <SearchBar
                  placeholder="Search by name, matric no, or staff ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />

                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <DataTable
                    data={filteredUsers}
                    columns={userColumns}
                    emptyTitle="No users found matching that query."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log - real data */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-sm h-full flex flex-col">
              <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ActivitySquare className="w-5 h-5 text-babcock-blue" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex-1 overflow-y-auto max-h-[400px]">
                {isLoadingLogs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-babcock-blue" />
                  </div>
                ) : !auditLogs || auditLogs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No recent activity to display.
                  </div>
                ) : (
                  <ol className="relative border-l border-slate-200 ml-3 space-y-6">
                    {auditLogs.map((log: any) => (
                      <li key={log._id} className="mb-6 ml-6 last:mb-0">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-50 rounded-full -left-3 ring-4 ring-white">
                          <div className="w-2 h-2 rounded-full bg-babcock-blue" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-800">
                            {log.performedBy?.fullName || "System"}
                          </h4>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {log.action}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}