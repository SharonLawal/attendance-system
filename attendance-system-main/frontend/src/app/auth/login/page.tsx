"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { login } from "@/lib/auth-utils";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "Student",
      email: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const getPlaceholder = () => {
    switch (selectedRole) {
      case "Student":
        return "student.name@babcock.edu.ng";
      case "Lecturer":
        return "lecturer.name@babcock.edu.ng";
      case "Admin":
        return "admin@babcock.edu.ng";
      default:
        return "email@babcock.edu.ng";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await login(data);

      if (result.success) {
        if (data.role === "Student") router.push("/student/layout");
        if (data.role === "Lecturer") router.push("/lecturer/dashboard");
        if (data.role === "Admin") router.push("/admin/dashboard");
      } else {
        setServerError(result.message);
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
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
            <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
              <ShieldCheck size={20} className="text-yellow-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              VeriPoint
            </span>
          </div>

          {/* Hero Text */}
          <div className="relative">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Secure Attendance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                Made Simple.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              The official geolocation-based attendance platform for Babcock
              University. Ensure academic integrity with precise verification.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={24} />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              VeriPoint
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[420px] flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500">
                Sign in to your Babcock University account.
              </p>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                {serverError}
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                I am a...
              </label>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(["Student", "Lecturer", "Admin"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setValue("role", role)}
                    className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                      selectedRole === role
                        ? "bg-white text-primary shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
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
                    {...register("email")}
                    type="email"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.email ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-xl focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder={getPlaceholder()}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.password ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-xl focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder="••••••••"
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
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="mt-2 w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3.5 px-4 rounded-xl transition-all transform active:scale-[0.99] shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={20} className="text-yellow-400" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                New to VeriPoint?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-primary hover:underline transition-all"
                >
                  Create Student Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
