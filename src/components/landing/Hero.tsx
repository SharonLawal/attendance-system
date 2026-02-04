import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-6 z-10 max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
            Attendance Verified. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-400">
              Anywhere on Campus.
            </span>
          </h1>

          <p className="text-lg text-slate-400 font-light leading-relaxed max-w-lg">
            A geolocation-based attendance management system designed for
            educational institutions, featuring dynamic zone verification and
            real-time synchronization.
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
                  <Image
                    src="/icons/arrow-up.svg"
                    alt=""
                    width={12}
                    height={12}
                    className="text-green-500"
                  />
                  <span className="text-xs text-green-500">+12%</span>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4">
                <p className="text-slate-400 text-xs mb-1">Avg Attendance</p>
                <p className="text-2xl font-bold text-white">89%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Image
                    src="/icons/arrow-up.svg"
                    alt=""
                    width={12}
                    height={12}
                    className="text-green-500"
                  />
                  <span className="text-xs text-green-500">+5%</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-sm">
                  Recent Activity
                </h4>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Image
                      src="/icons/check-circle.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="text-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      John Doe marked present
                    </p>
                    <p className="text-slate-500 text-xs">2 min ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Image
                      src="/icons/check-circle.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="text-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      Jane Smith marked present
                    </p>
                    <p className="text-slate-500 text-xs">5 min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
