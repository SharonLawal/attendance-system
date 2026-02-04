"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/constants/icons";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-primary-light p-2 rounded-xl shadow-lg shadow-primary/20">
              <Icons.Location size={24} className="text-secondary" />
            </div>
            <span className="text-2xl font-black text-primary tracking-tight">
              Veri<span className="text-slate-400">Point</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
            <Link
              href="#features"
              className="hover:text-primary transition-all hover:scale-105"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-primary transition-all hover:scale-105"
            >
              Workflow
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="hidden sm:flex border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="shadow-xl shadow-primary/25 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
