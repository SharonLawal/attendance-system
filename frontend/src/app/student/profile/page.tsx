"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Mail, KeyRound, Shield, HelpCircle, LogOut, Link2, Unlink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

// ─── Google Email Link Card ──────────────────────────────────────────────────

function GoogleEmailCard() {
  const { user, refetchUser } = useAuth();
  const [gmailInput, setGmailInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const linkedEmail = user?.linkedGoogleEmail;

  const linkMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.put("/api/auth/link-google-email", {
        googleEmail: email,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Gmail linked! Lecturers can now find you in roster syncs.");
      setGmailInput("");
      setShowInput(false);
      await refetchUser();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to link email");
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete("/api/auth/link-google-email");
      return res.data;
    },
    onSuccess: async () => {
      toast.info("Gmail unlinked.");
      await refetchUser();
    },
    onError: () => toast.error("Failed to unlink"),
  });

  return (
    <div className="flex flex-col gap-3 p-4 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="font-semibold text-slate-700 text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black flex items-center justify-center shrink-0">
              G
            </span>
            Google / Gmail Account
          </p>
          {linkedEmail ? (
            <p className="text-xs text-emerald-600 font-medium mt-1 ml-7">
              Linked: <span className="font-mono">{linkedEmail}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-1 ml-7">
              Link your Gmail so lecturers can match you when syncing Google Classroom
            </p>
          )}
        </div>

        {linkedEmail ? (
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 shrink-0 w-full sm:w-auto"
            onClick={() => unlinkMutation.mutate()}
            disabled={unlinkMutation.isPending}
            isLoading={unlinkMutation.isPending}
          >
            <Unlink className="w-3.5 h-3.5 mr-1.5" />
            Unlink Gmail
          </Button>
        ) : !showInput ? (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 w-full sm:w-auto"
            onClick={() => setShowInput(true)}
          >
            <Link2 className="w-3.5 h-3.5 mr-1.5" />
            Link Gmail
          </Button>
        ) : null}
      </div>

      {showInput && !linkedEmail && (
        <div className="flex gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="email"
            placeholder="yourname@gmail.com"
            value={gmailInput}
            onChange={(e) => setGmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && gmailInput) linkMutation.mutate(gmailInput);
              if (e.key === "Escape") {
                setShowInput(false);
                setGmailInput("");
              }
            }}
            autoFocus
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-babcock-blue"
          />
          <Button
            size="sm"
            onClick={() => linkMutation.mutate(gmailInput)}
            disabled={!gmailInput || linkMutation.isPending}
            isLoading={linkMutation.isPending}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowInput(false);
              setGmailInput("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Profile Page ───────────────────────────────────────────────────────

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "S";

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
      logout();
    }, 1000);
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
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Profile & Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your account credentials and personal preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Card */}
          <Card className="md:col-span-1 border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex flex-col items-center justify-center mb-6 overflow-hidden relative group cursor-pointer">
                {(user as any)?.profilePicture ? (
                  <img src={(user as any).profilePicture} alt="Avatar" className="w-full h-full object-cover relative z-10" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-babcock-blue to-babcock-gold/40" />
                    <span className="text-4xl font-bold text-white relative z-10 font-display">
                      {initials}
                    </span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all z-20">
                  <span className="text-white text-[10px] font-semibold uppercase tracking-wider">Upload</span>
                </div>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-30" onChange={handleImageUpload} />
              </div>
              <h2 className="text-xl font-bold font-display text-slate-800">
                {user?.fullName || "Student Profile"}
              </h2>
              <Badge variant="babcock" className="mt-2 mb-6">
                Software Engineering
              </Badge>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Matric No
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {user?.universityId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Level
                  </span>
                  <span className="text-sm font-bold text-slate-700">400 L</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </span>
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
                <CardDescription>
                  Official university communication channels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Primary Email Address
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-slate-800 font-medium">
                      {user?.email || "No email provided"}
                    </p>
                    <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Verified organizational domain.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Security & Integrations
                </CardTitle>
                <CardDescription>
                  Password management and third-party account linking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">
                      Change Password
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    Update
                  </Button>
                </div>

                {/* Google Gmail link for LMS sync matching */}
                <GoogleEmailCard />
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

        {/* Logout Modal */}
        <Modal
          isOpen={logoutModalOpen}
          onClose={() => !isLoggingOut && setLogoutModalOpen(false)}
          title="Sign Out"
          description="Are you sure you want to log out of VeriPoint?"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setLogoutModalOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                isLoading={isLoggingOut}
              >
                Sign Out
              </Button>
            </>
          }
        >
          <div className="flex items-center justify-center p-4 py-8">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut className="w-8 h-8 text-red-500 ml-1" />
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}