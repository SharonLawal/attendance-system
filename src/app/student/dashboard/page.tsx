"use client";

import { 
  LayoutDashboard, BookOpen, Calendar, BarChart3, User, LogOut, 
  Bell, Settings, MapPin, CheckCircle, ArrowRight, Monitor 
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051025] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-yellow-500 rounded-lg flex items-center justify-center text-[#051025]">
            <MapPin size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">VeriPoint</h1>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-yellow-500/20 text-yellow-500" href="#">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          {/* Other Nav Items */}
          {[
            { icon: BookOpen, label: "My Courses" },
            { icon: Calendar, label: "Schedule" },
            { icon: BarChart3, label: "Attendance Stats" },
            { icon: User, label: "Profile" },
          ].map((item) => (
            <a key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors" href="#">
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="size-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">AJ</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Alex Johnson</p>
              <p className="text-xs text-slate-400 truncate">ID: 2024-8832</p>
            </div>
            <button className="text-slate-400 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Student Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Settings size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Main Campus - Hall A</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Headline */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Mark Your Attendance</h2>
            <p className="text-slate-500 text-base">CS402: Distributed Systems is currently in session. Please verify your location and enter your instructor's code.</p>
          </div>

          {/* Attendance Card */}
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100">
                  <CheckCircle size={16} />
                  <span className="text-xs font-bold uppercase tracking-wide">Location Verified</span>
                </div>
                
                <div className="text-center space-y-1">
                  <p className="text-slate-900 font-bold text-xl uppercase tracking-widest">Enter 4-Digit OTC</p>
                  <p className="text-slate-400 text-sm">One-Time Code from Instructor</p>
                </div>

                {/* Input Fields */}
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <input 
                      key={i} 
                      className="flex h-16 w-14 text-center text-2xl font-bold border-0 border-b-2 border-slate-200 focus:border-yellow-500 focus:ring-0 text-slate-800 bg-transparent" 
                      maxLength={1} 
                      placeholder="•" 
                      type="text"
                    />
                  ))}
                </div>

                <button className="w-full bg-[#051025] hover:bg-[#0a1e45] text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
                  <span>Verify & Submit</span>
                  <ArrowRight size={20} className="text-yellow-400" />
                </button>
                
                <p className="text-slate-400 text-xs text-center leading-relaxed">
                  By submitting, you agree to our Geofencing Privacy Policy. <br/> Attendance window closes in 04:52.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-4 px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <Monitor size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Current Session</p>
                  <p className="text-sm font-bold text-slate-800">CS402 - Distributed Systems</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Instructor</p>
                <p className="text-sm font-bold text-slate-800">Dr. Sarah Vance</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
              <button className="text-yellow-600 text-sm font-semibold hover:underline">View All History</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Course</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">MA201: Calculus II</p>
                      <p className="text-xs text-slate-400 font-medium">Section A</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 24, 2023 • 09:00 AM</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Engineering Block, R102</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Present</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">CS402: Distributed Systems</p>
                      <p className="text-xs text-slate-400 font-medium">Section B</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 23, 2023 • 11:30 AM</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Main Campus - Hall A</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Present</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}