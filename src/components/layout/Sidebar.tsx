"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "STUDENT" | "LECTURER" | "ADMIN";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  // Navigation items based on role (SOLID: Interface Segregation)
  const navItems = {
    STUDENT: [
      { name: "Dashboard", href: "/student/dashboard", icon: Icons.Dashboard },
      { name: "Attendance", href: "/student/attendance", icon: Icons.Location },
      { name: "History", href: "/student/history", icon: Icons.Time },
    ],
    LECTURER: [
      { name: "Dashboard", href: "/lecturer/dashboard", icon: Icons.Dashboard },
      { name: "Create Session", href: "/lecturer/create", icon: Icons.Success },
      { name: "Reports", href: "/lecturer/reports", icon: Icons.Dashboard },
    ],
    ADMIN: [
      { name: "User Management", href: "/admin/users", icon: Icons.User },
      { name: "System Logs", href: "/admin/logs", icon: Icons.Dashboard },
    ],
  };

  const currentNav = navItems[role];

  return (
    <aside className="w-64 h-screen bg-primary border-r border-primary-dark text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight">BU Attendance</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {currentNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary-dark text-secondary" 
                  : "hover:bg-primary-dark/50 text-slate-200"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-dark">
        <button className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white transition-colors">
          <Icons.Logout size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}