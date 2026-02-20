"use client";

import React, { useState, useEffect } from "react";
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
    AlertTriangle,
    BookOpen,
    CalendarDays,
    UserCircle,
    BarChart3,
    Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/Breadcrumb";

type RoleType = "student" | "lecturer" | "admin";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: RoleType;
}

const roleNavItems = {
    student: [
        { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { name: "My Courses", href: "/student/courses", icon: BookOpen },
        { name: "Schedule", href: "/student/schedule", icon: CalendarDays },
        { name: "History", href: "/student/history", icon: History },
        { name: "Profile", href: "/student/profile", icon: UserCircle },
    ],
    lecturer: [
        { name: "Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboard },
        { name: "Reports", href: "/lecturer/reports", icon: BarChart3 },
        { name: "Integrations", href: "/lecturer/integrations", icon: LinkIcon },
        { name: "My Courses", href: "/lecturer/courses", icon: BookOpen },
        { name: "Profile", href: "/lecturer/profile", icon: UserCircle },
    ],
    admin: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "System Reports", href: "/admin/reports", icon: BarChart3 },
        { name: "Session Audit", href: "/admin/sessions", icon: History },
        { name: "Platform Settings", href: "/admin/settings", icon: Settings },
    ],
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const navItems = roleNavItems[role];

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Dummy notification data (should ideally come from an API/context)
    const notifications = [
        { id: 1, text: "Your attendance for GEDS400 was successful.", time: "2m ago", read: false },
        { id: 2, text: "Prof. Nnamdi published a new assignment.", time: "1hr ago", read: false },
        { id: 3, text: "System maintenance scheduled for midnight.", time: "1d ago", read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close sidebar on route change for mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "Dashboard";
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-body relative overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
                    sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[280px] bg-babcock-blue text-white shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col md:w-64 max-w-[85vw]",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-6 pt-8 pb-4">
                    <div className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-babcock-gold flex items-center justify-center text-babcock-blue text-lg font-black shrink-0">
                            V
                        </span>
                        <span>VeriPoint</span>
                    </div>
                    <button
                        className="md:hidden text-white/70 hover:text-white p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-2">
                    <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4">
                        {role} PORTAL
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                                    isActive
                                        ? "bg-white/10 text-babcock-gold"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-babcock-gold" : "text-slate-400 group-hover:text-slate-200")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-white/5 rounded-lg p-4 flex flex-col gap-3 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 overflow-hidden flex items-center justify-center shrink-0 text-white font-bold">
                                JD
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">John Doe</p>
                                <p className="text-xs text-white/60 truncate">ID: 21/1234</p>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors text-sm font-medium mt-1">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:block mt-1">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/${role}/dashboard`} className="capitalize">{role}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 relative">
                        <div className="sm:hidden font-semibold text-slate-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                            {getPageTitle()}
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                className="relative p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                                aria-label="Notifications"
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsNotificationsOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                            <span className="font-semibold text-slate-800">Notifications</span>
                                            {unreadCount > 0 && (
                                                <button className="text-xs text-babcock-blue font-medium hover:underline">Mark all read</button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-babcock-blue' : 'bg-slate-300'}`} />
                                                    <div className="flex-1">
                                                        <p className={`text-sm leading-tight ${!n.read ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{n.text}</p>
                                                        <span className="text-xs text-slate-400 mt-1 block">{n.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 text-center bg-slate-50 border-t border-slate-100">
                                            <button className="text-sm text-babcock-blue font-semibold hover:text-blue-800">View All Notifications</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 sm:pb-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

