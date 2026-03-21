"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Link as LinkIcon, CheckCircle2, Clock, RefreshCcw,
    Users, LogIn, Unlink, BookOpen, AlertTriangle,
    Video, Upload, FileSpreadsheet, X, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as lecturerService from "@/services/lecturerService";
import apiClient from "@/lib/axios";

// ─── Google Connection Card ──────────────────────────────────────────────────

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
            window.location.href = url;
        },
        onError: () => toast.error("Failed to initiate Google sign-in"),
    });
    const disconnectMutation = useMutation({
        mutationFn: lecturerService.disconnectGoogle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["google"] });
            toast.info("Google Classroom disconnected");
        },
    });
    const isConnected = status?.connected;
    return (
        <Card className={`border shadow-sm transition-all ${isConnected ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-200"}`}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${isConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>G</div>
                    <div>
                        <CardTitle className="text-base">Google Classroom</CardTitle>
                        <CardDescription className="text-xs">
                            {isLoading ? "Checking..." : isConnected ? `Connected as ${status.email}` : "Not connected"}
                        </CardDescription>
                    </div>
                </div>
                {isConnected && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            </CardHeader>
            <div className="px-6 pb-5">
                {isConnected ? (
                    <Button variant="outline" className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isPending} isLoading={disconnectMutation.isPending}>
                        <Unlink className="w-3.5 h-3.5 mr-1.5" /> Disconnect
                    </Button>
                ) : (
                    <Button variant="primary" className="w-full text-xs bg-babcock-blue hover:bg-babcock-blue/90 gap-2"
                        onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending || isLoading} isLoading={connectMutation.isPending}>
                        <LogIn className="w-3.5 h-3.5" /> Sign in with Google
                    </Button>
                )}
            </div>
        </Card>
    );
}

function MicrosoftConnectionCard() {
    return (
        <Card className="border-slate-200 shadow-sm opacity-60">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">MS</div>
                    <div>
                        <CardTitle className="text-base">Microsoft Teams</CardTitle>
                        <CardDescription className="text-xs">Use CSV export for attendance sync</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <div className="px-6 pb-5">
                <Button variant="outline" className="w-full text-xs" disabled>Requires Azure AD Admin Consent</Button>
            </div>
        </Card>
    );
}

// ─── Google Classroom Attendance Sync ────────────────────────────────────────

