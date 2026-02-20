"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Play, Square, Clock, Map as MapIcon, RefreshCcw, CheckCircle2, ChevronRight } from "lucide-react";

export default function LecturerDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [otc, setOtc] = useState("A9F2B1");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && sessionActive) {
      setSessionActive(false);
    }
    return () => clearInterval(timer);
  }, [sessionActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleSession = () => {
    if (!sessionActive) {
      // Start session with alphanumeric code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setOtc(code);
      setTimeLeft(5 * 60);
      setSessionActive(true);
    } else {
      // End session early
      setSessionActive(false);
    }
  };

  return (
    <DashboardLayout role="lecturer">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Session Control Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Session Control Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h2 className="text-xl font-bold font-display text-slate-800 mb-2">Active Session</h2>
            <p className="text-sm text-slate-500 mb-6">GEDS 400 - Software Engineering</p>

            <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 transition-colors duration-500 mb-6 ${sessionActive ? 'border-babcock-gold bg-amber-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="text-4xl font-black font-display text-babcock-blue tracking-widest mb-2">
                {sessionActive ? otc : "----"}
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium font-mono text-xl">
                <Clock className="w-5 h-5 text-babcock-blue" />
                {sessionActive ? formatTime(timeLeft) : "00:00"}
              </div>
            </div>

            <button
              onClick={handleToggleSession}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${sessionActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-babcock-blue text-white hover:bg-opacity-90 shadow-lg shadow-babcock-blue/30'
                }`}
            >
              {sessionActive ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  End Session
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start Session
                </>
              )}
            </button>

            {sessionActive && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-xs text-slate-400">Students marked: <span className="font-bold text-slate-700">12/45</span></p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(12 / 45) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {/* LMS Sync Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-babcock-blue" />
              <h3 className="font-bold text-slate-800 font-display">Hybrid Learning Sync</h3>
            </div>

            <div className="p-5 space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-babcock-blue hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 shadow-sm border border-green-100 p-2 flex items-center justify-center text-green-700 font-bold font-display">
                    GC
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Google Classroom</p>
                    <p className="text-xs text-slate-500">Last synced: 2h ago</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-babcock-blue" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 shadow-sm border border-indigo-100 p-2 flex items-center justify-center text-indigo-700 font-bold font-display">
                    MS
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Microsoft Teams</p>
                    <p className="text-xs text-slate-500">Not synced yet</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-babcock-gold" />
                  Classroom Geofence
                </h3>
                <p className="text-sm text-slate-500 mt-1">Draw a polygon around the classroom for strictly physical verification.</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                Edit Polygon
              </button>
            </div>

            <div className="flex-1 bg-slate-100 p-4 relative min-h-[400px]">
              {/* Fake Map UI */}
              <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden rounded-xl border border-slate-300">
                {/* Simulated Street Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Simulated Map Markers and Polygon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-babcock-blue/20 border-2 border-babcock-blue border-dashed transform rotate-[-10deg] flex flex-col items-center justify-center shadow-lg">
                  <div className="w-full h-full absolute top-0 left-0 bg-babcock-blue opacity-10"></div>
                  <MapIcon className="w-8 h-8 text-babcock-blue mb-2 z-10" />
                  <span className="text-babcock-blue font-bold px-3 py-1 bg-white/80 rounded-full text-sm z-10">Babcock Business School</span>
                </div>

                {/* Map Controls */}
                <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-babcock-blue">+</button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-babcock-blue">-</button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Geofence Active</p>
                <p className="text-xs text-slate-500">Students must be within this boundary to mark present.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}