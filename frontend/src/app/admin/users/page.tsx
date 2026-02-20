"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, UserPlus, UploadCloud, MoreVertical, Edit, KeyRound, Ban, Trash2, Search, FileUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { EditUserModal, UserToEdit } from "@/components/ui/EditUserModal";
import { toast } from "sonner";
import { ADMIN_USERS_DATA } from "@/lib/demodata";

export default function AdminUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modal States
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserToEdit | null>(null);

    // Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);

    // Filtering & Pagination Logic
    const filteredUsers = ADMIN_USERS_DATA.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.identifier.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handlers
    const handleAddUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddUserModalOpen(false);
        toast.success("New user account generated and activation email sent.");
    };

    const handleBulkUpload = () => {
        setIsBulkUploadModalOpen(false);
        toast.success("CSV processing started. 145 items queued for registration.");
    };

    const handleEditSave = (data: any) => {
        toast.success(`Account for ${data.name} updated successfully.`);
    };

    const columns = [
        { header: "Name", accessorKey: "name" as keyof typeof ADMIN_USERS_DATA[0], className: "font-semibold text-slate-800" },
        { header: "ID / Matric", accessorKey: "identifier" as keyof typeof ADMIN_USERS_DATA[0], className: "font-mono text-slate-500 text-sm" },
        { header: "Role", accessorKey: "role" as keyof typeof ADMIN_USERS_DATA[0] },
        {
            header: "Status",
            cell: (item: typeof ADMIN_USERS_DATA[0]) => (
                <Badge variant={item.status === "Active" ? "success" : item.status === "Suspended" ? "danger" : "neutral"}>
                    {item.status}
                </Badge>
            )
        },
        {
            header: "Actions",
            cell: (item: typeof ADMIN_USERS_DATA[0]) => (
                <div className="flex justify-end gap-2">
                    <button onClick={() => { setSelectedUser(item); setIsEditModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-babcock-blue hover:bg-blue-50 rounded-md transition-colors tooltip-trigger relative group">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => toast.warning("Password reset link dispatched")} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors">
                        <KeyRound className="w-4 h-4" />
                    </button>
                    <button onClick={() => toast.error("Account suspended")} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Ban className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];


    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-babcock-blue" />
                            User Management
                        </h1>
                        <p className="text-slate-500 mt-1">Create, manage, and configure university accounts.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 sm:flex-1 bg-white" onClick={() => setIsBulkUploadModalOpen(true)}>
                            <UploadCloud className="w-4 h-4 text-babcock-blue" />
                            Bulk Import
                        </Button>
                        <Button className="gap-2 sm:flex-1 shadow-md shadow-babcock-blue/20" onClick={() => setIsAddUserModalOpen(true)}>
                            <UserPlus className="w-4 h-4" />
                            Add User
                        </Button>
                    </div>
                </div>

                <div className="bg-white ring-1 ring-slate-200 shadow-sm rounded-lg flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                        <SearchBar
                            placeholder="Find by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full sm:w-72"
                        />
                        <div className="w-full sm:w-48">
                            <Select
                                value={roleFilter}
                                onChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}
                                options={[
                                    { label: "All Roles", value: "all" },
                                    { label: "Students", value: "student" },
                                    { label: "Lecturers", value: "lecturer" },
                                    { label: "Administrators", value: "admin" }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <DataTable
                            data={paginatedUsers}
                            columns={columns}
                            emptyTitle="No users found."
                        />
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

            </div>

            {/* Empty States / Modals */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Create New User"
                description="Manually provision a new account. An invitation email will be sent automatically."
                maxWidth="md"
            >
                <form onSubmit={handleAddUserSubmit} className="space-y-4 pt-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                            <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                            <input required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Institutional Email</label>
                        <input required type="email" placeholder="@student.babcock.edu.ng or @babcock.edu.ng" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                            <Select
                                value="student"
                                onChange={() => { }}
                                options={[
                                    { label: "Student", value: "student" },
                                    { label: "Lecturer", value: "lecturer" },
                                    { label: "Admin", value: "admin" }
                                ]}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">ID Number</label>
                            <input required type="text" placeholder="e.g. 21/0432 or STAFF-10" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue transition" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Provision Account</Button>
                    </div>
                </form>
            </Modal>


            <Modal
                isOpen={isBulkUploadModalOpen}
                onClose={() => setIsBulkUploadModalOpen(false)}
                title="Bulk Import Users"
                description="Upload a CSV spreadsheet to massively register students or staff at once."
                maxWidth="lg"
            >
                <div className="mt-4">
                    {/* Stylized Drag and Drop UI Guardrail Implementation */}
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 ease-in-out cursor-pointer group ${isDragging
                            ? 'border-babcock-blue bg-blue-50/50 scale-[1.02]'
                            : 'border-slate-300 bg-slate-50 hover:border-babcock-blue/50 hover:bg-slate-100'
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleBulkUpload(); }}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-babcock-blue text-white' : 'bg-white text-slate-400 group-hover:bg-blue-100 group-hover:text-babcock-blue shadow-sm'
                            }`}>
                            <FileUp className={`w-8 h-8 ${isDragging ? 'animate-bounce' : ''}`} />
                        </div>

                        <h3 className="text-lg font-bold font-display text-slate-800 mb-1">
                            {isDragging ? 'Drop CSV File Here' : 'Drag & Drop your CSV file here'}
                        </h3>
                        <p className="text-sm text-slate-500 text-center mb-6 max-w-[250px]">
                            Ensure columns are formatted as: FirstName, LastName, Email, Role, ID
                        </p>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".csv"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => { if (e.target.files?.length) handleBulkUpload(); }}
                            />
                            <div className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 shadow-sm pointer-events-none group-hover:border-babcock-blue/30 transition-colors">
                                Browse Files
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                            <strong>Important:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-1 opacity-80">
                                <li>Max file size is 5MB.</li>
                                <li>Duplicate IDs will be skipped.</li>
                                <li>Welcome emails will be queued automatically.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onSave={handleEditSave}
            />
        </DashboardLayout>
    );
}

