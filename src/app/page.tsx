import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="bg-background-dark text-white font-display overflow-x-hidden antialiased selection:bg-primary/30 selection:text-white">
      {/* Aurora Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#051025]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 text-primary">
              <Image src="/icons/shield-check.svg" alt="" width={24} height={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VeriPoint</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#features">
              Features
            </a>
            <a className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="#how-it-works">
              How it Works
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <a className="hidden sm:block text-sm font-bold text-white hover:text-primary transition-colors" href="#login">
              Log In
            </a>
            <button className="h-10 px-5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(15,73,189,0.5)] flex items-center gap-2">
              Get Started
              <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Student Project</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
              Attendance Verified. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-400">
                Anywhere on Campus.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 font-light leading-relaxed max-w-lg">
              A geolocation-based attendance management system designed for educational institutions, featuring dynamic zone verification and real-time synchronization.
            </p>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative z-10 animate-float">
            <div className="glass-panel rounded-3xl p-6 shadow-2xl shadow-primary/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Admin Dashboard</h3>
                    <p className="text-slate-400 text-sm">Live Preview</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-panel rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-white">247</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Image src="/icons/arrow-up.svg" alt="" width={12} height={12} className="text-green-500" />
                    <span className="text-xs text-green-500">+12%</span>
                  </div>
                </div>

                <div className="glass-panel rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-1">Avg Attendance</p>
                  <p className="text-2xl font-bold text-white">89%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Image src="/icons/arrow-up.svg" alt="" width={12} height={12} className="text-green-500" />
                    <span className="text-xs text-green-500">+5%</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-sm">Recent Activity</h4>
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Image src="/icons/check-circle.svg" alt="" width={16} height={16} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">John Doe marked present</p>
                      <p className="text-slate-500 text-xs">2 min ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Image src="/icons/check-circle.svg" alt="" width={16} height={16} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Jane Smith marked present</p>
                      <p className="text-slate-500 text-xs">5 min ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Core Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Advanced geolocation technology combined with secure authentication for reliable attendance tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Geofencing */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/location-marker.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dynamic Geofencing</h3>
              <p className="text-slate-400 text-sm">
                Create custom polygon zones for any classroom or campus location with precision mapping.
              </p>
              <div className="mt-4 h-24 bg-slate-900/50 rounded-xl flex items-center justify-center border border-white/5">
                <Image src="/icons/location-pin.svg" alt="" width={64} height={64} className="text-primary/30" />
              </div>
            </div>

            {/* Feature 2: Time-based Codes */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/lock.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Time-based Verification</h3>
              <p className="text-slate-400 text-sm">
                One-time codes that expire automatically to prevent attendance fraud and proxy marking.
              </p>
              <div className="mt-4 h-24 bg-slate-900/50 rounded-xl flex items-center justify-center border border-white/5">
                <div className="flex items-center gap-2">
                  <Image src="/icons/clock.svg" alt="" width={20} height={20} className="text-accent" />
                  <span className="text-2xl font-mono font-bold text-white animate-pulse">04:59</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Analytics */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/chart-bar.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Real-time Analytics</h3>
              <p className="text-slate-400 text-sm">Instant dashboards and reports for faculty and administrators.</p>
              <div className="mt-4 h-24 flex items-end gap-2 px-2 pb-2 border-b border-l border-white/10 rounded-bl-lg">
                <div className="w-1/5 bg-primary/30 h-[40%] rounded-t-sm"></div>
                <div className="w-1/5 bg-primary/40 h-[60%] rounded-t-sm"></div>
                <div className="w-1/5 bg-primary/60 h-[30%] rounded-t-sm"></div>
                <div className="w-1/5 bg-accent/80 h-[80%] rounded-t-sm shadow-[0_0_15px_rgba(255,193,7,0.4)]"></div>
                <div className="w-1/5 bg-primary/50 h-[50%] rounded-t-sm"></div>
              </div>
            </div>

            {/* Feature 4: Integration */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/refresh.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">LMS Integration</h3>
              <p className="text-slate-400 text-sm">Seamlessly sync attendance data with existing learning management systems.</p>
              <div className="mt-6 flex items-center gap-4 opacity-70 grayscale group-hover:grayscale-0 transition-all">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center p-2">
                  <div className="w-full h-full bg-blue-500 rounded-sm"></div>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#464eb8] flex items-center justify-center p-2">
                  <div className="w-full h-full bg-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Feature 5: Mobile First */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/device-mobile.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile-First Design</h3>
              <p className="text-slate-400 text-sm">
                Optimized mobile experience for students with intuitive interface and quick check-ins.
              </p>
              <div className="mt-4 h-24 bg-slate-900/50 rounded-xl flex items-center justify-center border border-white/5">
                <div className="flex gap-2">
                  <div className="w-16 h-20 bg-primary/20 rounded-lg border-2 border-primary/40"></div>
                  <div className="w-16 h-20 bg-primary/10 rounded-lg border border-primary/20"></div>
                </div>
              </div>
            </div>

            {/* Feature 6: Security */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden group glass-card-hover transition-all duration-300">
              <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white mb-4">
                <Image src="/icons/shield-check.svg" alt="" width={24} height={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-400 text-sm">
                End-to-end encryption and privacy-focused design protecting student location data.
              </p>
              <div className="mt-4 h-24 bg-slate-900/50 rounded-xl flex items-center justify-center border border-white/5">
                <Image src="/icons/shield-check-filled.svg" alt="" width={48} height={48} className="text-green-500/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section id="how-it-works" className="py-20 border-t border-white/5 bg-[#020617]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">System Workflow</h2>
            <p className="text-slate-400 mt-2">How the attendance verification process works</p>
          </div>
          
          <div className="relative">
            {/* Vertical Line for mobile, horizontal for desktop */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary md:hidden"></div>
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative flex md:flex-col items-center md:text-center gap-6">
                <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(15,73,189,0.4)]">
                  <Image src="/icons/pencil.svg" alt="" width={24} height={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">1. Zone Creation</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Instructor or administrator defines attendance zone using interactive map interface.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex md:flex-col items-center md:text-center gap-6">
                <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-accent flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                  <Image src="/icons/location-marker.svg" alt="" width={24} height={24} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">2. Location Verification</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Student enters defined zone and system verifies GPS coordinates in real-time.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex md:flex-col items-center md:text-center gap-6">
                <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(15,73,189,0.4)]">
                  <Image src="/icons/check.svg" alt="" width={24} height={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">3. Record & Sync</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Attendance is recorded and synchronized with the database and LMS automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#020617] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icons/shield-check.svg" alt="" width={28} height={28} className="text-primary" />
                <h4 className="text-xl font-bold text-white">VeriPoint</h4>
              </div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                An innovative geolocation-based attendance management system for educational institutions. Final year computer science project.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#how-it-works">How it Works</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-4">Project</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">GitHub</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2024 VeriPoint. Student Final Year Project.</p>
            <div className="flex gap-4">
              <a className="text-slate-500 hover:text-white transition-colors" href="#">
                <span className="sr-only">GitHub</span>
                <Image src="/icons/github.svg" alt="" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}