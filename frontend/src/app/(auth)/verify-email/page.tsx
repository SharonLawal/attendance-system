"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, Mail } from "lucide-react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            router.push("/signup");
        }
    }, [email, router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split("");
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            toast.error("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiClient.post("/api/auth/verify-email", {
                email,
                otp: otpString,
            });

            toast.success("Email verified successfully!");

            const role = response.data.data.userRole || response.data.data.role;
            const dashboardPath =
                role === "Admin"
                    ? "/admin/dashboard"
                    : role === "Lecturer"
                        ? "/lecturer/dashboard"
                        : "/student/dashboard";

            router.push(dashboardPath);
        } catch (error: any) {
            if (error.response?.data?.code === "OTP_EXPIRED") {
                toast.error("Verification code expired. Please request a new one.");
            } else if (error.response?.data?.code === "TOO_MANY_ATTEMPTS") {
                toast.error("Too many failed attempts. Please request a new code.");
            } else {
                toast.error(error.response?.data?.message || "Verification failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await apiClient.post("/api/auth/resend-verification", { email });
            toast.success("New verification code sent!");
            setCountdown(60);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend code");
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 relative z-10 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#003366]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-[#003366]" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        We sent a 6-digit code to <br />
                        <span className="font-bold text-slate-800">{email}</span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="flex gap-2 sm:gap-3 justify-center mb-8" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 outline-none transition-all bg-slate-50 focus:bg-white text-slate-900"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.some((d) => !d)}
                    className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-[#003366]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin text-white" />
                    ) : (
                        <>
                            Verify Email <ShieldCheck size={20} className="text-yellow-400" />
                        </>
                    )}
                </button>

                {/* Resend */}
                <div className="text-center mt-8">
                    {!canResend ? (
                        <p className="text-sm text-slate-500 font-medium">
                            Didn't receive the code?{" "}
                            <span className="text-slate-400">Resend in {countdown}s</span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            className="text-sm text-[#003366] font-bold hover:underline transition-all"
                        >
                            Resend verification code
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
