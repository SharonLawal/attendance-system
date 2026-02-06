import { User, Mail, Hash, MapPin } from "lucide-react";

export default function StudentProfile() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#003366]">My Profile</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="h-32 bg-[#003366]"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="size-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
              SL
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <div className="flex items-center gap-3 mt-1 text-slate-800 font-medium">
                  <User size={18} className="text-[#FBBF24]" />
                  Sharon Lawal
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Matric Number</label>
                <div className="flex items-center gap-3 mt-1 text-slate-800 font-medium">
                  <Hash size={18} className="text-[#FBBF24]" />
                  22/0234
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <div className="flex items-center gap-3 mt-1 text-slate-800 font-medium">
                  <Mail size={18} className="text-[#FBBF24]" />
                  sharon.lawal@babcock.edu.ng
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                <div className="flex items-center gap-3 mt-1 text-slate-800 font-medium">
                  <MapPin size={18} className="text-[#FBBF24]" />
                  Software Engineering
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}