"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }

        if (!email.endsWith("@babcock.edu.ng") && !email.endsWith("@student.babcock.edu.ng")) {
            setError("Please enter a valid official Babcock University email");
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call to send reset link
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsSuccess(true);
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white">
            {/* Left Side */}
            <div className="hidden lg:flex relative w-1/2 h-full bg-[#051025] flex-col justify-between p-16 overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-secondary opacity-10 blur-[80px]"></div>

                <div className="relative z-10 flex flex-col gap-28">
                    {/* Top Logo Area */}
                    <div className="relative flex items-center gap-3">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                            <ShieldCheck size={20} className="text-yellow-400" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide">
                            VeriPoint
                        </span>
                    </div>

                    {/* Hero Text */}
                    <div className="relative">
                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Reset Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                                Password.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                            Don't worry, it happens to the best of us. Just enter your
                            institutional email address and we'll send you a link to reset your
                            password.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden p-6 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-primary" size={24} />
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            VeriPoint
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-[420px] flex flex-col gap-8">
                        <div className="flex items-center">
                            <Link
                                href="/login"
                                className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                                    <ArrowLeft size={16} />
                                </div>
                                Back to Login
                            </Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Forgot password?
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                No worries! Enter the email address associated with your account
                                and we'll send you a reset link.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        {isSuccess ? (
                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in duration-500">
                                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Link Sent!</h3>
                                <p className="text-slate-600 text-sm mb-2">
                                    We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                                </p>
                                <Link href="/login" className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg shadow-sm transition-all">
                                    Return to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700">
                                        Institutional Email
                                    </label>
                                    <div className="relative group">
                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                                        />
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 focus:ring-primary/20 focus:border-primary rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium"
                                            placeholder="email@babcock.edu.ng"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="mt-4 w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3.5 px-4 rounded-lg transition-all transform active:scale-[0.99] shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin text-white" />
                                    ) : (
                                        <span>Send Reset Link</span>
                                    )}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
