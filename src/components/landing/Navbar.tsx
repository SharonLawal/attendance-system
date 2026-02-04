import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#051025]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-yellow-400/10 rounded-lg flex items-center justify-center border border-yellow-400/20 text-yellow-400">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VeriPoint</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#how-it-works">
            How it Works
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link className="hidden sm:block text-sm font-bold text-white hover:text-yellow-400 transition-colors" href="/auth/login">
            Log In
          </Link>
          <Link href="/auth/signup">
            <button className="h-10 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(15,73,189,0.5)] flex items-center gap-2">
              Get Started
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}