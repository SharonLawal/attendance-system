"use client";

import { 
  ShieldCheck, LayoutDashboard, Users, Clock, FileBarChart, Settings, 
  LogOut, Search, UserPlus, Bell, TrendingUp, TrendingDown, MoreHorizontal, Filter
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051025] flex flex-col shrink-0 text-white">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-tight tracking-tight">VeriPoint</h1>
            <p className="text-slate-400 text-xs font-medium">University Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/10 text-blue-500 transition-colors" href="#">
            <LayoutDashboard size={20} />
            <span className="text-sm font-semibold">Dashboard</span>
          </a>
          {[
            { icon: Users, label: "Users" },
            { icon: Clock, label: "Sessions" },
            { icon: FileBarChart, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <a key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" href="#">
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-800/50">
            <div className="size-8 rounded-full bg-slate-600 flex items-center justify-center text-xs">AT</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Dr. Alan Turing</p>
              <p className="text-slate-500 text-xs truncate">Super Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-500" placeholder="Search students, faculty, or IDs..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-shadow shadow-sm">
              <UserPlus size={18} />
              <span>Add New User</span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="size-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Students", value: "12,450", change: "+2.5%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Sessions", value: "42", change: "-1.2%", trend: "down", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Attendance Rate", value: "94.2%", change: "+0.5%", trend: "up", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Flagged Absences", value: "18", change: "+4%", trend: "up", icon: FileBarChart, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</h3>
                  <div className={`flex items-center gap-1 mt-2 ${stat.trend === "up" ? "text-emerald-600" : "text-rose-500"} text-xs font-bold`}>
                    {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{stat.change}</span>
                    <span className="text-slate-400 font-normal ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-lg`}>
                  <stat.icon size={20} />
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Filters:</span>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium bg-white hover:bg-slate-50">
                  <Filter size={14} />
                  All Roles
                </button>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline">Clear all filters</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["Name", "Matric No", "Role", "Status", "Actions"].map((head) => (
                      <th key={head} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">John Doe</div>
                          <div className="text-xs text-slate-500">j.doe@university.edu</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">U2021001</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Student</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                  {/* Add more rows similarly */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}