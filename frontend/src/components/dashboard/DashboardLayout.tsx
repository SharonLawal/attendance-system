"use client";

/**
 * @fileoverview Contextual execution boundary for frontend/src/components/dashboard/DashboardLayout.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    UserCircle,
    BarChart3,
    Link as LinkIcon,
    MapPin,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/Breadcrumb";
import { useAuth } from "@/context/AuthContext";

type RoleType = "student" | "lecturer" | "admin";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: RoleType;
}

const roleNavItems = {
    student: [
        { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { name: "My Courses", href: "/student/courses", icon: BookOpen },
        { name: "History", href: "/student/history", icon: History },
        { name: "Profile", href: "/student/profile", icon: UserCircle },
    ],
    lecturer: [
        { name: "Dashboard", href: "/lecturer/dashboard", icon: LayoutDashboard },
        { name: "Integrations", href: "/lecturer/integrations", icon: LinkIcon },
        { name: "My Courses", href: "/lecturer/courses", icon: BookOpen },
        { name: "Profile", href: "/lecturer/profile", icon: UserCircle },
    ],
    admin: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Campus Venues", href: "/admin/venues", icon: MapPin },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Session Audit", href: "/admin/sessions", icon: History },
        { name: "Platform Settings", href: "/admin/settings", icon: Settings },
    ],
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const navItems = roleNavItems[role];
    const { user, isLoading, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        } else if (!isLoading && user && user.role.toLowerCase() !== role) {
            router.replace('/unauthorized');
        }
    }, [user, isLoading, role, router]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-babcock-blue" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-body relative overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
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
                        <ShieldCheck className="w-8 h-8 text-babcock-gold shrink-0" strokeWidth={2.5} />
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
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt={user?.fullName || "Avatar"} className="w-10 h-10 rounded-full border border-white/20 object-cover shrink-0" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center shrink-0 text-white font-bold uppercase">
                                    {user?.fullName?.substring(0, 2) || "NA"}
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.fullName || "User Name"}</p>
                                <p className="text-xs text-white/60 truncate">ID: {user?.universityId || "N/A"}</p>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                setIsLoggingOut(true);
                                await logout();
                            }}
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors text-sm font-medium mt-1">
                            <LogOut className="w-4 h-4" />
                            {isLoggingOut ? "Signing Out..." : "Sign Out"}
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

                    <div className="flex bg-transparent flex-1 justify-center sm:hidden">
                        <div className="font-semibold text-slate-900 truncate px-2 text-center">
                            {getPageTitle()}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 w-10 sm:w-auto">
                        {/* Empty right anchor for flex balance */}
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                    <div className={cn("p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 sm:pb-8 transition-opacity duration-300", isLoggingOut && "opacity-20 pointer-events-none")}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

