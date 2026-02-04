"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<"student" | "lecturer" | "admin">("student");

  return (
    <div className="font-display bg-background-dark text-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Aurora Background Mesh */}
      <div className="absolute inset-0 aurora-gradient pointer-events-none z-0"></div>
      
      {/* 3D Decor Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 right-20 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-gold-accent/20 rounded-full blur-[80px]"></div>
      </div>

      {/* 3D Floating Pin Image */}
      <div className="absolute top-[10%] left-[60%] md:left-[55%] w-64 h-64 z-0 floating-pin opacity-80 pointer-events-none hidden md:block">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-primary/40 rounded-full blur-3xl"></div>
          <Image 
            src="/icons/location-pin.svg" 
            alt="" 
            width={256} 
            height={256}
            className="relative z-10 drop-shadow-[0_20px_50px_rgba(37,106,244,0.5)]"
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        {/* Main Glass Card */}
        <div className="glass-card w-full max-w-md rounded-[2.5rem] p-8 sm:p-12 flex flex-col items-center gap-8">
          {/* Logo Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Image src="/icons/location-pin.svg" alt="" width={36} height={36} className="text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-white">VeriPoint</h1>
            </div>
            <p className="text-slate-400 text-sm font-medium">Educational Attendance Platform</p>
          </div>

          {/* Role Switcher (Tabs) */}
          <div className="w-full bg-black/20 p-1.5 rounded-full flex relative">
            <button
              onClick={() => setActiveRole("student")}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-full transition-all duration-300 text-sm font-bold z-10 ${
                activeRole === "student"
                  ? "bg-primary shadow-lg shadow-primary/25 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setActiveRole("lecturer")}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-full transition-all duration-300 text-sm font-bold z-10 ${
                activeRole === "lecturer"
                  ? "bg-primary shadow-lg shadow-primary/25 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Lecturer
            </button>
            <button
              onClick={() => setActiveRole("admin")}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-full transition-all duration-300 text-sm font-bold z-10 ${
                activeRole === "admin"
                  ? "bg-primary shadow-lg shadow-primary/25 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form className="w-full flex flex-col gap-5">
            {/* Email Field */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="Email Address"
                type="email"
              />
            </div>

            {/* Password Field */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                className="w-full bg-black/20 border border-white/10 rounded-full py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember / Forgot Row */}
            <div className="flex items-center justify-between text-xs sm:text-sm px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-black/20 checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                    type="checkbox"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a className="text-primary hover:text-primary/80 transition-colors font-medium" href="#">
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              className="mt-2 w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold py-4 rounded-full shadow-[0_0_20px_rgba(37,106,244,0.4)] hover:shadow-[0_0_30px_rgba(37,106,244,0.6)] transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
              type="submit"
            >
              <span>Sign In</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-white font-bold hover:underline decoration-primary decoration-2 underline-offset-4 ml-1">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}