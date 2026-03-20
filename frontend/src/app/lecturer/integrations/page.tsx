"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Link as LinkIcon,
    CheckCircle2,
    Clock,
    RefreshCcw,
    AlertTriangle,
    Users,
    BookOpen,
    LogIn,
    Unlink,
    ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as lecturerService from "@/services/lecturerService";

// ─── Google Connection Card ───────────────────────────────────────────────────

function GoogleConnectionCard() {
    const queryClient = useQueryClient();

    const { data: status, isLoading } = useQuery({
        queryKey: ["google", "status"],
        queryFn: lecturerService.getGoogleConnectionStatus,
        staleTime: 30 * 1000,
    });

    const connectMutation = useMutation({
        mutationFn: async () => {
            const { url } = await lecturerService.getGoogleAuthUrl();
            window.location.href = url; // Redirect to Google OAuth
        },
        onError: () => toast.error("Failed to initiate Google sign-in"),
    });

    const disconnectMutation = useMutation({
        mutationFn: lecturerService.disconnectGoogle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["google"] });
            toast.info("Google Classroom disconnected");
        },
        onError: () => toast.error("Failed to disconnect"),
    });

    const isConnected = status?.connected;

    return (
        <Card className={`border shadow-sm transition-all ${isConnected ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-200"}`}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    {/* Google "G" logo colours */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${isConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        G
                    </div>
                    <div>
                        <CardTitle className="text-base">Google Classroom</CardTitle>
                        <CardDescription className="text-xs">
                            {isLoading
                                ? "Checking..."
                                : isConnected
                                ? `Connected as ${status.email}`
                                : "Not connected"}
                        </CardDescription>
                    </div>
                </div>
                {isConnected && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            </CardHeader>
            <CardFooter className="pt-0">
                {isConnected ? (
                    <Button
                        variant="outline"
                        className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => disconnectMutation.mutate()}
                        disabled={disconnectMutation.isPending}
                    >
                        <Unlink className="w-3.5 h-3.5 mr-1.5" />
                        Disconnect Account
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        className="w-full text-xs bg-babcock-blue hover:bg-babcock-blue/90 gap-2"
                        onClick={() => connectMutation.mutate()}
                        disabled={connectMutation.isPending || isLoading}
                        isLoading={connectMutation.isPending}
                    >
                        <LogIn className="w-3.5 h-3.5" />
                        Sign in with Google
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

// ─── Microsoft Placeholder Card ───────────────────────────────────────────────

function MicrosoftConnectionCard() {
    return (
        <Card className="border-slate-200 shadow-sm opacity-75">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        MS
                    </div>
                    <div>
                        <CardTitle className="text-base">Microsoft Teams</CardTitle>
                        <CardDescription className="text-xs">Requires institutional Azure AD consent</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    className="w-full text-xs"
                    disabled
                    title="Microsoft Teams integration requires Azure AD admin approval from Babcock IT"
                >
                    Coming Soon
                </Button>
            </CardFooter>
        </Card>
    );
}

// ─── Roster Sync Panel ────────────────────────────────────────────────────────

function RosterSyncPanel() {
    const [googleCourseId, setGoogleCourseId] = useState("");
    const [veriPointCourseId, setVeriPointCourseId] = useState("");
    const [result, setResult] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: googleCoursesData, isLoading: loadingGCourses } = useQuery({
        queryKey: ["google", "courses"],
        queryFn: lecturerService.getGoogleCourses,
        staleTime: 5 * 60 * 1000,
    });

    const { data: vpCoursesData, isLoading: loadingVPCourses } = useQuery({
        queryKey: ["lecturer", "courses"],
        queryFn: async () => {
            const res = await lecturerService.getMyCourses();
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const syncMutation = useMutation({
        mutationFn: () => lecturerService.syncGoogleRoster(googleCourseId, veriPointCourseId),
        onSuccess: (data) => {
            setResult(data);
            queryClient.invalidateQueries({ queryKey: ["lecturer", "syncHistory"] });
            queryClient.invalidateQueries({ queryKey: ["lecturer", "courses"] });
            toast.success(data.message);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Roster sync failed");
        },
    });

    const gCourseOptions = (googleCoursesData?.courses || []).map((c: any) => ({
        label: c.section ? `${c.name} — ${c.section}` : c.name,
        value: c.id,
    }));

    const vpCourseOptions = (vpCoursesData || []).map((c: any) => ({
        label: `${c.courseCode} — ${c.courseName}`,
        value: c._id,
    }));

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold flex items-center justify-center">G</span>
                        Google Classroom Course
                    </label>
                    <Select
                        value={googleCourseId}
                        onChange={setGoogleCourseId}
                        placeholder={loadingGCourses ? "Loading..." : "Select Google course..."}
                        options={gCourseOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-babcock-blue" />
                        VeriPoint Course
                    </label>
                    <Select
                        value={veriPointCourseId}
                        onChange={setVeriPointCourseId}
                        placeholder={loadingVPCourses ? "Loading..." : "Select VeriPoint course..."}
                        options={vpCourseOptions}
                    />
                </div>
            </div>

            <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20"
                onClick={() => { setResult(null); syncMutation.mutate(); }}
                disabled={!googleCourseId || !veriPointCourseId || syncMutation.isPending}
                isLoading={syncMutation.isPending}
            >
                <Users className="w-4 h-4" />
                {syncMutation.isPending ? "Syncing Roster..." : "Import Student Roster"}
            </Button>

            {result && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2 animate-in fade-in">
                    <p className="font-semibold text-emerald-800 text-sm">✓ Roster Import Complete</p>
                    <div className="grid grid-cols-3 gap-3 text-center mt-3">
                        <div className="bg-white rounded-lg p-3 border border-emerald-100">
                            <p className="text-2xl font-bold text-emerald-600">{result.syncedCount}</p>
                            <p className="text-xs text-slate-500 mt-1">Imported</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-2xl font-bold text-slate-700">{result.totalInGoogle}</p>
                            <p className="text-xs text-slate-500 mt-1">In Google</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100">
                            <p className="text-2xl font-bold text-amber-600">{result.unmatched}</p>
                            <p className="text-xs text-slate-500 mt-1">No VeriPoint account</p>
                        </div>
                    </div>
                    {result.unmatched > 0 && (
                        <p className="text-xs text-amber-700 mt-2 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            Unmatched students haven't registered on VeriPoint yet. Ask them to sign up with their Babcock email.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Attendance Sync Panel ────────────────────────────────────────────────────

function AttendanceSyncPanel() {
    const [googleCourseId, setGoogleCourseId] = useState("");
    const [veriPointCourseId, setVeriPointCourseId] = useState("");
    const [courseWorkId, setCourseWorkId] = useState("");
    const [result, setResult] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: googleCoursesData, isLoading: loadingGCourses } = useQuery({
        queryKey: ["google", "courses"],
        queryFn: lecturerService.getGoogleCourses,
        staleTime: 5 * 60 * 1000,
    });

    const { data: vpCoursesData } = useQuery({
        queryKey: ["lecturer", "courses"],
        queryFn: async () => {
            const res = await lecturerService.getMyCourses();
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: courseWorkData, isLoading: loadingCW } = useQuery({
        queryKey: ["google", "coursework", googleCourseId],
        queryFn: () => lecturerService.getGoogleCourseWork(googleCourseId),
        enabled: !!googleCourseId,
        staleTime: 2 * 60 * 1000,
    });

    const syncMutation = useMutation({
        mutationFn: () =>
            lecturerService.syncGoogleAttendance(googleCourseId, veriPointCourseId, courseWorkId),
        onSuccess: (data) => {
            setResult(data);
            queryClient.invalidateQueries({ queryKey: ["lecturer", "syncHistory"] });
            toast.success(data.message);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Attendance sync failed");
        },
    });

    const gCourseOptions = (googleCoursesData?.courses || []).map((c: any) => ({
        label: c.section ? `${c.name} — ${c.section}` : c.name,
        value: c.id,
    }));

    const vpCourseOptions = (vpCoursesData || []).map((c: any) => ({
        label: `${c.courseCode} — ${c.courseName}`,
        value: c._id,
    }));

    const cwOptions = (courseWorkData?.courseWork || []).map((cw: any) => ({
        label: `${cw.title} (${cw.type})`,
        value: cw.id,
    }));

    return (
        <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2 text-xs text-blue-700">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Students who <strong>submitted</strong> the selected assignment will be marked as <strong>Present</strong> in VeriPoint.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold flex items-center justify-center">G</span>
                        Google Classroom Course
                    </label>
                    <Select
                        value={googleCourseId}
                        onChange={(v) => { setGoogleCourseId(v); setCourseWorkId(""); }}
                        placeholder={loadingGCourses ? "Loading..." : "Select Google course..."}
                        options={gCourseOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-babcock-blue" />
                        VeriPoint Course
                    </label>
                    <Select
                        value={veriPointCourseId}
                        onChange={setVeriPointCourseId}
                        placeholder="Select VeriPoint course..."
                        options={vpCourseOptions}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Assignment / Quiz (attendance source)
                </label>
                <Select
                    value={courseWorkId}
                    onChange={setCourseWorkId}
                    placeholder={
                        !googleCourseId
                            ? "Select a Google course first..."
                            : loadingCW
                            ? "Loading assignments..."
                            : cwOptions.length === 0
                            ? "No assignments found"
                            : "Select assignment..."
                    }
                    options={cwOptions}
                />
            </div>

            <Button
                className="w-full gap-2 bg-babcock-blue hover:bg-babcock-blue/90 font-semibold shadow-md shadow-babcock-blue/20"
                onClick={() => { setResult(null); syncMutation.mutate(); }}
                disabled={!googleCourseId || !veriPointCourseId || !courseWorkId || syncMutation.isPending}
                isLoading={syncMutation.isPending}
            >
                <RefreshCcw className="w-4 h-4" />
                {syncMutation.isPending ? "Syncing Attendance..." : "Sync Attendance from Submissions"}
            </Button>

            {result && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 animate-in fade-in">
                    <p className="font-semibold text-blue-800 text-sm">✓ Attendance Sync Complete</p>
                    <div className="grid grid-cols-2 gap-3 text-center mt-3">
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <p className="text-2xl font-bold text-blue-600">{result.syncedCount}</p>
                            <p className="text-xs text-slate-500 mt-1">Marked Present</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-100">
                            <p className="text-2xl font-bold text-slate-700">{result.totalSubmissions}</p>
                            <p className="text-xs text-slate-500 mt-1">Total Submissions</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Sync History Table ───────────────────────────────────────────────────────

function SyncHistoryTable() {
    const { data: syncHistory = [], isLoading } = useQuery({
        queryKey: ["lecturer", "syncHistory"],
        queryFn: lecturerService.getSyncHistory,
        staleTime: 60 * 1000,
    });

    const columns = [
        { header: "Platform", accessorKey: "platform" as const, className: "font-semibold" },
        { header: "Course", accessorKey: "course" as const },
        {
            header: "Date & Time",
            cell: (item: any) => (
                <span className="text-slate-500 whitespace-nowrap">
                    {item.date} · {item.time}
                </span>
            ),
        },
        { header: "Students Synced", accessorKey: "studentsSynced" as const, className: "text-center" },
        {
            header: "Status",
            cell: (item: any) => (
                <Badge variant={item.status === "Success" ? "success" : item.status === "Partial Success" ? "warning" : "danger"}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    return (
        <div className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                </div>
            )}
            <DataTable
                data={syncHistory}
                columns={columns}
                emptyTitle="No sync history yet."
                emptyDescription="Complete a roster or attendance sync to see records here."
            />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function IntegrationsContent() {
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"roster" | "attendance">("roster");

    const { data: status } = useQuery({
        queryKey: ["google", "status"],
        queryFn: lecturerService.getGoogleConnectionStatus,
        staleTime: 30 * 1000,
    });

    // Handle redirect back from Google OAuth
    useEffect(() => {
        const connected = searchParams.get("connected");
        const error = searchParams.get("error");

        if (connected === "google") {
            toast.success("Google Classroom connected successfully!");
            queryClient.invalidateQueries({ queryKey: ["google"] });
            // Clean URL
            window.history.replaceState({}, "", "/lecturer/integrations");
        }
        if (error) {
            toast.error("Google sign-in failed. Please try again.");
            window.history.replaceState({}, "", "/lecturer/integrations");
        }
    }, [searchParams, queryClient]);

    const isGoogleConnected = status?.connected;

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <LinkIcon className="w-6 h-6 text-babcock-blue" />
                        LMS Integrations
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Connect your Google Classroom account to import student rosters and sync attendance records.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Connection Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                            Connected Platforms
                        </h3>
                        <GoogleConnectionCard />
                        <MicrosoftConnectionCard />
                    </div>

                    {/* Right: Sync Interface */}
                    <div className="lg:col-span-2">
                        {!isGoogleConnected ? (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                                <div className="w-16 h-16 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-3xl font-black text-slate-300 mb-4">
                                    G
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-2">
                                    Connect Google Classroom to get started
                                </h3>
                                <p className="text-sm text-slate-500 max-w-sm">
                                    Sign in with your Google account to import student rosters and pull attendance from assignment submissions.
                                </p>
                            </div>
                        ) : (
                            <Card className="border-slate-200 shadow-sm">
                                {/* Tabs */}
                                <div className="flex bg-slate-50 border-b border-slate-200 rounded-t-lg overflow-hidden">
                                    <button
                                        className={`flex-1 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                            activeTab === "roster"
                                                ? "bg-white text-babcock-blue border-b-2 border-babcock-blue"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                                        }`}
                                        onClick={() => setActiveTab("roster")}
                                    >
                                        <Users className="w-4 h-4" />
                                        Roster Import
                                    </button>
                                    <button
                                        className={`flex-1 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                            activeTab === "attendance"
                                                ? "bg-white text-babcock-blue border-b-2 border-babcock-blue"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                                        }`}
                                        onClick={() => setActiveTab("attendance")}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Attendance Sync
                                    </button>
                                </div>
                                <CardContent className="pt-6">
                                    {activeTab === "roster" ? (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <RosterSyncPanel />
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <AttendanceSyncPanel />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Sync History */}
                <div>
                    <h3 className="text-lg font-bold font-display text-slate-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        Synchronization History
                    </h3>
                    <SyncHistoryTable />
                </div>

            </div>
        </DashboardLayout>
    );
}

export default function LecturerIntegrations() {
    return (
        <Suspense fallback={
            <DashboardLayout role="lecturer">
                <div className="w-full h-96 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                </div>
            </DashboardLayout>
        }>
            <IntegrationsContent />
        </Suspense>
    );
}