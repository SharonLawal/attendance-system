"use client";

/**
 * @fileoverview Contextual execution boundary for frontend/src/components/lecturer/CreateCourseModal.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { BookOpen, Hash, Users, Activity, FileText } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

const createCourseSchema = z.object({
    courseCode: z.string()
        .toUpperCase()
        .regex(/^[A-Z]{4}[0-9]{3}(-[A-Z0-9]+)?$/, "Format required: COMP101 or COMP101-A"),
    courseName: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name cannot exceed 100 characters"),
    department: z.string().optional(),
    credits: z.number().min(1).max(6).optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema),
        mode: "onChange",
        defaultValues: {
            courseCode: "",
            courseName: "",
            department: "",
            credits: 3,
            capacity: 50,
        },
    });

    const onSubmit = async (data: CreateCourseFormData) => {
        setIsSubmitting(true);
        try {
            await apiClient.post("/api/courses", data);
            toast.success("Course created successfully!");
            reset();
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create course.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create New Course"
            description="Define the parameters for a new class session. This will become available immediately for attendance tracking."
            maxWidth="md"
            footer={
                <>
                    <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!isValid || isSubmitting}
                        className="gap-2 bg-babcock-blue hover:bg-babcock-blue/90"
                    >
                        {isSubmitting ? (
                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                            <BookOpen className="w-4 h-4" />
                        )}
                        {isSubmitting ? "Creating..." : "Create Course"}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 pb-4">

                {/* Course Code */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Course Code <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-babcock-blue transition-colors" />
                        <input
                            {...register("courseCode")}
                            type="text"
                            placeholder="e.g. COMP101"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.courseCode ? "border-red-500" : "border-slate-200 focus:border-babcock-blue"} rounded-lg focus:outline-none focus:ring-1 focus:ring-babcock-blue transition-all uppercase placeholder:normal-case`}
                        />
                    </div>
                    {errors.courseCode && <p className="text-xs text-red-500 font-medium">{errors.courseCode.message}</p>}
                </div>

                {/* Course Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Course Title <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-babcock-blue transition-colors" />
                        <input
                            {...register("courseName")}
                            type="text"
                            placeholder="e.g. Intro to Computer Science"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.courseName ? "border-red-500" : "border-slate-200 focus:border-babcock-blue"} rounded-lg focus:outline-none focus:ring-1 focus:ring-babcock-blue transition-all`}
                        />
                    </div>
                    {errors.courseName && <p className="text-xs text-red-500 font-medium">{errors.courseName.message}</p>}
                </div>

                {/* Department (Optional) */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Department</label>
                    <div className="relative group">
                        <Activity size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-babcock-blue transition-colors" />
                        <input
                            {...register("department")}
                            type="text"
                            placeholder="e.g. Computing Sciences"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-babcock-blue rounded-lg focus:outline-none focus:ring-1 focus:ring-babcock-blue transition-all"
                        />
                    </div>
                </div>

                {/* Row: Credits & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex justify-between">
                            Capacity
                        </label>
                        <div className="relative group">
                            <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-babcock-blue transition-colors" />
                            <input
                                {...register("capacity", { valueAsNumber: true })}
                                type="number"
                                min="1"
                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.capacity ? "border-red-500" : "border-slate-200 focus:border-babcock-blue"} rounded-lg focus:outline-none focus:ring-1 focus:ring-babcock-blue transition-all`}
                            />
                        </div>
                        {errors.capacity && <p className="text-xs text-red-500 font-medium">{errors.capacity.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 flex justify-between">
                            Credits
                        </label>
                        <div className="relative group">
                            <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-babcock-blue transition-colors" />
                            <input
                                {...register("credits", { valueAsNumber: true })}
                                type="number"
                                min="1"
                                max="6"
                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.credits ? "border-red-500" : "border-slate-200 focus:border-babcock-blue"} rounded-lg focus:outline-none focus:ring-1 focus:ring-babcock-blue transition-all`}
                            />
                        </div>
                        {errors.credits && <p className="text-xs text-red-500 font-medium">{errors.credits.message}</p>}
                    </div>
                </div>

            </form>
        </Modal>
    );
}
