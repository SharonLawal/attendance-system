"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link as LinkIcon, RefreshCcw, CheckCircle2, XCircle, Clock, Server, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import { LECTURER_COURSES, LECTURER_SYNC_HISTORY } from "@/lib/demodata";

export default function LecturerIntegrations() {
    const [isGoogleConnected, setIsGoogleConnected] = useState(true);
    const [isTeamsConnected, setIsTeamsConnected] = useState(false);

    // Sync Simulation State
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncHistory, setSyncHistory] = useState(LECTURER_SYNC_HISTORY);

    const handleSync = () => {
        if (!selectedCourse || !selectedPlatform) return;

        setIsSyncing(true);
        toast.info("Establishing connection with LMS...", { duration: 2000 });

        // Simulate network delay and processing using Skeletons
        setTimeout(() => {
            setIsSyncing(false);
            const newSync = {
                id: Date.now(),
                platform: selectedPlatform === 'google' ? 'Google Classroom' : 'Microsoft Teams',
                course: LECTURER_COURSES.find(c => c.id === selectedCourse)?.code || "Unknown",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                studentsSynced: Math.floor(Math.random() * 50) + 10,
                status: "Success"
            };

            setSyncHistory([newSync, ...syncHistory]);
            toast.success(`Successfully synced ${newSync.studentsSynced} attendance records!`);

            // Reset form
            setSelectedCourse("");
            setSelectedPlatform("");
        }, 3500);
    };

    const columns = [
        { header: "Platform", accessorKey: "platform" as keyof typeof LECTURER_SYNC_HISTORY[0], className: "font-semibold" },
        { header: "Course", accessorKey: "course" as keyof typeof LECTURER_SYNC_HISTORY[0] },
        { header: "Date & Time", cell: (item: typeof LECTURER_SYNC_HISTORY[0]) => <span className="text-slate-500 whitespace-nowrap">{item.date} • {item.time}</span> },
        { header: "Records Synced", accessorKey: "studentsSynced" as keyof typeof LECTURER_SYNC_HISTORY[0], className: "text-center" },
        {
            header: "Status",
            cell: (item: typeof LECTURER_SYNC_HISTORY[0]) => (
                <Badge variant={item.status === "Success" ? "success" : "danger"} className="whitespace-nowrap">
                    {item.status}
                </Badge>
            )
        }
    ];

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                            <LinkIcon className="w-6 h-6 text-babcock-blue" />
                            LMS Integrations
                        </h1>
                        <p className="text-slate-500 mt-1">Connect your external platforms to synchronize online and hybrid class attendance.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Active Connections */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="text-lg font-bold font-display text-slate-800 border-b border-slate-200 pb-2">Connected Platforms</h3>

                        <Card className={`border ${isGoogleConnected ? 'border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-500/10' : 'border-slate-200'} shadow-sm transition-all`}>
                            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg font-display ${isGoogleConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                        GC
                                    </div>
                                    <div>
                                        <CardTitle className="text-base text-slate-800">Google Classroom</CardTitle>
                                        <CardDescription className="text-xs">{isGoogleConnected ? 'Connected & Authorized' : 'Not Connected'}</CardDescription>
                                    </div>
                                </div>
                                {isGoogleConnected && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                            </CardHeader>
                            <CardFooter className="pt-0">
                                <Button
                                    variant={isGoogleConnected ? "outline" : "primary"}
                                    className={`w-full text-xs ${isGoogleConnected ? 'border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-500' : ''}`}
                                    onClick={() => {
                                        if (isGoogleConnected) {
                                            setIsGoogleConnected(false);
                                            toast.info("Google Classroom disconnected.");
                                        } else {
                                            toast.success("OAuth sequence initiated. (Simulation)");
                                            setTimeout(() => setIsGoogleConnected(true), 1500);
                                        }
                                    }}
                                >
                                    {isGoogleConnected ? "Disconnect Account" : "Connect with Google"}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className={`border ${isTeamsConnected ? 'border-indigo-200 bg-indigo-50/30 ring-1 ring-indigo-500/10' : 'border-slate-200'} shadow-sm transition-all`}>
                            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg font-display ${isTeamsConnected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                        MS
                                    </div>
                                    <div>
                                        <CardTitle className="text-base text-slate-800">Microsoft Teams</CardTitle>
                                        <CardDescription className="text-xs">{isTeamsConnected ? 'Connected & Authorized' : 'Not Connected'}</CardDescription>
                                    </div>
                                </div>
                                {isTeamsConnected && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                            </CardHeader>
                            <CardFooter className="pt-0">
                                <Button
                                    variant={isTeamsConnected ? "outline" : "primary"}
                                    className={`w-full text-xs ${isTeamsConnected ? 'border-red-200 text-red-600 hover:bg-red-50 focus:ring-red-500' : ''}`}
                                    onClick={() => {
                                        if (isTeamsConnected) {
                                            setIsTeamsConnected(false);
                                            toast.info("Microsoft Teams disconnected.");
                                        } else {
                                            toast.success("OAuth sequence initiated. (Simulation)");
                                            setTimeout(() => setIsTeamsConnected(true), 1500);
                                        }
                                    }}
                                >
                                    {isTeamsConnected ? "Disconnect Account" : "Connect with Microsoft"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Sync Interface */}
                    <div className="lg:col-span-2 space-y-6">

                        <Card className="border-babcock-blue/20 ring-1 ring-babcock-blue/10 shadow-sm relative overflow-hidden bg-white">
                            {isSyncing && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4 p-6">
                                    <RefreshCcw className="w-10 h-10 text-babcock-blue animate-spin" />
                                    <p className="font-semibold text-slate-700 text-center text-sm md:text-base">Connecting to Learning Management System...</p>
                                    <div className="w-full max-w-sm space-y-2">
                                        <Skeleton className="h-4 w-full bg-blue-100" />
                                        <Skeleton className="h-4 w-5/6 bg-blue-100" />
                                        <Skeleton className="h-4 w-4/6 bg-blue-100" />
                                    </div>
                                </div>
                            )}

                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Server className="w-5 h-5 text-slate-500" />
                                    Manual Import
                                </CardTitle>
                                <CardDescription>Pull participation data from a recent online class session.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Target Course</label>
                                        <Select
                                            value={selectedCourse}
                                            onChange={setSelectedCourse}
                                            placeholder="Select course to sync..."
                                            options={LECTURER_COURSES.map(c => ({ label: `${c.code} - ${c.title}`, value: c.id }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Source Platform</label>
                                        <Select
                                            value={selectedPlatform}
                                            onChange={setSelectedPlatform}
                                            placeholder="Select platform..."
                                            options={[
                                                { label: "Google Classroom", value: "google", disabled: !isGoogleConnected },
                                                { label: "Microsoft Teams", value: "teams", disabled: !isTeamsConnected },
                                            ]}
                                        />
                                        {!isGoogleConnected && !isTeamsConnected && (
                                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> Connect a platform first.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        className="gap-2 min-w-[200px]"
                                        onClick={handleSync}
                                        disabled={!selectedCourse || !selectedPlatform || isSyncing}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Sync Attendance Records
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sync Log */}
                        <div>
                            <h3 className="text-lg font-bold font-display text-slate-800 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-400" />
                                Synchronization History
                            </h3>
                            <div className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <DataTable
                                    data={syncHistory}
                                    columns={columns}
                                    emptyTitle="No synchronization history found."
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

