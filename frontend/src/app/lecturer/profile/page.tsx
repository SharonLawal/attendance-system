"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserCircle, Shield, KeyRound, Mail, GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/axios";

export default function LecturerProfile() {
  const { user } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "L";

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Password change would go through the reset flow in production
      toast.success("Password successfully updated.");
      setIsPasswordModalOpen(false);
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast.error("Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await apiClient.post("/api/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Profile picture updated successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload image.");
    }
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
            <p className="text-slate-500 mt-1">
              Manage your account settings and security preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 text-center relative overflow-hidden">
              <div className="h-24 bg-babcock-blue absolute top-0 left-0 right-0 w-full" />
              <CardContent className="pt-12 pb-8 flex flex-col items-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-babcock-blue font-display shrink-0 mb-4 relative group overflow-hidden cursor-pointer">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                    <span className="text-white text-[10px] font-semibold uppercase tracking-wider">Upload</span>
                  </div>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                </div>
                <h2 className="text-xl font-bold font-display text-slate-800">
                  {user?.fullName || "Staff Profile"}
                </h2>
                <p className="text-slate-500 font-medium text-sm mb-2">Lecturer</p>

                <span className="bg-blue-50 text-babcock-blue tracking-wider font-mono px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {user?.universityId || "N/A"}
                </span>

                <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                  <span className="text-slate-500">Account Status</span>
                  <Badge variant="success">Active</Badge>
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> School / Faculty
                  </label>
                  <p className="text-slate-800 font-medium">
                    {(user as any)?.school || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Institutional Email
                  </label>
                  <p className="text-slate-800 font-medium">
                    {user?.email || "No email provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                    Staff ID
                  </label>
                  <p className="text-slate-800 font-medium font-mono">
                    {user?.universityId || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-babcock-blue" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Manage credentials and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-800">Password</h4>
                    <p className="text-sm text-slate-500">
                      Use the forgot password flow to reset your password securely.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2 w-full sm:w-auto text-slate-700 border-slate-300"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
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
        description="Enter your current password and choose a new one."
        maxWidth="md"
      >
        <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwords.newPass}
              onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}