"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Activity, AlertTriangle, ShieldAlert, Edit2, Trash2, Search, Filter, MoreVertical, CheckCircle2 } from "lucide-react";

// Mock Data
const STATS = [
  { title: "Total Students", value: "8,432", icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  { title: "Active Sessions", value: "45", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { title: "System Health", value: "99.9%", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
  { title: "Flagged Absences", value: "112", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
];

const USERS_DATA = [
  { id: 1, name: "John Doe", identifier: "21/1234", role: "Student", status: "Active" },
  { id: 2, name: "Dr. Jane Smith", identifier: "S-4001", role: "Lecturer", status: "Active" },
  { id: 3, name: "Michael Johnson", identifier: "19/5432", role: "Student", status: "Suspended" },
  { id: 4, name: "Sarah Williams", identifier: "22/8876", role: "Student", status: "Active" },
  { id: 5, name: "Prof. Alan Turing", identifier: "S-1004", role: "Admin", status: "Active" },
  { id: 6, name: "Emily Brown", identifier: "20/4455", role: "Student", status: "Inactive" },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = USERS_DATA.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, index) => (
            <div key={index} className={`bg-white rounded-2xl border ${stat.border} shadow-sm p-6 flex items-center gap-4 transition-transform hover:-translate-y-1`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold font-display text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Directory Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800">User Directory</h3>
              <p className="text-sm text-slate-500">Manage students, lecturers, and system administrators.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent transition-all"
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-babcock-blue transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="font-semibold px-6 py-4">Name</th>
                  <th className="font-semibold px-6 py-4">Matric No / ID</th>
                  <th className="font-semibold px-6 py-4">Role</th>
                  <th className="font-semibold px-6 py-4">Status</th>
                  <th className="font-semibold px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">{user.identifier}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${user.role === 'Student' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                            user.role === 'Lecturer' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-babcock-blue/10 text-babcock-blue border-babcock-blue/20'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'text-emerald-700 bg-emerald-50' :
                            user.status === 'Suspended' ? 'text-rose-700 bg-rose-50' :
                              'text-slate-700 bg-slate-100'
                          }`}>
                          {user.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          {user.status === 'Suspended' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                          {user.status === 'Inactive' && <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-babcock-blue hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="More Options">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p>No users found matching "{searchTerm}"</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
            <span>Showing {filteredUsers.length} users</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 border border-slate-200 rounded bg-white text-babcock-blue font-medium shadow-sm transition-colors">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}