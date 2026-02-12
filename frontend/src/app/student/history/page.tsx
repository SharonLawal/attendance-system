import Image from "next/image";

export default function StudentHistory() {
  const attendanceHistory = [
    { course: "CSC 301", name: "Data Structures", date: "Feb 4, 2026", time: "10:05 AM", location: "Lecture Hall A", method: "GPS + OTC", status: "present" },
    { course: "CSC 305", name: "Database Systems", date: "Feb 4, 2026", time: "2:05 PM", location: "Lab Building", method: "GPS + OTC", status: "present" },
    { course: "CSC 320", name: "Web Development", date: "Feb 3, 2026", time: "4:10 PM", location: "Computer Lab 2", method: "GPS + OTC", status: "present" },
    { course: "CSC 301", name: "Data Structures", date: "Feb 3, 2026", time: "10:03 AM", location: "Lecture Hall A", method: "GPS + OTC", status: "present" },
    { course: "GEDS 400", name: "Entrepreneurship", date: "Feb 2, 2026", time: "-", location: "-", method: "-", status: "absent" },
    { course: "MTH 202", name: "Linear Algebra", date: "Feb 2, 2026", time: "10:08 AM", location: "Math Building", method: "GPS + OTC", status: "present" },
    { course: "CSC 305", name: "Database Systems", date: "Feb 1, 2026", time: "2:03 PM", location: "Lab Building", method: "LMS Sync (Teams)", status: "online" },
    { course: "CSC 320", name: "Web Development", date: "Feb 1, 2026", time: "-", location: "-", method: "-", status: "absent" },
  ];

  const stats = {
    totalSessions: 48,
    present: 42,
    absent: 6,
    online: 4,
    percentage: 87.5
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-600 mt-1">Complete record of all attendance sessions</p>
        </div>
        <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>All Courses</option>
          <option>CSC 301</option>
          <option>CSC 305</option>
          <option>CSC 320</option>
          <option>GEDS 400</option>
          <option>MTH 202</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/calendar.svg" alt="" width={20} height={20} className="opacity-70" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/check-circle.svg" alt="" width={20} height={20} className="opacity-70" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/x-circle.svg" alt="" width={20} height={20} className="opacity-70" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/percent.svg" alt="" width={20} height={20} className="opacity-70" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-900">All Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{record.course}</p>
                    <p className="text-xs text-gray-600">{record.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.location}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {record.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'online' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' && <Image src="/dashboard-icons/check-circle.svg" alt="" width={12} height={12} />}
                      {record.status === 'online' && <Image src="/dashboard-icons/info.svg" alt="" width={12} height={12} />}
                      {record.status === 'absent' && <Image src="/dashboard-icons/x-circle.svg" alt="" width={12} height={12} />}
                      {record.status === 'present' ? 'Present' : record.status === 'online' ? 'Online' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}