/**
 * @module app/student/dashboard
 * @description The primary Student Dashboard interface. Integrates native browser geolocation capturing with One-Time Code (OTC) inputs to transmit structured presence payloads to the verification engine.
 */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Clock, ShieldCheck, MapPin, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { OTPInput } from "@/components/ui/OTPInput";
import { VerificationProgress, VerificationState } from "@/components/ui/VerificationProgress";
import { DataTable } from "@/components/ui/DataTable";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { getActiveSession, markAttendance as markAttendanceService } from '@/services/studentService';
import { getGeolocationErrorMessage } from "@/lib/geo";
import { Loader2, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDashboard() {
  const { data, isLoading, error, refetch } = useStudentDashboard();

  const [otc, setOtc] = useState("");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [gpsSamples, setGpsSamples] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSession, setActiveSession] = useState<any>(null);

  const resetVerification = () => {
    setVerificationState("idle");
    setGpsSamples(0);
    setErrorMessage("");
  };

  useEffect(() => {
    let mounted = true;
    let timer: any = null;

    const poll = async () => {
      try {
        const res = await getActiveSession();
        if (!mounted) return;
        if (res && res.active) {
          setActiveSession(res);
        } else {
          setActiveSession(null);
        }
      } catch (err) {

      } finally {
        timer = setTimeout(poll, 5000);
      }
    };

    poll();

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const simulateGeolocation = async () => {
    resetVerification();
    setVerificationState("requesting");

    if (!navigator.geolocation) {
      setVerificationState("error");
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setVerificationState("averaging");
      let currentSample = 0;

      const sampleInterval = setInterval(async () => {
        currentSample += 1;
        setGpsSamples(currentSample);

        if (currentSample >= 5) {
          clearInterval(sampleInterval);
          setVerificationState("verifying");

          try {
            const res = await markAttendanceService(otc, position.coords.latitude, position.coords.longitude);

            setVerificationState("success");

            const status = res.status || (res.data && res.data.status) || 'success';
            const message = res.message || (res.data && res.data.message) || '';

            if (status === 'pending') {
              toast.warning(message || "Attendance marked as pending. Awaiting lecturer approval.", {
                duration: 8000,
              });
              setTimeout(resetVerification, 4000);
            } else {
              toast.success(message || "Successfully marked present!");
              setTimeout(resetVerification, 3000);
            }
          } catch (error: any) {
            setVerificationState("error");
            setErrorMessage(error.response?.data?.message || "Failed to verify location or session has expired.");
            toast.error(error.response?.data?.message || "Verification failed");
          }
        }
      }, 1000);

    } catch (error: any) {
      const errMsg = getGeolocationErrorMessage(error);
      setVerificationState("error");
      setErrorMessage(errMsg);
      toast.error(errMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otc.length === 6) {
      simulateGeolocation();
    }
  };

  const historyColumns = [
    { header: "Course", accessorKey: "course", className: "font-medium" },
    { header: "Date", accessorKey: "date" },
    { header: "Time", accessorKey: "time" },
    {
      header: "Status",
      cell: (item: any) => (
        <Badge
          variant={item.status === "Present" ? "success" : item.status === "Late" ? "warning" : "danger"}
          className="uppercase tracking-wider text-[10px]"
        >
          {item.status}
        </Badge>
      )
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-[400px] w-full" />
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout role="student">
        <div className="w-full bg-red-50 p-6 rounded-lg border border-red-100 flex flex-col items-center">
          <h3 className="text-red-800 font-bold mb-2">Failed to load dashboard data</h3>
          <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4 bg-white">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">

        {/* Attendance Warning Alert */}
        {data.stats.attendancePercentage < 75 && (
          <Alert
            variant="error"
            title="Attendance Warning"
            description={`Your aggregate attendance is currently at ${data.stats.attendancePercentage}%. You are below the 75% threshold required to write exams.`}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Mark Attendance Card */}
          <div className="lg:col-span-2">
            <Card className="h-full relative overflow-hidden border-0 shadow-md ring-1 ring-slate-200">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-babcock-blue" />
              </div>

              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <div>
                    <CardTitle className="text-2xl h-8">Mark Attendance</CardTitle>
                    <CardDescription className="text-base h-6">Enter the 6-digit alphanumeric code from your lecturer</CardDescription>
                  </div>
                  <Badge variant="success" className="w-fit h-fit">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> GPS Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="mt-2 max-w-sm">
                  <div className="mb-6">
                    <OTPInput
                      length={6}
                      value={otc}
                      onChange={setOtc}
                      disabled={verificationState !== "idle" && verificationState !== "error"}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="babcock"
                    className="w-full text-lg shadow-xl shadow-babcock-blue/20"
                    disabled={
                      verificationState === "requesting" ||
                      verificationState === "averaging" ||
                      verificationState === "verifying" ||
                      otc.length !== 6
                    }
                    isLoading={
                      verificationState === "requesting" ||
                      verificationState === "averaging" ||
                      verificationState === "verifying"
                    }
                  >
                    {!["requesting", "averaging", "verifying"].includes(verificationState) && (
                      <MapPin className="w-5 h-5 mr-2" />
                    )}
                    Verify Location & Submit
                  </Button>

                  <VerificationProgress
                    state={verificationState}
                    samples={gpsSamples}
                    errorMessage={errorMessage}
                  />
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stats & Schedule */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Quick Stats */}
            <div className="bg-babcock-blue rounded-lg border border-blue-900 shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold font-display mb-1 text-slate-100">Quick Stats</h3>
                <p className="text-blue-200 text-sm mb-6">Current Semester overview</p>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Overall Attendance</p>
                    <p className="text-3xl font-bold text-white mt-1 select-all">
                      {data.stats.attendancePercentage}%
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Classes Attended</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {data.stats.attendedClasses}{" "}
                      <span className="text-lg text-blue-200 font-normal">/ {data.stats.totalClasses}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recent History Table */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-babcock-gold" />
              Recent History
            </CardTitle>
            <Link href="/student/history">
              <Button variant="ghost" size="sm" className="gap-1 text-babcock-blue hover:text-babcock-blue/80">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={data.recentHistory || []}
              columns={historyColumns}
              className="border-0 shadow-none rounded-none border-t border-slate-100"
              emptyTitle="No attendance records yet."
            />
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}