function GoogleAttendanceSyncPanel() {
    const [googleCourseId, setGoogleCourseId] = useState("");
    const [veriPointCourseId, setVeriPointCourseId] = useState("");
    const [result, setResult] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: googleCoursesData, isLoading: loadingGCourses } = useQuery({
        queryKey: ["google", "courses"],
        queryFn: lecturerService.getGoogleCourses,
        staleTime: 5 * 60 * 1000,
    });
    const { data: vpCoursesData } = useQuery({
        queryKey: ["lecturer", "courses"],
        queryFn: async () => { const res = await lecturerService.getMyCourses(); return res.data; },
        staleTime: 5 * 60 * 1000,
    });

    const syncMutation = useMutation({
        mutationFn: () => lecturerService.syncGoogleAttendance(googleCourseId, veriPointCourseId),
        onSuccess: (data) => { setResult(data); queryClient.invalidateQueries({ queryKey: ["lecturer", "syncHistory"] }); toast.success(data.message); },
        onError: (err: any) => toast.error(err.response?.data?.message || "Sync failed"),
    });

    const gOptions = (googleCoursesData?.courses || []).map((c: any) => ({ label: c.section ? `${c.name} — ${c.section}` : c.name, value: c.id }));
    const vpOptions = (vpCoursesData || []).map((c: any) => ({ label: `${c.courseCode} — ${c.courseName}`, value: c._id }));

    return (
        <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-1.5">
                <p className="text-sm font-semibold text-blue-800 flex items-center gap-2"><Video className="w-4 h-4" />How it works</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                    <li>During your Google Meet, share the Google Classroom attendance assignment link in chat</li>
                    <li>Students click the link and hit Submit — takes 5 seconds</li>
                    <li>After class, click Sync Attendance below — everyone who submitted is marked Present</li>
                </ol>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Google Classroom Course</label>
                    <Select value={googleCourseId} onChange={setGoogleCourseId} placeholder={loadingGCourses ? "Loading..." : "Select Google course..."} options={gOptions} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">VeriPoint Course</label>
                    <Select value={veriPointCourseId} onChange={setVeriPointCourseId} placeholder="Select VeriPoint course..." options={vpOptions} />
                </div>
            </div>
            <Button className="w-full gap-2 bg-babcock-blue hover:bg-babcock-blue/90 font-semibold h-12 text-base shadow-md shadow-babcock-blue/20"
                onClick={() => { setResult(null); syncMutation.mutate(); }}
                disabled={!googleCourseId || !veriPointCourseId || syncMutation.isPending} isLoading={syncMutation.isPending}>
                <RefreshCcw className="w-4 h-4" />
                {syncMutation.isPending ? "Syncing..." : "Sync Attendance from Latest Class"}
            </Button>
            {result && (
                <div className="bg-babcock-blue/5 border border-babcock-blue/20 rounded-lg p-4 animate-in fade-in">
                    <p className="font-semibold text-babcock-blue text-sm mb-1">✓ Attendance Synced</p>
                    {result.assignmentTitle && <p className="text-xs text-slate-500 mb-3">Source: <span className="font-medium text-slate-700">{result.assignmentTitle}</span></p>}
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-lg p-3 border"><p className="text-2xl font-bold text-babcock-blue">{result.syncedCount}</p><p className="text-xs text-slate-500 mt-1">Marked Present</p></div>
                        <div className="bg-white rounded-lg p-3 border"><p className="text-2xl font-bold text-slate-700">{result.totalSubmissions}</p><p className="text-xs text-slate-500 mt-1">Submissions</p></div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100"><p className="text-2xl font-bold text-amber-600">{result.unmatched ?? 0}</p><p className="text-xs text-slate-500 mt-1">Unmatched</p></div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── CSV Upload Panel ─────────────────────────────────────────────────────────

function CSVUploadPanel() {
    const [veriPointCourseId, setVeriPointCourseId] = useState("");
    const [platform, setPlatform] = useState("meet");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<any>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data: vpCoursesData } = useQuery({
        queryKey: ["lecturer", "courses"],
        queryFn: async () => { const res = await lecturerService.getMyCourses(); return res.data; },
        staleTime: 5 * 60 * 1000,
    });

    const syncMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("file", file!);
            formData.append("veriPointCourseId", veriPointCourseId);
            formData.append("platform", platform);
            const res = await apiClient.post("/api/lms/csv/sync-attendance", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: (data) => {
            setResult(data);
            queryClient.invalidateQueries({ queryKey: ["lecturer", "syncHistory"] });
            toast.success(data.message);
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Upload failed"),
    });

    const vpOptions = (vpCoursesData || []).map((c: any) => ({ label: `${c.courseCode} — ${c.courseName}`, value: c._id }));

    return (
        <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-babcock-blue" />
                    Works with Google Meet and Microsoft Teams
                </p>
                <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                    <li><strong>Google Meet:</strong> After your meeting, open Meet → click Activities → Attendance → Download</li>
                    <li><strong>Microsoft Teams:</strong> After your meeting, open the meeting chat → click Attendance → Download attendance list</li>
                    <li>Upload the downloaded CSV file below</li>
                </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Platform</label>
                    <Select value={platform} onChange={setPlatform}
                        options={[{ label: "Google Meet", value: "meet" }, { label: "Microsoft Teams", value: "teams" }]} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">VeriPoint Course</label>
                    <Select value={veriPointCourseId} onChange={setVeriPointCourseId} placeholder="Select course..." options={vpOptions} />
                </div>
            </div>

            {/* Drop zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isDragging ? "border-babcock-blue bg-blue-50 scale-[1.01]"
                    : file ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-300 bg-slate-50 hover:border-babcock-blue/50 hover:bg-slate-100"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault(); setIsDragging(false);
                    const dropped = e.dataTransfer.files[0];
                    if (dropped) { setFile(dropped); setResult(null); }
                }}
                onClick={() => fileRef.current?.click()}
            >
                <input ref={fileRef} type="file" accept=".csv,.tsv" className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setResult(null); } }} />

                {file ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload className={`w-8 h-8 mb-3 ${isDragging ? "text-babcock-blue animate-bounce" : "text-slate-400"}`} />
                        <p className="text-sm font-semibold text-slate-700">
                            {isDragging ? "Drop CSV here" : "Drag & drop your attendance CSV"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">or click to browse — .csv files only</p>
                    </>
                )}
            </div>

            <Button className="w-full gap-2 bg-babcock-blue hover:bg-babcock-blue/90 font-semibold h-12 text-base shadow-md shadow-babcock-blue/20"
                onClick={() => syncMutation.mutate()}
                disabled={!file || !veriPointCourseId || syncMutation.isPending} isLoading={syncMutation.isPending}>
                <Upload className="w-4 h-4" />
                {syncMutation.isPending ? "Processing CSV..." : "Upload & Mark Attendance"}
            </Button>

            {result && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-in fade-in">
                    <p className="font-semibold text-emerald-800 text-sm mb-3">✓ CSV Processed Successfully</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-lg p-3 border border-emerald-100"><p className="text-2xl font-bold text-emerald-600">{result.syncedCount}</p><p className="text-xs text-slate-500 mt-1">Marked Present</p></div>
                        <div className="bg-white rounded-lg p-3 border"><p className="text-2xl font-bold text-slate-700">{result.totalInCSV}</p><p className="text-xs text-slate-500 mt-1">In CSV</p></div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100"><p className="text-2xl font-bold text-amber-600">{result.unmatched}</p><p className="text-xs text-slate-500 mt-1">Unmatched</p></div>
                    </div>
                    {result.unmatchedEmails?.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> These emails have no VeriPoint account:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {result.unmatchedEmails.map((e: string) => (
                                    <span key={e} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-mono rounded-md">{e}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Roster Sync Panel ────────────────────────────────────────────────────────

function RosterSyncPanel() {
    const [googleCourseId, setGoogleCourseId] = useState("");
    const [veriPointCourseId, setVeriPointCourseId] = useState("");
    const [result, setResult] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: googleCoursesData, isLoading: loadingGCourses } = useQuery({ queryKey: ["google", "courses"], queryFn: lecturerService.getGoogleCourses, staleTime: 5 * 60 * 1000 });
    const { data: vpCoursesData } = useQuery({ queryKey: ["lecturer", "courses"], queryFn: async () => { const res = await lecturerService.getMyCourses(); return res.data; }, staleTime: 5 * 60 * 1000 });

    const syncMutation = useMutation({
        mutationFn: () => lecturerService.syncGoogleRoster(googleCourseId, veriPointCourseId),
        onSuccess: (data) => { setResult(data); queryClient.invalidateQueries({ queryKey: ["lecturer", "syncHistory"] }); toast.success(data.message); },
        onError: (err: any) => toast.error(err.response?.data?.message || "Roster sync failed"),
    });

    const gOptions = (googleCoursesData?.courses || []).map((c: any) => ({ label: c.section ? `${c.name} — ${c.section}` : c.name, value: c.id }));
    const vpOptions = (vpCoursesData || []).map((c: any) => ({ label: `${c.courseCode} — ${c.courseName}`, value: c._id }));

    return (
        <div className="space-y-5">
            <p className="text-sm text-slate-500">Import all students enrolled in a Google Classroom course directly into a VeriPoint course roster.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Google Classroom Course</label>
                    <Select value={googleCourseId} onChange={setGoogleCourseId} placeholder={loadingGCourses ? "Loading..." : "Select Google course..."} options={gOptions} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">VeriPoint Course</label>
                    <Select value={veriPointCourseId} onChange={setVeriPointCourseId} placeholder="Select VeriPoint course..." options={vpOptions} />
                </div>
            </div>
            <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-600/20"
                onClick={() => { setResult(null); syncMutation.mutate(); }}
                disabled={!googleCourseId || !veriPointCourseId || syncMutation.isPending} isLoading={syncMutation.isPending}>
                <Users className="w-4 h-4" />{syncMutation.isPending ? "Importing..." : "Import Student Roster"}
            </Button>
            {result && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-in fade-in">
                    <p className="font-semibold text-emerald-800 text-sm mb-3">✓ Roster Import Complete</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-lg p-3 border border-emerald-100"><p className="text-2xl font-bold text-emerald-600">{result.syncedCount}</p><p className="text-xs text-slate-500 mt-1">Imported</p></div>
                        <div className="bg-white rounded-lg p-3 border"><p className="text-2xl font-bold text-slate-700">{result.totalInGoogle}</p><p className="text-xs text-slate-500 mt-1">In Google</p></div>
                        <div className="bg-white rounded-lg p-3 border border-amber-100"><p className="text-2xl font-bold text-amber-600">{result.unmatched}</p><p className="text-xs text-slate-500 mt-1">No account</p></div>
                    </div>
                    {result.unmatched > 0 && (
                        <p className="text-xs text-amber-700 mt-3 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            Unmatched students need to register on VeriPoint and link their Gmail in Profile → Security & Integrations.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Sync History ─────────────────────────────────────────────────────────────

function SyncHistoryTable() {
    const { data: syncHistory = [], isLoading } = useQuery({ queryKey: ["lecturer", "syncHistory"], queryFn: lecturerService.getSyncHistory, staleTime: 60 * 1000 });
    const columns = [
        { header: "Platform", accessorKey: "platform" as const, className: "font-semibold" },
        { header: "Course", accessorKey: "course" as const },
        { header: "Date & Time", cell: (item: any) => <span className="text-slate-500 whitespace-nowrap">{item.date} · {item.time}</span> },
        { header: "Students Synced", accessorKey: "studentsSynced" as const, className: "text-center" },
        { header: "Status", cell: (item: any) => <Badge variant={item.status === "Success" ? "success" : item.status === "Partial Success" ? "warning" : "danger"}>{item.status}</Badge> },
    ];
    return (
        <div className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm relative">
            {isLoading && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><div className="w-6 h-6 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" /></div>}
            <DataTable data={syncHistory} columns={columns} emptyTitle="No sync history yet." emptyDescription="Complete a sync to see records here." />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "attendance" | "csv" | "roster";

function IntegrationsContent() {
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<Tab>("csv");

    const { data: status } = useQuery({ queryKey: ["google", "status"], queryFn: lecturerService.getGoogleConnectionStatus, staleTime: 30 * 1000 });

    useEffect(() => {
        const connected = searchParams.get("connected");
        const error = searchParams.get("error");
        if (connected === "google") { toast.success("Google Classroom connected!"); queryClient.invalidateQueries({ queryKey: ["google"] }); window.history.replaceState({}, "", "/lecturer/integrations"); }
        if (error) { toast.error("Google sign-in failed. Please try again."); window.history.replaceState({}, "", "/lecturer/integrations"); }
    }, [searchParams, queryClient]);

    const tabs: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
        { id: "csv", label: "Upload CSV", icon: <Upload className="w-4 h-4" />, description: "Google Meet & Teams" },
        { id: "attendance", label: "Google Classroom", icon: <RefreshCcw className="w-4 h-4" />, description: "Auto sync" },
        { id: "roster", label: "Roster Import", icon: <Users className="w-4 h-4" />, description: "Enroll students" },
    ];

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <LinkIcon className="w-6 h-6 text-babcock-blue" /> LMS Integrations
                    </h1>
                    <p className="text-slate-500 mt-1">Sync attendance from Google Meet, Microsoft Teams, or Google Classroom.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Connections */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Connected Platforms</h3>
                        <GoogleConnectionCard />
                        <MicrosoftConnectionCard />
                    </div>

                    {/* Right: Sync tabs */}
                    <div className="lg:col-span-2">
                        <Card className="border-slate-200 shadow-sm">
                            {/* Tabs */}
                            <div className="flex bg-slate-50 border-b border-slate-200 rounded-t-lg overflow-hidden">
                                {tabs.map((tab) => (
                                    <button key={tab.id}
                                        className={`flex-1 py-3 text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${activeTab === tab.id ? "bg-white text-babcock-blue border-b-2 border-babcock-blue" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}`}
                                        onClick={() => setActiveTab(tab.id)}>
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] font-normal ${activeTab === tab.id ? "text-babcock-blue/70" : "text-slate-400"}`}>{tab.description}</span>
                                    </button>
                                ))}
                            </div>
                            <CardContent className="pt-6">
                                {activeTab === "csv" && <div className="animate-in fade-in duration-200"><CSVUploadPanel /></div>}
                                {activeTab === "attendance" && (
                                    !status?.connected ? (
                                        <div className="py-10 flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-black text-slate-300 mb-3">G</div>
                                            <p className="text-sm font-semibold text-slate-600 mb-1">Connect Google Classroom first</p>
                                            <p className="text-xs text-slate-400">Use the Sign in with Google button on the left</p>
                                        </div>
                                    ) : <div className="animate-in fade-in duration-200"><GoogleAttendanceSyncPanel /></div>
                                )}
                                {activeTab === "roster" && (
                                    !status?.connected ? (
                                        <div className="py-10 flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-black text-slate-300 mb-3">G</div>
                                            <p className="text-sm font-semibold text-slate-600 mb-1">Connect Google Classroom first</p>
                                            <p className="text-xs text-slate-400">Use the Sign in with Google button on the left</p>
                                        </div>
                                    ) : <div className="animate-in fade-in duration-200"><RosterSyncPanel /></div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold font-display text-slate-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" /> Sync History
                    </h3>
                    <SyncHistoryTable />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function LecturerIntegrations() {
    return (
        <Suspense fallback={<DashboardLayout role="lecturer"><div className="w-full h-96 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" /></div></DashboardLayout>}>
            <IntegrationsContent />
        </Suspense>
    );
}