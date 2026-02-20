"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Clock, ShieldCheck, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { OTPInput } from "@/components/ui/OTPInput";
import { VerificationProgress, VerificationState } from "@/components/ui/VerificationProgress";
import { DataTable } from "@/components/ui/DataTable";

import {
  MOCK_ATTENDANCE_PERCENTAGE,
  COURSE_CODE,
  RECENT_HISTORY
} from "@/lib/demodata";

export default function StudentDashboard() {
  const [otc, setOtc] = useState("");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [gpsSamples, setGpsSamples] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const resetVerification = () => {
    setVerificationState("idle");
    setGpsSamples(0);
    setErrorMessage("");
  };

  const simulateGeolocation = () => {
    resetVerification();

    // Step 1: Requesting Permission
    setVerificationState("requesting");

    // Simulate probability of user denying permission (10% chance)
    const permissionDenied = Math.random() < 0.1;

    setTimeout(() => {
      if (permissionDenied) {
        setVerificationState("error");
        setErrorMessage("Location permission denied. Please enable GPS access in your browser settings to mark attendance.");
        toast.error("Location permission denied");
        return;
      }

      // Step 2: Averaging Signal (takes 5 seconds total)
      setVerificationState("averaging");
      let currentSample = 0;

      const sampleInterval = setInterval(() => {
        currentSample += 1;
        setGpsSamples(currentSample);

        if (currentSample >= 5) {
          clearInterval(sampleInterval);

          // Step 3: Verifying Polygon Bounds
          setVerificationState("verifying");

          setTimeout(() => {
            // Simulate outcome
            const isSuccess = Math.random() > 0.05; // 95% success rate

            if (isSuccess) {
              setVerificationState("success");
              toast.success(`Successfully marked present for ${COURSE_CODE}`);
              setTimeout(resetVerification, 3000);
            } else {
              setVerificationState("error");
              setErrorMessage("You appear to be outside the classroom boundary. Please move closer and try again.");
              toast.error("Verification failed");
            }
          }, 1500);
        }
      }, 1000);

    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otc.length === 6) {
      simulateGeolocation();
    }
  };

  const historyColumns = [
    { header: "Course", accessorKey: "course" as keyof typeof RECENT_HISTORY[0], className: "font-medium" },
    { header: "Date", accessorKey: "date" as keyof typeof RECENT_HISTORY[0] },
    { header: "Time", accessorKey: "time" as keyof typeof RECENT_HISTORY[0] },
    {
      header: "Status",
      cell: (item: typeof RECENT_HISTORY[0]) => (
        <Badge
          variant={item.status === "Present" ? "success" : item.status === "Late" ? "warning" : "danger"}
          className="uppercase tracking-wider text-[10px]"
        >
          {item.status}
        </Badge>
      )
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">

        {/* Dynamic Warning Alert */}
        {MOCK_ATTENDANCE_PERCENTAGE < 75 && (
          <Alert
            variant="error"
            title="Attendance Warning"
            description={`Your attendance for ${COURSE_CODE} is currently at ${MOCK_ATTENDANCE_PERCENTAGE}%. You are below the 75% threshold required to write exams.`}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Hero Card for Attendance */}
          <div className="lg:col-span-2">
            <Card className="h-full relative overflow-hidden border-0 shadow-md ring-1 ring-slate-200">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-babcock-blue" />
              </div>

              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <div>
                    <CardTitle className="text-2xl h-8">Mark Attendance</CardTitle>
                    <CardDescription className="text-base h-6">Enter the 6-digit alphanumeic code provided</CardDescription>
                  </div>
                  <Badge variant="success" className="w-fit h-fit"><MapPin className="w-3.5 h-3.5 mr-1" /> GPS Active</Badge>
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
                    disabled={verificationState === "requesting" || verificationState === "averaging" || verificationState === "verifying" || otc.length !== 6}
                    isLoading={verificationState === "requesting" || verificationState === "averaging" || verificationState === "verifying"}
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

            <div className="bg-babcock-blue rounded-2xl border border-blue-900 shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold font-display mb-1 text-slate-100">Quick Stats</h3>
                <p className="text-blue-200 text-sm mb-6">Current Semester overview</p>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Overall Attendance</p>
                    <p className="text-3xl font-bold text-white mt-1 select-all">{MOCK_ATTENDANCE_PERCENTAGE}%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Classes Attended</p>
                    <p className="text-3xl font-bold text-white mt-1">42 <span className="text-lg text-blue-200 font-normal">/ 50</span></p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="flex-1 border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader className="py-4 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-babcock-blue" />
                  Today&apos;s Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">GEDS 400</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Software Engineering</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="neutral">09:00 AM</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> BBS Room 2</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group cursor-pointer opacity-60">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">SENG 402</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Mobile Computing</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="neutral">01:00 PM</Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> SAT Hub</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Recent History Table */}
        <Card className="border-0 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-babcock-gold" />
              Recent History
            </CardTitle>
            <Button variant="ghost" size="sm" className="hidden sm:flex">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={RECENT_HISTORY}
              columns={historyColumns}
              className="border-0 shadow-none rounded-none border-t border-slate-100"
            />
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}