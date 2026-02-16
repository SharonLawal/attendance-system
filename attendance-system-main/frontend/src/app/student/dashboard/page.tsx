"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboard() {
  const [otc, setOtc] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);

  // Student data (from API in production)
  const studentData = {
    name: "Sharon Lawal",
    matricNumber: "22/0234",
    totalClasses: 48,
    attendanceRate: 87.5,
    classesAttended: 42,
    classesToday: { attended: 2, total: 3 },
    lowAttendanceCourses: ["GEDS 400"] // Below 75%
  };

  // Active session (from API)
  const activeSession = {
    isActive: true,
    courseCode: "CSC 301",
    courseName: "Data Structures & Algorithms",
    lecturer: "Dr. Mensah Yaw",
    location: "Lecture Hall A, Engineering Block",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    timeRemaining: "14:52"
  };

  // Recent attendance
  const recentAttendance = [
    { course: "CSC 305", name: "Database Systems", date: "Feb 4, 2026", time: "2:05 PM", status: "present" },
    { course: "CSC 320", name: "Web Development", date: "Feb 3, 2026", time: "4:10 PM", status: "present" },
    { course: "CSC 301", name: "Data Structures", date: "Feb 3, 2026", time: "10:03 AM", status: "present" },
    { course: "GEDS 400", name: "Entrepreneurship", date: "Feb 2, 2026", time: "-", status: "absent" },
  ];

  const handleSubmitOTC = async () => {
    if (otc.length !== 4) {
      setNotification({ type: 'error', message: 'Please enter a valid 4-digit code' });
      return;
    }

    setIsVerifying(true);
    setNotification(null);

    // Simulate GPS verification + OTC validation
    setTimeout(() => {
      const isValid = Math.random() > 0.2;
      
      if (isValid) {
        setNotification({ 
          type: 'success', 
          message: '✓ Attendance marked successfully! Location verified in Lecture Hall A.' 
        });
        setOtc("");
      } else {
        setNotification({ 
          type: 'error', 
          message: '✗ Verification failed. Code incorrect or you are outside the geofence area.' 
        });
      }
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sharon!</h1>
        <p className="text-gray-600 mt-1">Here's your attendance overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Classes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/book.svg" alt="" width={24} height={24} className="opacity-70" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              Active
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
          <p className="text-3xl font-bold text-gray-900">{studentData.totalClasses}</p>
          <p className="text-xs text-gray-500 mt-1">This semester</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/check-circle.svg" alt="" width={24} height={24} className="opacity-70" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              studentData.attendanceRate >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {studentData.attendanceRate >= 75 ? 'Good' : 'Low'}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</p>
          <p className="text-3xl font-bold text-gray-900">{studentData.attendanceRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Overall average</p>
        </div>

        {/* Classes Attended */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/check-circle.svg" alt="" width={24} height={24} className="opacity-70" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Total
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Classes Attended</p>
          <p className="text-3xl font-bold text-gray-900">{studentData.classesAttended}</p>
          <p className="text-xs text-gray-500 mt-1">Out of {studentData.totalClasses}</p>
        </div>

        {/* Today's Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Image src="/dashboard-icons/calendar.svg" alt="" width={24} height={24} className="opacity-70" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              Today
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Today's Classes</p>
          <p className="text-3xl font-bold text-gray-900">
            {studentData.classesToday.attended}
            <span className="text-lg font-normal text-gray-400">/{studentData.classesToday.total}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Attended so far</p>
        </div>
      </div>

      {/* 75% Warning Banner (Requirement 4.5 from document) */}
      {studentData.lowAttendanceCourses.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Image src="/dashboard-icons/warning.svg" alt="" width={24} height={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 mb-1">⚠️ Attendance Warning</h4>
              <p className="text-sm text-amber-800">
                Your attendance in <strong>GEDS 400 (Entrepreneurship)</strong> is below the required 75% threshold. 
                Please attend your next classes to meet university requirements for exam eligibility.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Attendance Card (Primary Feature - Chapter 3.4.1.1) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Mark Attendance</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {activeSession.courseCode}: {activeSession.courseName}
                  </p>
                </div>
                {activeSession.isActive && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active Now
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Image src="/dashboard-icons/clock.svg" alt="" width={16} height={16} className="brightness-0 invert" />
                  <span>{activeSession.startTime} - {activeSession.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/dashboard-icons/map-pin.svg" alt="" width={16} height={16} className="brightness-0 invert" />
                  <span>{activeSession.location}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8">
              {/* Notification */}
              {notification && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  notification.type === 'success' ? 'bg-green-50 border-green-200' :
                  notification.type === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-amber-50 border-amber-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    'text-amber-800'
                  }`}>
                    {notification.message}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Enter One-Time Code (OTC)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter the 4-digit code displayed by your lecturer
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
                      <span>Verify & Submit Attendance</span>
                      <Image src="/dashboard-icons/arrow-right.svg" alt="" width={20} height={20} className="brightness-0 invert" />
                    </>
                  )}
                </button>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Image src="/dashboard-icons/info.svg" alt="" width={20} height={20} className="flex-shrink-0 mt-0.5 opacity-70" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">🛰️ Location verification enabled</p>
                      <p className="text-blue-700">
                        Your GPS coordinates will be verified (3-5 samples). Time remaining: <strong>{activeSession.timeRemaining}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Today's Schedule</h3>
          
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-700">10:00 AM</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded">Active</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">CSC 301</p>
              <p className="text-xs text-gray-600">Data Structures</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Image src="/dashboard-icons/map-pin.svg" alt="" width={12} height={12} className="opacity-50" />
                <span>Lecture Hall A</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600">2:00 PM</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded">Later</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">CSC 305</p>
              <p className="text-xs text-gray-600">Database Systems</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Image src="/dashboard-icons/map-pin.svg" alt="" width={12} height={12} className="opacity-50" />
                <span>Lab Building</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600">4:00 PM</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded">Later</span>
              </div>
              <p className="font-bold text-gray-900 text-sm">CSC 320</p>
              <p className="text-xs text-gray-600">Web Development</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Image src="/dashboard-icons/map-pin.svg" alt="" width={12} height={12} className="opacity-50" />
                <span>Computer Lab 2</span>
              </div>
            </div>
          </div>

          <Link 
            href="/student/schedule" 
            className="block w-full mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Full Schedule →
          </Link>
        </div>
      </div>

      {/* Recent Attendance History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Recent Attendance</h3>
          <Link href="/student/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{record.course}</p>
                    <p className="text-xs text-gray-600">{record.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.time}</td>
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
  );
}