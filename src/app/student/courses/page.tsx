import { BookOpen, User, Clock } from "lucide-react";

export default function StudentCourses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#003366]">Registered Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-[#003366]"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-[#003366] px-3 py-1 rounded-md text-xs font-bold uppercase">
                  SENG 40{i}
                </div>
                <span className="text-xs text-slate-400">3 Units</span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-2">Software Engineering Process {i}</h3>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <User size={16} className="text-[#FBBF24]" />
                  <span>Dr. Mensah Yaw</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock size={16} className="text-[#FBBF24]" />
                  <span>Mon, Wed (9:00 AM)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Attendance</span>
                  <span className="font-bold text-[#003366]">92%</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}