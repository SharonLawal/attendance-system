"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboard() {
  const [otc, setOtc] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  // Student data (would come from API)
  const studentData = {
    name: "Sharon Lawal",
    matricNumber: "22/0234",
    email: "sharon.lawal@babcock.edu.ng",
    totalClasses: 48,
    attendanceRate: 87.5,
    classesToday: { attended: 2, total: 3 },
    lowAttendanceCourses: [] // Courses below 75%
  };

  // Current active session (would come from API)
  const activeSession = {
    courseCode: "CSC 301",
    courseName: "Data Structures & Algorithms",
    lecturer: "Dr. Mensah Yaw",
    location: "Lecture Hall A",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    timeRemaining: "14:52", // minutes:seconds
    isActive: true
  };

  // Recent attendance history
  const recentAttendance = [
    { course: "CSC 305", courseName: "Database Systems", date: "Feb 4, 2026", time: "2:05 PM", location: "LH-B", status: "present" },
    { course: "CSC 320", courseName: "Web Development", date: "Feb 3, 2026", time: "4:10 PM", location: "Lab-2", status: "present" },
    { course: "CSC 301", courseName: "Data Structures", date: "Feb 3, 2026", time: "10:03 AM", location: "LH-A", status: "present" },
    { course: "MTH 202", courseName: "Linear Algebra", date: "Feb 2, 2026", time: "-", location: "-", status: "absent" },
  ];

  const handleSubmitOTC = async () => {
    if (otc.length !== 4) {
      setNotification({ type: 'error', message: 'Please enter a valid 4-digit code' });
      return;
    }

    setIsVerifying(true);
    setNotification(null);

    // Simulate API call with GPS verification
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      
      if (isValid) {
        setNotification({ 
          type: 'success', 
          message: 'Attendance marked successfully! You are verified in Lecture Hall A.' 
        });
        setOtc("");
      } else {
        setNotification({ 
          type: 'error', 
          message: 'Verification failed. Either the code is incorrect or you are not in the classroom geofence area.' 
        });
      }
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image src="/dashboard-icons/map-pin.svg" alt="" width={28} height={28} className="text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">VeriPoint</h1>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/student/dashboard" 
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
          >
            <Image src="/dashboard-icons/dashboard.svg" alt="" width={20} height={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/student/courses" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Image src="/dashboard-icons/book.svg" alt="" width={20} height={20} />
            <span>My Courses</span>
          </Link>
          <Link 
            href="/student/schedule" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Image src="/dashboard-icons/calendar.svg" alt="" width={20} height={20} />
            <span>Schedule</span>
          </Link>
          <Link 
            href="/student/history" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Image src="/dashboard-icons/clock.svg" alt="" width={20} height={20} />
            <span>History</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              SL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{studentData.name}</p>
              <p className="text-xs text-gray-500 truncate">{studentData.matricNumber}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Image src="/dashboard-icons/logout.svg" alt="" width={18} height={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Student Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, {studentData.name.split(' ')[0]}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Image src="/dashboard-icons/bell.svg" alt="Notifications" width={20} height={20} />
              {studentData.lowAttendanceCourses.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Image src="/dashboard-icons/settings.svg" alt="Settings" width={20} height={20} />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Classes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Image src="/dashboard-icons/book.svg" alt="" width={24} height={24} className="text-blue-600" />
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Classes</h3>
              <p className="text-3xl font-bold text-gray-900">{studentData.totalClasses}</p>
              <p className="text-xs text-gray-500 mt-1">This semester</p>
            </div>

            {/* Attendance Rate */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Image src="/dashboard-icons/check-circle.svg" alt="" width={24} height={24} className="text-green-600" />
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  studentData.attendanceRate >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {studentData.attendanceRate >= 75 ? 'Good' : 'Low'}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</h3>
              <p className="text-3xl font-bold text-gray-900">{studentData.attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Overall average</p>
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Image src="/dashboard-icons/calendar.svg" alt="" width={24} height={24} className="text-purple-600" />
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Today
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Classes Attended</h3>
              <p className="text-3xl font-bold text-gray-900">
                {studentData.classesToday.attended}
                <span className="text-lg font-normal text-gray-400">/{studentData.classesToday.total}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Out of {studentData.classesToday.total} scheduled</p>
            </div>
          </div>

          {/* Notification Banner (if attendance below 75%) */}
          {studentData.attendanceRate < 75 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg flex items-start gap-3">
              <Image src="/dashboard-icons/warning.svg" alt="" width={24} height={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">Attendance Warning</h4>
                <p className="text-sm text-amber-800">
                  Your overall attendance is below the required 75% threshold. Please attend your classes regularly to meet university requirements.
                </p>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mark Attendance Card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              {activeSession.isActive ? (
                <>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{activeSession.courseCode}: {activeSession.courseName}</h3>
                        <p className="text-blue-100 text-sm">Dr. {activeSession.lecturer}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Active Now
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Image src="/dashboard-icons/clock.svg" alt="" width={16} height={16} />
                        <span>{activeSession.startTime} - {activeSession.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image src="/dashboard-icons/map-pin.svg" alt="" width={16} height={16} />
                        <span>{activeSession.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {notification && (
                      <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                        notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                        notification.type === 'error' ? 'bg-red-50 border border-red-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <Image 
                          src={`/dashboard-icons/${notification.type === 'success' ? 'check-circle' : notification.type === 'error' ? 'x-circle' : 'info'}.svg`} 
                          alt="" 
                          width={20} 
                          height={20} 
                          className={notification.type === 'success' ? 'text-green-600' : notification.type === 'error' ? 'text-red-600' : 'text-blue-600'}
                        />
                        <p className={`text-sm font-medium ${
                          notification.type === 'success' ? 'text-green-800' :
                          notification.type === 'error' ? 'text-red-800' :
                          'text-blue-800'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Enter One-Time Code (OTC)
                      </label>
                      <p className="text-xs text-gray-500 mb-4">
                        Enter the 4-digit code displayed on the lecturer's screen
                      </p>
                      <input
                        type="text"
                        value={otc}
                        onChange={(e) => setOtc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="0000"
                        maxLength={4}
                        className="w-full px-6 py-4 text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                        disabled={isVerifying}
                      />
                    </div>

                    <button
                      onClick={handleSubmitOTC}
                      disabled={isVerifying || otc.length !== 4}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Verifying Location...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Attendance</span>
                          <Image src="/dashboard-icons/arrow-right.svg" alt="" width={20} height={20} />
                        </>
                      )}
                    </button>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Image src="/dashboard-icons/info.svg" alt="" width={20} height={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Location verification enabled</p>
                          <p className="text-blue-700">
                            Your GPS coordinates will be verified against the classroom geofence. 
                            Time remaining: <span className="font-bold">{activeSession.timeRemaining}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image src="/dashboard-icons/clock.svg" alt="" width={32} height={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Sessions</h3>
                  <p className="text-gray-600">There are no active attendance sessions at the moment.</p>
                </div>
              )}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Classes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Next Classes</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">CSC 305</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                    </div>
                    <p className="text-xs text-gray-600">Database Systems</p>
                    <p className="text-xs text-gray-500 mt-1">2:00 PM - 3:30 PM</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">CSC 320</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Later</span>
                    </div>
                    <p className="text-xs text-gray-600">Web Development</p>
                    <p className="text-xs text-gray-500 mt-1">4:00 PM - 5:30 PM</p>
                  </div>
                </div>
                <button className="w-full mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 text-center">
                  View Full Schedule →
                </button>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-2">System Info</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li>✓ OTC-based verification</li>
                  <li>✓ GPS location tracking</li>
                  <li>✓ 75% attendance required</li>
                  <li>✓ Real-time sync with LMS</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Attendance History */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Attendance</h3>
              <Link href="/student/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAttendance.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{record.course}</p>
                          <p className="text-sm text-gray-600">{record.courseName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.date} • {record.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.location}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}