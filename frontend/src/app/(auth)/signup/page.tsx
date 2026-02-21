"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  User,
  Mail,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { signupSchema, SignupFormData } from "@/lib/validations/auth";
import { signup } from "@/lib/auth-utils";

export default function SignupPage() {
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
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      idNumber: "",
      role: "Student",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  });

  const selectedRole = watch("role");

  const getIDLabel = () =>
    selectedRole === "Student" ? "Matriculation Number" : "Staff ID Number";
  const getIDPlaceholder = () =>
    selectedRole === "Student" ? "e.g., 22/0987" : "e.g., BU/ST/123";

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await signup({
        ...data,
        studentId: data.idNumber,
      });
      if (result.success) {
        router.push("/login");
      } else {
        setServerError(result.message);
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
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
        <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] bg-primary opacity-20 blur-[120px]"></div>

        {/* Floating Icon */}
        <div className="absolute top-1/4 right-1/4 animate-bounce duration-[4000ms]">
          <GraduationCap size={180} className="text-white/5 rotate-12" />
        </div>

        {/* Top Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
            <MapPin size={20} className="text-yellow-400" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            VeriPoint
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Start Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
              Journey Here.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Create your account to access real-time attendance tracking,
            analytics, and seamless LMS integration.
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary" size={24} />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              VeriPoint
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[420px] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-500">
                Join the platform to get started.
              </p>
            </div>

            {/* Error Banner */}
            {serverError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
                {serverError}
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                Account Type
              </label>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                {(["Student", "Lecturer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setValue("role", role)}
                    className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${selectedRole === role
                        ? "bg-white text-primary shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Signup Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("fullName")}
                    type="text"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.fullName ? "border-red-500" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder="e.g. Sharon Lawal"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Babcock Email
                </label>
                <div className="relative group">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.email ? "border-red-500" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder="name@babcock.edu.ng"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  {getIDLabel()}
                </label>
                <div className="relative group">
                  <CreditCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("idNumber")}
                    type="text"
                    className={`w-full pl-11 pr-4 py-3.5 bg-white border ${errors.idNumber ? "border-red-500" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder={getIDPlaceholder()}
                  />
                </div>
                {errors.idNumber && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.password ? "border-red-500" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder="Create a password"
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

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                  />
                  <input
                    {...register("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-3.5 bg-white border ${errors.confirmPassword ? "border-red-500" : "border-slate-300 focus:ring-primary/20 focus:border-primary"} rounded-lg focus:outline-none focus:ring-4 transition-all text-slate-900 placeholder-slate-400 font-medium`}
                    placeholder="Repeat password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 mt-2">
                <input
                  {...register("terms")}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  type="checkbox"
                  id="terms"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-slate-500 font-medium leading-relaxed"
                >
                  I verify that I am a member of Babcock University and agree to
                  the{" "}
                  <Link
                    href="#"
                    className="text-primary hover:text-secondary font-bold"
                  >
                    Terms of Service
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.terms.message}
                </p>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="mt-2 w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-4 rounded-lg transition-all transform active:scale-[0.99] shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} className="text-yellow-400" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline transition-all"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

