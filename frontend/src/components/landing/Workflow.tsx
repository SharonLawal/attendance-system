import { Pencil, MapPin, Check } from "lucide-react";

export function Workflow() {
  return (
    <section
      id="how-it-works"
      className="py-20 border-t border-white/5 bg-[#020617]"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">System Workflow</h2>
          <p className="text-slate-400 mt-2">
            The verification process as defined in the system architecture
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line for mobile, horizontal for desktop */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-yellow-400 to-primary md:hidden"></div>
          <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-yellow-400 to-primary"></div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1: Lecturer initiates */}
            <div className="relative flex md:flex-col items-center md:text-center gap-6">
              <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(15,73,189,0.4)]">
                <Pencil size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  1. Session Initiation
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Lecturer logs in, defines the classroom <strong>Geofence Polygon</strong>, and generates a time-sensitive <strong>One-Time Code (OTC)</strong>.
                </p>
              </div>
            </div>

            {/* Step 2: Student Verifies (Chapter 3.4.2) */}
            <div className="relative flex md:flex-col items-center md:text-center gap-6">
              <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <MapPin size={20} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  2. Dual-Factor Validation
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Student enters the OTC. The system simultaneously validates the code and verifies the device&apos;s <strong>GPS coordinates</strong> against the active zone.
                </p>
              </div>
            </div>

            {/* Step 3: System Syncs */}
            <div className="relative flex md:flex-col items-center md:text-center gap-6">
              <div className="z-10 h-12 w-12 rounded-full bg-[#020617] border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(15,73,189,0.4)]">
                <Check size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  3. Automated LMS Sync
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Upon successful verification, attendance is marked as &quot;Present&quot; and instantly pushed to the <strong>Learning Management System</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}