"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Calendar, BarChart3, User, LogOut, MapPin 
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/student/courses" },
  { icon: Calendar, label: "Schedule", href: "/student/schedule" },
  { icon: BarChart3, label: "Attendance History", href: "/student/history" },
  { icon: User, label: "Profile", href: "/student/profile" },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#003366] text-white flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="size-8 bg-[#FBBF24] rounded-lg flex items-center justify-center text-[#003366]">
          <MapPin size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">VeriPoint</h1>
          <p className="text-xs text-slate-300">Student Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? "bg-[#FBBF24] text-[#003366] font-semibold shadow-md" 
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-[#003366]" : "text-slate-400 group-hover:text-white"} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 bg-[#002244]">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-[#FBBF24]">
            SL
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">Sharon Lawal</p>
            <p className="text-xs text-slate-400 truncate">22/0234</p>
          </div>
          <button className="text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}