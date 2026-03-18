"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, Download, AlertTriangle, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ExportModal } from "@/components/ui/ExportModal";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import { useLecturerCoursesSummary } from "@/hooks/useLecturerData";



export default function LecturerReports() {
    const [filterCourse, setFilterCourse] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const itemsPerPage = 5;

    const { data: courses = [], isLoading } = useLecturerCoursesSummary();

    const filteredData: any[] = []; // Replaced backend logic placeholder

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSendWarning = (studentName: string) => {
        toast.success(`Warning email dispatched to ${studentName}`);
    };

    // In a real app this would be computed or fetched from the backend. 
    const atRiskStudents: any[] = []; // Currently no backend logic to drive this

    return (
        <DashboardLayout role="lecturer">
            <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center bg-neutral-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <EmptyState
                    icon={FileText}
                    title="No Reports Available"
                    description="Detailed cross-course reports are under development. Use the Active Session view to manage current class attendance."
                />
            </div>
        </DashboardLayout>
    );
}
