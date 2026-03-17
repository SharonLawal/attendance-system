"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Users, Upload, AlertCircle, Check, X, FileSpreadsheet, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { Badge } from "@/components/ui/Badge";

interface ManageCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
    onSuccess: () => void;
}

export function ManageCourseModal({ isOpen, onClose, course, onSuccess }: ManageCourseModalProps) {
    const [activeTab, setActiveTab] = useState<"import" | "pending">("import");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Import State
    const [rosterInput, setRosterInput] = useState("");
    const [ghostStudents, setGhostStudents] = useState<string[]>([]);
    const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

    // Pending State
    const [pendingRecords, setPendingRecords] = useState<any[]>([]);
    const [isLoadingPending, setIsLoadingPending] = useState(false);

    useEffect(() => {
        if (isOpen && course?._id) {
            setRosterInput("");
            setGhostStudents([]);
            setImportSuccessCount(null);
            setActiveTab("import");
            fetchPending();
        }
    }, [isOpen, course]);

    const fetchPending = async () => {
        if (!course?._id) return;
        setIsLoadingPending(true);
        try {
            const res = await apiClient.get(`/api/courses/${course._id}/pending`);
            setPendingRecords(res.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch pending check-ins.");
        } finally {
            setIsLoadingPending(false);
        }
    };

    const handleImportRoster = async () => {
        if (!rosterInput.trim()) return;

        // Parse CSV/Newline separated inputs
        const identifiers = rosterInput
            .split(/[\n,]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (identifiers.length === 0) {
            toast.error("No valid identifiers found.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.post(`/api/courses/${course._id}/roster`, {
                universityIds: identifiers
            });

            setImportSuccessCount(res.data.addedCount);
            setGhostStudents(res.data.ghostStudents || []);
            setRosterInput("");
            toast.success(`${res.data.addedCount} students registered successfully.`);
            onSuccess(); // Refresh dashboard counts
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to import roster.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResolve = async (recordId: string, action: "Approve" | "Reject") => {
        try {
            await apiClient.post(`/api/courses/${course._id}/resolve-pending`, {
                recordId,
                action
            });

            toast.success(`Check-in ${action.toLowerCase()}d.`);
            setPendingRecords(prev => prev.filter(r => r._id !== recordId));
            if (action === "Approve") {
                onSuccess(); // Refresh course roster counts
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action.toLowerCase()} record.`);
        }
    };

    if (!course) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Manage Roster: ${course.courseCode}`}
            description="Import verified student lists or resolve pending check-ins from unregistered attendees."
            maxWidth="2xl"
            footer={
                <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
                    Close Window
                </Button>
            }
        >
            <div className="pt-2 pb-4">
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'import' ? 'bg-white text-babcock-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('import')}
                    >
                        Batch Import Roster
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-white text-babcock-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => { setActiveTab('pending'); fetchPending(); }}
                    >
                        Pending Approvals
                        {pendingRecords.length > 0 && (
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">{pendingRecords.length}</span>
                        )}
                    </button>
                </div>

                {activeTab === "import" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                                <FileSpreadsheet className="w-4 h-4 text-babcock-blue" />
                                CSV / Raw Text Importer
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">Paste matriculation numbers separated by commas or new lines. The system will automatically map these to registered accounts and bind them to <strong className="text-slate-700">{course.courseCode}</strong>.</p>
                            <textarea
                                value={rosterInput}
                                onChange={(e) => setRosterInput(e.target.value)}
                                placeholder="e.g. 20/1234, 21/5678&#10;22/9012"
                                className="w-full h-32 p-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-babcock-blue focus:border-transparent font-mono transition-all"
                            />

                            <Button
                                onClick={handleImportRoster}
                                disabled={isSubmitting || !rosterInput.trim()}
                                className="w-full mt-3 gap-2 bg-babcock-blue hover:bg-babcock-blue/90 font-semibold shadow-md shadow-babcock-blue/20"
                            >
                                {isSubmitting ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Upload className="w-4 h-4" />}
                                {isSubmitting ? "Importing Data..." : "Process Roster Import"}
                            </Button>
                        </div>

                        {importSuccessCount !== null && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-800">Import Successful</p>
                                    <p className="text-xs text-emerald-600 mt-1">{importSuccessCount} students were positively authenticated and added to the official register.</p>
                                </div>
                            </div>
                        )}

                        {ghostStudents.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                <div className="w-full">
                                    <p className="text-sm font-semibold text-amber-800">Unregistered "Ghost" Students</p>
                                    <p className="text-xs text-amber-700 mt-1 mb-2">The following matriculation numbers were skipped because they have not created an account on the VeriPoint platform yet:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ghostStudents.map(id => (
                                            <span key={id} className="text-xs px-2 py-1 bg-amber-100 text-amber-800 font-mono rounded-md border border-amber-200">{id}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "pending" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-slate-600">Review attendance checks from students not on the roster.</p>
                            <Button variant="ghost" size="sm" onClick={fetchPending} disabled={isLoadingPending} className="text-slate-500 hover:text-babcock-blue">
                                <RefreshCcw className={`w-4 h-4 mr-2 ${isLoadingPending ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>

                        {isLoadingPending ? (
                            <div className="py-12 flex justify-center">
                                <span className="w-6 h-6 rounded-full border-3 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                            </div>
                        ) : pendingRecords.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-8 text-center flex flex-col items-center">
                                <Check className="w-10 h-10 text-emerald-400 mb-3" />
                                <p className="font-semibold text-slate-700 text-lg">All clear!</p>
                                <p className="text-sm text-slate-500 mt-1">No pending check-ins awaiting approval.</p>
                            </div>
                        ) : (
                            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                                {pendingRecords.map((record) => (
                                    <div key={record._id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900">{record.studentId?.fullName}</h4>
                                                <Badge variant="neutral" className="font-mono text-[10px]">{record.studentId?.universityId}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                <span>{new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-amber-600">Pending Authorization</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResolve(record._id, "Reject")}
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-1.5"
                                            >
                                                <X className="w-3.5 h-3.5" /> Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleResolve(record._id, "Approve")}
                                                className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-sm shadow-emerald-600/20"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Approve {"&"} Enroll
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
