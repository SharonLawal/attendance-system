"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    Menu,
    X,
    LayoutDashboard,
    History,
    Settings,
    LogOut,
    Users,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming a standard utility

type RoleType = "student" | "lecturer" | "admin";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: RoleType;
}

const roleNavItems = {
    student: [
        { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { name: "History", href: "/student/history", icon: History },
        { name: "Settings", href: "/student/settings", icon: Settings },
    ],
    lecturer: [
        { name: "Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboard },
        { name: "Manage Classes", href: "/lecturer/classes", icon: Users },
        { name: "Settings", href: "/lecturer/settings", icon: Settings },
    ],
    admin: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "System Health", href: "/admin/health", icon: AlertTriangle },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const navItems = roleNavItems[role];

    // Derive title from pathname, or default to generic
    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "Dashboard";
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-body">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-babcock-blue text-white shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-6 pt-8 pb-4">
                    <div className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-babcock-gold flex items-center justify-center text-babcock-blue text-lg font-black">
                            V
                        </span>
                        VeriPoint
                    </div>
                    <button
                        className="md:hidden text-slate-300 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 py-2">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
                        {role.toUpperCase()} PORTAL
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                    isActive
                                        ? "bg-white/10 text-babcock-gold"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-babcock-gold" : "text-slate-400 group-hover:text-slate-200")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-300 font-bold">
                                U
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">John Doe</p>
                                <p className="text-xs text-slate-400 truncate">ID: 21/1234</p>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors text-sm font-medium mt-2">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-500 hover:text-slate-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:flex text-sm text-slate-500">
                            <span className="capitalize">{role}</span>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900 font-medium">{getPageTitle()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
