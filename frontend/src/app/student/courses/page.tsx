import Image from "next/image";
import Link from "next/link";

export default function StudentCourses() {
  const courses = [
    { code: "CSC 301", name: "Data Structures & Algorithms", lecturer: "Dr. Mensah Yaw", units: 3, attendance: 92, schedule: "Mon, Wed 10:00 AM", location: "Lecture Hall A" },
    { code: "CSC 305", name: "Database Systems", lecturer: "Dr. Sarah Chen", units: 3, attendance: 88, schedule: "Tue, Thu 2:00 PM", location: "Lab Building" },
    { code: "CSC 320", name: "Web Development", lecturer: "Prof. James Wilson", units: 4, attendance: 85, schedule: "Wed, Fri 4:00 PM", location: "Computer Lab 2" },
    { code: "GEDS 400", name: "Entrepreneurship", lecturer: "Dr. Michael Brown", units: 2, attendance: 68, schedule: "Mon 12:00 PM", location: "Business Hall" },
    { code: "MTH 202", name: "Linear Algebra", lecturer: "Dr. Emily Davis", units: 3, attendance: 90, schedule: "Tue, Thu 10:00 AM", location: "Math Building" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Semester 2, 2025/2026 Academic Session</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">Total Units</p>
          <p className="text-2xl font-bold text-gray-900">15</p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.code} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Color Bar */}
            <div className={`h-2 ${course.attendance >= 75 ? 'bg-blue-600' : 'bg-red-500'}`}></div>
            
            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md mb-2">
                    {course.code}
                  </span>
                  <h3 className="font-bold text-gray-900">{course.name}</h3>
                </div>
                <span className="text-xs text-gray-500">{course.units} Units</span>
              </div>

              {/* Lecturer */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Image src="/dashboard-icons/user.svg" alt="" width={16} height={16} className="opacity-50" />
                <span>{course.lecturer}</span>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Image src="/dashboard-icons/clock.svg" alt="" width={16} height={16} className="opacity-50" />
                <span>{course.schedule}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Image src="/dashboard-icons/map-pin.svg" alt="" width={16} height={16} className="opacity-50" />
                <span>{course.location}</span>
              </div>

              {/* Attendance Progress */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Attendance</span>
                  <span className={`text-sm font-bold ${course.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {course.attendance}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${course.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${course.attendance}%` }}
                  ></div>
                </div>
                {course.attendance < 75 && (
                  <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Below 75% threshold</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}