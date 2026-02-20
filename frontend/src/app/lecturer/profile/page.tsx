"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserCircle, Shield, KeyRound, Mail, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

export default function LecturerProfile() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordModalOpen(false);
        toast.success("Password successfully updated. Please use your new password on next login.");
    };

    return (
        <DashboardLayout role="lecturer">
            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-babcock-blue" />
                            Staff Profile
                        </h1>
                        <p className="text-slate-500 mt-1">Manage your account settings and security preferences.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Identity */}
                    <div className="lg:col-span-1">
                        <Card className="border-slate-200 text-center relative overflow-hidden">
                            <div className="h-24 bg-babcock-blue absolute top-0 left-0 right-0 w-full" />
                            <CardContent className="pt-12 pb-8 flex flex-col items-center relative z-10">
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-babcock-blue font-display shrink-0 mb-4">
                                    JS
                                </div>
                                <h2 className="text-xl font-bold font-display text-slate-800">Dr. Jane Smith</h2>
                                <p className="text-slate-500 font-medium text-sm mb-4">Senior Lecturer</p>

                                <span className="bg-blue-50 text-babcock-blue tracking-wider font-mono px-3 py-1 rounded-full text-xs font-semibold mb-6">
                                    STAFF-4001
                                </span>

                                <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <AccountBadge /> Accounts
                                    </span>
                                    <span className="font-semibold text-slate-700">Active</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Meta Details & Settings */}
                    <div className="lg:col-span-2 space-y-6">

                        <Card className="border-slate-200">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-babcock-blue" />
                                    Academic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Department</label>
                                    <p className="text-slate-800 font-medium">Computer Science</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">School/Faculty</label>
                                    <p className="text-slate-800 font-medium">Computing & Engineering Sciences</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Institutional Email</label>
                                    <p className="text-slate-800 font-medium">smithj@babcock.edu.ng</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200">
                            <CardHeader className="border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-babcock-blue" />
                                    Account Security
                                </CardTitle>
                                <CardDescription>Manage credentials and authentication preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Password</h4>
                                        <p className="text-sm text-slate-500">Last changed 4 months ago</p>
                                    </div>
                                    <Button variant="outline" className="gap-2 w-full sm:w-auto text-slate-700 border-slate-300" onClick={() => setIsPasswordModalOpen(true)}>
                                        <KeyRound className="w-4 h-4" /> Change Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>

            {/* Password Update Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Update Password"
                description="Ensure your new password contains at least 8 characters, including a number and a symbol."
                maxWidth="md"
            >
                <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Update Password</Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}

// Helper icons
function AccountBadge() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-emerald-500">
            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
        </svg>
    )
}

