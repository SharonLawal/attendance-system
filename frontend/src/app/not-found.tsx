/**
 * @fileoverview Contextual execution boundary for frontend/src/app/not-found.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import Link from 'next/link';
import { Ghost, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#051025] flex flex-col items-center justify-center p-6 text-center font-display relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-lg">
        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <Ghost className="w-12 h-12 text-blue-400 animate-bounce" />
        </div>
        
        <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Page Not Found</h2>
        
        <p className="text-slate-400 mb-10 text-lg leading-relaxed">
          The page you are looking for has vanished into the digital void. It might have been moved, deleted, or you don't have permission to view it.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/" className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
