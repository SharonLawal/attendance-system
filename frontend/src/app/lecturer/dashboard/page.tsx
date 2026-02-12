"use client";

import { 
  LayoutDashboard, BookOpen, BarChart3, Users, Settings, 
  MapPin, Bell, HelpCircle, PlusCircle, Cloud, Upload 
} from "lucide-react";

export default function LecturerDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051025] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-yellow-500 rounded flex items-center justify-center text-[#051025]">
            <MapPin size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">VeriPoint</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-yellow-500 text-[#051025] font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          {[
            { icon: BookOpen, label: "Classes" },
            { icon: BarChart3, label: "Reports" },
            { icon: Users, label: "Students" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="size-10 rounded-full bg-slate-700 border-2 border-yellow-500/50 flex items-center justify-center text-xs font-bold">
              JV
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Julian Vance</p>
              <p className="text-xs text-slate-400">Senior Lecturer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm font-medium hover:text-blue-900 cursor-pointer">Home</span>
            <span className="text-xs">/</span>
            <span className="text-sm font-semibold text-slate-900 underline decoration-yellow-500 decoration-2 underline-offset-4">Lecturer Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-[#051025] font-bold px-4 py-2 rounded-lg transition-all shadow-sm">
              <PlusCircle size={18} />
              <span>Create Session</span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Active Session Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Now
                </span>
              </div>
              <div>
                <h2 className="text-slate-500 font-medium uppercase text-xs tracking-widest mb-1">Active Session</h2>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">CS101: Introduction to Data Structures</h3>
                <div className="flex items-center gap-12 mb-8">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">OTC Code</p>
                    <p className="text-5xl font-black text-[#051025] tracking-tighter">8492</p>
                  </div>
                  <div className="h-16 w-px bg-slate-100"></div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">Checked In</p>
                    <p className="text-4xl font-bold text-slate-900">124 <span className="text-lg font-normal text-slate-400">/ 150</span></p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xl font-bold text-[#051025]">14</p>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Min</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-12 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xl font-bold text-[#051025]">52</p>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Sec</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                    Pause
                  </button>
                  <button className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
                    End Session
                  </button>
                </div>
              </div>
            </div>

            {/* Geofence Map Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-yellow-500" size={24} />
                  <h3 className="font-bold text-slate-900">Active Geofence Zone</h3>
                </div>
                <span className="text-xs font-medium text-slate-400">Lecture Hall A (Zone 4)</span>
              </div>
              <div className="relative flex-1 min-h-[240px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  [Interactive Map Placeholder]
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-900">Active Range: 50m</p>
                  <p className="text-[10px] text-slate-500">Polygon perimeter verification enabled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Sync & Integrations</h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-yellow-500 transition-all bg-white text-slate-700 font-medium group">
                <Cloud size={20} className="text-slate-400 group-hover:text-yellow-500" />
                <span>Sync Google Classroom</span>
              </button>
              <button className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-yellow-500 transition-all bg-white text-slate-700 font-medium group">
                <Users size={20} className="text-slate-400 group-hover:text-yellow-500" />
                <span>Sync Microsoft Teams</span>
              </button>
              <button className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 hover:border-yellow-500 transition-all bg-white text-slate-700 font-medium group">
                <Upload size={20} className="text-slate-400 group-hover:text-yellow-500" />
                <span>Export CSV Data</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}