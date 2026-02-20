"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MapPin, Navigation, AlertCircle, CheckCircle2, XCircle, Clock, ShieldCheck } from "lucide-react";

// Mock Data
const MOCK_ATTENDANCE_PERCENTAGE = 68;
const COURSE_CODE = "GEDS 400";
const RECENT_HISTORY = [
  { id: 1, course: "GEDS 400", date: "Oct 24, 2023", time: "10:15 AM", status: "Present" },
  { id: 2, course: "COSC 412", date: "Oct 23, 2023", time: "08:05 AM", status: "Late" },
  { id: 3, course: "CPEN 414", date: "Oct 22, 2023", time: "09:00 AM", status: "Present" },
  { id: 4, course: "GEDS 400", date: "Oct 17, 2023", time: "10:00 AM", status: "Absent" },
];

export default function StudentDashboard() {
  const [otc, setOtc] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [gpsSamples, setGpsSamples] = useState(0);

  // Mock taking multiple GPS samples
  useEffect(() => {
    if (isVerifying && gpsSamples < 5) {
      const timer = setTimeout(() => {
        setGpsSamples(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (isVerifying && gpsSamples === 5) {
      setTimeout(() => {
        setIsVerifying(false);
        setGpsSamples(0);
        alert("Attendance verified successfully!");
      }, 500);
    }
  }, [isVerifying, gpsSamples]);

  const handleOtcChange = (index: number, value: string) => {
    // Convert to uppercase for alphanumeric OTC
    const upperValue = value.toUpperCase();
    if (upperValue.length <= 1 && /^[A-Z0-9]*$/.test(upperValue)) {
      const newOtc = [...otc];
      newOtc[index] = upperValue;
      setOtc(newOtc);

      // Auto-focus next input
      if (upperValue && index < 5) {
        const nextInput = document.getElementById(`otc-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otc[index] && index > 0) {
      const prevInput = document.getElementById(`otc-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otc.every(digit => digit !== "")) {
      setIsVerifying(true);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">

        {/* Warning System */}
        {MOCK_ATTENDANCE_PERCENTAGE < 75 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold text-sm">Attendance Warning</h3>
              <p className="text-red-700 text-sm mt-1">
                Warning: {COURSE_CODE} attendance is at {MOCK_ATTENDANCE_PERCENTAGE}%. Minimum required is 75%.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Card for Attendance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden h-full">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="w-48 h-48 text-babcock-blue" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 font-display">Mark Attendance</h2>
                    <p className="text-slate-500 mt-1">Enter the 6-digit code provided by your lecturer</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                    <MapPin className="w-4 h-4" />
                    GPS Active
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 max-w-sm">
                  <div className="flex gap-4 mb-8">
                    {otc.map((digit, index) => (
                      <input
                        key={index}
                        id={`otc-${index}`}
                        type="text"
                        inputMode="text"
                        value={digit}
                        onChange={(e) => handleOtcChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isVerifying}
                        className="w-16 h-20 text-center text-4xl font-bold rounded-xl border-2 border-slate-200 bg-slate-50 text-babcock-blue focus:border-babcock-blue focus:ring-4 focus:ring-babcock-blue/20 transition-all outline-none disabled:opacity-50"
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || !otc.every(d => d)}
                    className="w-full bg-babcock-blue hover:bg-opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-babcock-blue/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <Navigation className="w-5 h-5 animate-spin" />
                        Verifying Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5 group-hover:block hidden transition-all" />
                        Verify Location & Submit
                      </>
                    )}
                  </button>

                  {/* Logic UI Indicator */}
                  <div className="mt-4 h-12">
                    {isVerifying ? (
                      <div className="flex flex-col items-center justify-center text-sm text-slate-500 animate-pulse">
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <div
                              key={dot}
                              className={`h-1.5 rounded-full transition-all duration-300 ${dot <= gpsSamples ? 'w-4 bg-babcock-gold' : 'w-1.5 bg-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span>Averaging GPS coordinates ({gpsSamples}/5 samples)...</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center">
                        Location will be verified against the classroom boundary boundary.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-babcock-blue rounded-2xl border border-blue-900 shadow-sm p-6 text-white h-full relative overflow-hidden">
              {/* Decorative Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold font-display mb-1 text-slate-100">Quick Stats</h3>
                <p className="text-blue-200 text-sm mb-6">Current Semester overview</p>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Overall Attendance</p>
                    <p className="text-3xl font-bold text-white mt-1 select-all">84%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-blue-100 text-sm">Classes Attended</p>
                    <p className="text-3xl font-bold text-white mt-1">42 <span className="text-lg text-blue-200 font-normal">/ 50</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-babcock-gold" />
              Recent History
            </h3>
            <button className="text-sm font-medium text-babcock-blue hover:text-blue-800 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="font-semibold px-6 py-4">Course</th>
                  <th className="font-semibold px-6 py-4">Date</th>
                  <th className="font-semibold px-6 py-4">Time</th>
                  <th className="font-semibold px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_HISTORY.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{record.course}</td>
                    <td className="px-6 py-4 text-slate-500">{record.date}</td>
                    <td className="px-6 py-4 text-slate-500">{record.time}</td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${record.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        record.status === "Late" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {record.status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                        {record.status === "Late" && <AlertCircle className="w-3 h-3" />}
                        {record.status === "Absent" && <XCircle className="w-3 h-3" />}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}