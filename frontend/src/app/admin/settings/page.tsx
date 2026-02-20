"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, Shield, Globe, MapPin, SlidersHorizontal, UserCircle, KeyRound, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

export default function AdminSettings() {
    const [minDuration, setMinDuration] = useState("5");
    const [geofenceRadius, setGeofenceRadius] = useState("50");
    const [lmsSyncMode, setLmsSyncMode] = useState("manual");

    const handleSaveGlobalConfigs = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Global system configurations updated successfully.");
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Administrator password secured. Please sign in again.");
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-babcock-blue" />
                        Platform Settings
                    </h1>
                    <p className="text-slate-500 mt-1">Configure global application parameters and modify your administrator credentials.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Global System Configurations */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="h-1 bg-babcock-blue absolute top-0 left-0 right-0 w-full" />
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-babcock-blue" />
                                    Global System Parameters
                                </CardTitle>
                                <CardDescription>These rules apply to all lecturers and students active on VeriPoint.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form id="global-config-form" onSubmit={handleSaveGlobalConfigs} className="space-y-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                                                Session Constraints
                                            </h4>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-600 mb-1">Minimum OTC Duration (Mins)</label>
                                                <input
                                                    type="number"
                                                    value={minDuration}
                                                    onChange={(e) => setMinDuration(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Lecturers cannot create sessions shorter than this.</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-600 mb-1">LMS Sync Method</label>
                                                <select
                                                    value={lmsSyncMode}
                                                    onChange={(e) => setLmsSyncMode(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition appearance-none"
                                                >
                                                    <option value="manual">Manual Export Only</option>
                                                    <option value="auto">Automatic (Daily at 00:00)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                Geofencing Bounds
                                            </h4>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-600 mb-1">Default Geofence Radius (Meters)</label>
                                                <input
                                                    type="number"
                                                    value={geofenceRadius}
                                                    onChange={(e) => setGeofenceRadius(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Expansion factor from the polygon center point.</p>
                                            </div>

                                            <div className="p-3 bg-blue-50/50 border border-babcock-blue/20 rounded-lg flex items-start gap-2 mt-4">
                                                <Shield className="w-4 h-4 text-babcock-blue mt-0.5 shrink-0" />
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Modifying these parameters affects real-time validation checks for active ongoing classes immediately.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </CardContent>
                            <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                                <Button form="global-config-form" type="submit" className="gap-2 shadow-md shadow-babcock-blue/20">
                                    <Save className="w-4 h-4" /> Save Configurations
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Admin Profile Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-slate-200 shadow-sm text-center">
                            <CardContent className="pt-8 pb-6 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-white font-display shrink-0 mb-3">
                                    AD
                                </div>
                                <h2 className="text-lg font-bold font-display text-slate-800">System Administrator</h2>
                                <p className="text-slate-500 text-xs mb-4">admin@babcock.edu.ng</p>
                                <Badge variant="neutral" className="bg-slate-800 text-white rounded-full">Root Access</Badge>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <KeyRound className="w-5 h-5 text-babcock-blue" />
                                    Admin Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">New Secure Password</label>
                                        <input required type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit" variant="primary" className="w-full text-sm">Update Security Keys</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}

