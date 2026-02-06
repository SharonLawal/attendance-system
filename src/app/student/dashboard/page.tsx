"use client";

import { useState } from "react";
import { MapPin, ArrowRight, CheckCircle, AlertTriangle, RefreshCw, Clock } from "lucide-react";

export default function StudentDashboard() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock function to handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input logic would go here
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#003366]">Welcome back, Sharon 👋</h1>
        <p className="text-slate-500 mt-1">Here is what is happening with your classes today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Average Attendance</p>
              <h3 className="text-3xl font-bold text-[#003366] mt-2">85%</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-green-600 font-medium">+2.5%</span> from last semester
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Classes Present</p>
              <h3 className="text-3xl font-bold text-[#003366] mt-2">42</h3>
            </div>
            <div className="p-2 bg-blue-50 text-[#003366] rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Total sessions tracked: 48</p>
        </div>

        {/* Warning Card (Requirement 4.5) */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <AlertTriangle size={100} className="text-red-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
              <AlertTriangle size={18} />
              <span>Attendance Warning</span>
            </div>
            <p className="text-sm text-red-800 font-medium">GEDS 400 - Entrepreneurship</p>
            <p className="text-2xl font-bold text-red-900 mt-1">68%</p>
            <p className="text-xs text-red-600 mt-2">You are below the 75% threshold required for exams.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Action: Mark Attendance (Chapter 3.4.1.1) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#003366] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Mark Attendance</h3>
                <p className="text-blue-200 text-sm">Enter the One-Time Code provided by your lecturer.</p>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
                <div className="size-2 bg-green-400 rounded-full animate-pulse"></div>
                GPS Active
              </div>
            </div>
            
            <div className="p-8 flex flex-col items-center gap-8">
              <div className="w-full max-w-sm">
                <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                  Session: <span className="font-bold text-[#003366]">SENG 402 - Software Quality Assurance</span>
                </label>
                
                {/* OTP Inputs */}
                <div className="flex justify-center gap-4 mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-14 h-16 text-center text-3xl font-bold border-2 border-slate-200 rounded-xl focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 outline-none transition-all text-[#003366]"
                    />
                  ))}
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#FBBF24] hover:bg-yellow-500 text-[#003366] font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="animate-spin" />
                  ) : (
                    <>
                      <span>Verify Location & Submit</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-lg">
                <MapPin size={14} />
                <span>Current Location: Engineering Block (Accuracy: 4m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Schedule */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-[#003366] mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {[
              { time: "09:00 AM", code: "SENG 402", title: "Software QA", loc: "C001", status: "Active", color: "text-green-600 bg-green-50 border-green-100" },
              { time: "11:00 AM", code: "GEDS 002", title: "Chapel Seminar", loc: "Babcock Stadium", status: "Upcoming", color: "text-slate-600 bg-slate-50 border-slate-100" },
              { time: "02:00 PM", code: "SENG 490", title: "Project Defense", loc: "SAT Hall", status: "Upcoming", color: "text-slate-600 bg-slate-50 border-slate-100" },
            ].map((cls, i) => (
              <div key={i} className={`p-4 rounded-xl border ${cls.color} flex flex-col gap-1`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold opacity-70">{cls.time}</span>
                  {cls.status === "Active" && <span className="text-[10px] font-bold uppercase bg-white px-2 py-0.5 rounded text-green-700 shadow-sm">Live</span>}
                </div>
                <h4 className="font-bold">{cls.code}</h4>
                <p className="text-sm opacity-80">{cls.title}</p>
                <div className="flex items-center gap-1 text-xs opacity-60 mt-2">
                  <MapPin size={12} />
                  {cls.loc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}