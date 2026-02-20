"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Play, Square, Clock, Map as MapIcon, RefreshCcw, CheckCircle2, ChevronRight, Pause, Plus, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { CLASSROOM_LOCATIONS, LECTURER_COURSES } from "@/lib/demodata";

export default function LecturerDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otc, setOtc] = useState("");
  const [checkedInCount, setCheckedInCount] = useState(0);
  const totalStudentsInClass = 45; // Hardcoded mock for GEDS 400

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sessionDuration, setSessionDuration] = useState("5");

  // Timer & Polling Simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

      // Simulate WebSocket polling random increment
      pollInterval = setInterval(() => {
        setCheckedInCount((prev) => {
          if (prev >= totalStudentsInClass) return prev;
          // Random chance to increment
          return Math.random() > 0.4 ? prev + 1 : prev;
        });
      }, 3000);

    } else if (timeLeft === 0 && sessionActive) {
      handleEndSession();
    }

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [sessionActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCreateSession = () => {
    if (!selectedCourse || !selectedLocation || parseInt(sessionDuration) < 5) return;

    // Generate strict 6-char alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setOtc(code);
    setTimeLeft(parseInt(sessionDuration) * 60);
    setCheckedInCount(0);
    setSessionActive(true);
    setIsCreateModalOpen(false);
    toast.success("Attendance Session Started successfully!");
  };

  const handleEndSession = () => {
    setSessionActive(false);
    toast.info("Active session has been closed.");
  };

  const handleExtendSession = () => {
    setTimeLeft(prev => prev + 300); // add 5 minutes
    toast.success("Session extended by 5 minutes.");
  };


  return (
    <DashboardLayout role="lecturer">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Lecturer Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage physical and hybrid attendance sessions.</p>
        </div>
        {!sessionActive && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Session
          </Button>
        )}
      </div>

      {!sessionActive ? (
        <div className="w-full">
          <EmptyState
            title="No Active Session"
            description="You do not have any classes currently running. Start a new session to begin taking attendance."
            icon="calendar"
            action={
              <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                Start a Session Now
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Session Control Panel */}
          <Card className="lg:col-span-1 border-babcock-gold/30 ring-2 ring-babcock-gold/20 shadow-lg shadow-babcock-gold/5 flex flex-col relative overflow-hidden">

            {/* Pulse ring background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-babcock-gold/10 rounded-full animate-ping opacity-20 pointer-events-none" />

            <CardHeader className="text-center pb-2 relative z-10">
              <Badge variant="warning" className="mx-auto mb-3 absolute -top-3 scale-90 tracking-widest uppercase animate-pulse">Live Session</Badge>
              <CardTitle className="text-xl">{LECTURER_COURSES.find(c => c.id === selectedCourse)?.code || "GEDS 400"}</CardTitle>
              <CardDescription>Accepting check-ins now</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">

              <div className="w-48 h-48 rounded-full border-8 border-babcock-gold bg-amber-50 flex flex-col items-center justify-center mb-8 shadow-inner">
                <div className="text-4xl font-black font-display text-slate-800 tracking-widest mb-1">
                  {otc}
                </div>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Polling Mock Stat */}
              <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-semibold text-slate-600">Students Verified:</p>
                  <p className="text-lg font-bold text-slate-900">{checkedInCount} <span className="text-sm font-medium text-slate-400">/ {totalStudentsInClass}</span></p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((checkedInCount / totalStudentsInClass) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full gap-2 border-slate-300 text-slate-600" onClick={handleExtendSession}>
                  <Clock className="w-4 h-4" /> +5 Mins
                </Button>
                <Button variant="danger" className="w-full gap-2" onClick={handleEndSession}>
                  <Square className="w-4 h-4 fill-current" /> End Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Column */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader className="flex flex-row justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-babcock-blue" />
                  Classroom Geofence
                </CardTitle>
                <CardDescription>Location restriction boundary.</CardDescription>
              </div>
              <Badge variant="success">Boundary Enforced</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[350px] bg-[#e5e3df] relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Targeted Polygon visually derived from the selected location */}
                <div className="w-72 h-56 bg-babcock-blue/20 border-2 border-babcock-blue border-dashed transform rotate-[-5deg] flex flex-col items-center justify-center shadow-lg relative z-10 backdrop-blur-[2px] transition-all">
                  <MapIcon className="w-8 h-8 text-babcock-blue mb-2" />
                  <span className="text-babcock-blue font-bold px-3 py-1 bg-white/90 rounded-full text-sm shadow-sm">
                    {CLASSROOM_LOCATIONS.find(l => l.id === selectedLocation)?.name || "Babcock Business School"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-3 shadow-sm border border-slate-200 flex items-start gap-3 flex-row z-20">
                  <ShieldAlert className="w-5 h-5 text-babcock-blue mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 font-medium">Students must have physical GPS coordinates averaging within this highlighted polygon zone to fulfill the verification mandate.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Start Attendance Session"
        description="Configure the class details to broadcast an OTC and activate the GPS boundary."
        maxWidth="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateSession}
              disabled={!selectedCourse || !selectedLocation || parseInt(sessionDuration) < 5}
              className="gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Generate OTC
            </Button>
          </>
        }
      >
        <div className="space-y-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Course</label>
            <Select
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="Select course to take attendance for..."
              options={LECTURER_COURSES.map(c => ({ label: `${c.code} - ${c.title}`, value: c.id }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Classroom Location</label>
            <Select
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Select physical venue..."
              options={CLASSROOM_LOCATIONS.map(l => ({ label: l.name, value: l.id }))}
            />

            {/* Dynamic Mini-map UX Enhancement */}
            {selectedLocation && (
              <div className="mt-3 w-full h-32 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-emerald-500/20 border border-emerald-500 border-dashed transform flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
              <span>Duration (Minutes)</span>
              <span className="text-xs text-slate-400 font-normal">Minimum 5 mins</span>
            </label>
            <input
              type="number"
              min="5"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
