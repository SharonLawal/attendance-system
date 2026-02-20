"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Mail, KeyRound, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

export default function StudentProfile() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
      window.location.href = '/auth/login';
    }, 1500);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl mx-auto">

        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Profile & Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account credentials and personal preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Identity Card */}
          <Card className="md:col-span-1 border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex flex-col items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-babcock-blue to-babcock-gold/40" />
                <span className="text-4xl font-bold text-white relative z-10 font-display shadow-sm">JD</span>
              </div>

              <h2 className="text-xl font-bold font-display text-slate-800">John Doe</h2>
              <Badge variant="babcock" className="mt-2 mb-6">Software Engineering</Badge>

              <div className="w-full space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matric No</span>
                  <span className="text-sm font-bold text-slate-700">21/1234</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</span>
                  <span className="text-sm font-bold text-slate-700">400 L</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Cards */}
          <div className="md:col-span-2 space-y-6">

            <Card className="border-0 shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className="h-1 bg-babcock-blue w-full" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-babcock-gold" />
                  Contact Information
                </CardTitle>
                <CardDescription>Official university communication channels.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Primary Email Address</label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-slate-800 font-medium">john.doe@student.babcock.edu.ng</p>
                    <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full"><Shield className="w-3.5 h-3.5" /></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Verified organizational domain.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Security & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Change Password</p>
                    <p className="text-xs text-slate-500 mt-1">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex">Update</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors group cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500 mt-1">Add an extra layer of security</p>
                  </div>
                  <Badge variant="neutral">Disabled</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="outline" className="flex-1 text-slate-500 bg-white">
                <HelpCircle className="w-4 h-4 mr-2" />
                Support & Help
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setLogoutModalOpen(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out Securely
              </Button>
            </div>

          </div>
        </div>

        {/* Custom Logout Modal */}
        <Modal
          isOpen={logoutModalOpen}
          onClose={() => !isLoggingOut && setLogoutModalOpen(false)}
          title="Sign Out"
          description="Are you sure you want to log out of VeriPoint?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setLogoutModalOpen(false)} disabled={isLoggingOut}>Cancel</Button>
              <Button variant="danger" onClick={handleLogout} isLoading={isLoggingOut}>Sign Out</Button>
            </>
          }
        >
          <div className="flex items-center justify-center p-4 py-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <LogOut className="w-8 h-8 text-red-500 ml-1" />
            </div>
          </div>
        </Modal>

      </div>
    </DashboardLayout>
  );
}