import { 
  MapPin, 
  Lock, 
  BarChart3, 
  RefreshCcw, 
  Smartphone, 
  ShieldCheck, 
  Database,
  ArrowRightLeft
} from 'lucide-react';

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-white/5 bg-[#051025]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Core Features</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Built with a focus on security, speed, and seamless integration for the modern campus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: Geofencing */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-400/10 blur-2xl group-hover:bg-yellow-400/20 transition-all"></div>
            
            <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Dynamic Geofencing</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Create custom polygon zones for precise classroom mapping, preventing &quot;boundary overlap&quot; common in radius-based systems.
            </p>
            
            {/* Visual: Abstract Map */}
            <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 flex flex-col items-center">
                 <div className="h-16 w-16 border-2 border-dashed border-yellow-400/50 rounded-lg flex items-center justify-center animate-[pulse_3s_infinite]">
                    <div className="h-3 w-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                 </div>
                 <span className="text-[10px] text-yellow-400/70 mt-2 font-mono uppercase tracking-widest">Zone Active</span>
              </div>
            </div>
          </div>

          {/* Feature 2: Time-based Codes */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
             <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <Lock size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Time-based Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              One-time codes that expire automatically to prevent attendance fraud and proxy marking.
            </p>
            
            {/* Visual: Countdown */}
            <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-center justify-center gap-4">
               <div className="flex flex-col items-center">
                 <div className="text-3xl font-mono font-bold text-white tracking-widest">
                   84<span className="text-yellow-400 animate-pulse">9</span>2
                 </div>
                 <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-400 w-2/3"></div>
                 </div>
                 <span className="text-[10px] text-slate-500 mt-2">Expires in 14s</span>
               </div>
            </div>
          </div>

          {/* Feature 3: Analytics */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
             <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <BarChart3 size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Real-time Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Instant attendance reports and exportable data for faculty members and administrators.
            </p>
            
            {/* Visual: Bar Graph */}
             <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-end justify-center gap-3 pb-4 px-8">
                <div className="w-8 bg-white/10 h-[40%] rounded-t-sm"></div>
                <div className="w-8 bg-white/10 h-[65%] rounded-t-sm"></div>
                <div className="w-8 bg-yellow-400 h-[85%] rounded-t-sm shadow-[0_0_15px_rgba(250,204,21,0.3)]"></div>
                <div className="w-8 bg-white/10 h-[55%] rounded-t-sm"></div>
             </div>
          </div>

          {/* Feature 4: LMS Integration (Redesigned) */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
             <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <RefreshCcw size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Seamless Sync</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Seamlessly sync attendance data with existing learning management systems.
            </p>
            
            {/* Visual: Data Pipeline */}
            <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-center justify-evenly px-4">
               {/* Left Node (App) */}
               <div className="h-10 w-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-yellow-400" />
               </div>
               
               {/* Connection Line */}
               <div className="flex-1 h-0.5 bg-white/10 relative mx-2">
                  <div className="absolute inset-0 bg-yellow-400 w-1/2 animate-[shimmer_2s_infinite]"></div>
                  <div className="absolute -top-1.5 left-1/2 bg-[#0B162C] p-0.5 rounded-full border border-white/10">
                    <ArrowRightLeft size={10} className="text-slate-400" />
                  </div>
               </div>
               
               {/* Right Node (LMS) */}
               <div className="h-10 w-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                  <Database size={18} className="text-blue-400" />
               </div>
            </div>
          </div>

          {/* Feature 5: Mobile First */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
             <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <Smartphone size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Mobile Optimized</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A responsive, lightweight interface designed for quick check-ins on any student device.
            </p>
             <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="w-16 h-24 border-2 border-white/10 rounded-lg bg-slate-900 relative flex flex-col items-center pt-2">
                   <div className="h-1 w-6 bg-white/10 rounded-full mb-2"></div>
                   <div className="w-10 h-12 bg-white/5 rounded-sm"></div>
                   <div className="h-2 w-8 bg-yellow-400 rounded-full mt-3"></div>
                </div>
             </div>
          </div>

          {/* Feature 6: Security */}
          <div className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition-all duration-500">
             <div className="h-12 w-12 bg-slate-800/80 rounded-lg flex items-center justify-center text-yellow-400 mb-6 border border-white/10 shadow-lg shadow-black/20">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Secure & Private</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              End-to-end encryption and privacy-focused design protecting student location data.
            </p>
             <div className="relative h-32 w-full rounded-lg bg-[#0B162C] border border-white/5 overflow-hidden flex items-center justify-center">
               <ShieldCheck size={64} className="text-yellow-400/10 absolute" />
               <div className="h-2 w-2 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,1)]"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
