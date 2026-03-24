"use client";

/**
 * @fileoverview Contextual execution boundary for frontend/src/app/(auth)/reset-password/page.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Loader2, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[\W_]/, "Password must contain at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const password = watch("password");

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token || !email) {
            toast.error("Invalid reset link");
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.put(`/api/auth/reset-password/${token}`, {
                email,
                password: data.password,
            });

            toast.success("Password reset successful! You can now login.");
            router.push("/login");
        } catch (error: any) {
            if (error.response?.data?.code === "INVALID_TOKEN") {
                toast.error("This reset link has expired. Please request a new one.");
            } else {
                toast.error(error.response?.data?.message || "Password reset failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-12 text-center max-w-md w-full relative z-10 border border-slate-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Invalid Reset Link
                    </h1>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        This password reset link is invalid or has expired. Please request a
                        new link to regain access securely.
                    </p>
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                    >
                        Request new link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-white">
            {/* Left Side */}
            <div className="hidden lg:flex relative w-1/2 h-full bg-[#051025] flex-col justify-between p-16 overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

                <div className="relative z-10 flex flex-col gap-28">
                    <div className="relative flex items-center gap-3">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                            <ShieldCheck size={20} className="text-yellow-400" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide">
                            VeriPoint
                        </span>
                    </div>

                    <div className="relative">
                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Create New <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                                Password.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                            We highly recommend creating a unique password that you haven't used
                            for any other university portals.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden p-6 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#003366]" size={24} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            VeriPoint
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-[420px] flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Reset Password
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Enter your new secure password for <strong>{email}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003366] transition-colors"
                                    />
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.password
                                            ? "border-red-500"
                                            : "border-slate-300 focus:ring-[#003366]/20 focus:border-[#003366]"
                                            } rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 font-medium`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                                        {errors.password.message}
                                    </p>
                                )}
                                {password && <PasswordStrengthIndicator password={password} />}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-sm font-bold text-slate-700">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003366] transition-colors"
                                    />
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.confirmPassword
                                            ? "border-red-500"
                                            : "border-slate-300 focus:ring-[#003366]/20 focus:border-[#003366]"
                                            } rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 font-medium`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 font-medium mt-1 ml-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-[#003366]/20 flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin text-white" />
                                ) : (
                                    <>
                                        Reset Password
                                        <ShieldCheck size={20} className="text-yellow-400" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 rounded-full border-4 border-[#003366]/30 border-t-[#003366] animate-spin" />
            </div>
        }>
            <ResetPasswordFormContent />
        </Suspense>
    );
}
