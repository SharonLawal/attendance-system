import { Users, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- Student Dashboard Demo Data ---
export const MOCK_ATTENDANCE_PERCENTAGE = 68;
export const COURSE_CODE = "GEDS 400";

export const RECENT_HISTORY = [
    { id: 1, course: "GEDS 400", date: "Oct 24, 2023", time: "10:15 AM", status: "Present" },
    { id: 2, course: "COSC 412", date: "Oct 23, 2023", time: "08:05 AM", status: "Late" },
    { id: 3, course: "CPEN 414", date: "Oct 22, 2023", time: "09:00 AM", status: "Present" },
    { id: 4, course: "GEDS 400", date: "Oct 17, 2023", time: "10:00 AM", status: "Absent" },
];

export const EXTENDED_HISTORY = [
    ...RECENT_HISTORY,
    { id: 4, course: "GEDS 400", date: "Oct 10, 2023", time: "09:05 AM", status: "Absent", method: "Missed Check-in" },
    { id: 5, course: "COSC 411", date: "Oct 09, 2023", time: "11:00 AM", status: "Present", method: "GPS Verification" },
    { id: 6, course: "GEDS 420", date: "Oct 08, 2023", time: "02:00 PM", status: "Present", method: "LMS Sync" },
    { id: 7, course: "SENG 402", date: "Oct 06, 2023", time: "01:15 PM", status: "Late", method: "Manual Entry" },
    { id: 8, course: "GEDS 400", date: "Oct 05, 2023", time: "09:00 AM", status: "Present", method: "GPS + OTC" },
];

export interface Course {
    id: string;
    code: string;
    title: string;
    instructor: string;
    attendancePercentage: number;
    totalClasses: number;
    attendedClasses: number;
    status: "safe" | "warning" | "critical";
}

export const COURSES_DATA: Course[] = [
    { id: "1", code: "GEDS 400", title: "Software Engineering", instructor: "Dr. Adebayo", attendancePercentage: 68, totalClasses: 20, attendedClasses: 13, status: "warning" },
    { id: "2", code: "SENG 402", title: "Mobile Computing", instructor: "Prof. Nnamdi", attendancePercentage: 92, totalClasses: 18, attendedClasses: 17, status: "safe" },
    { id: "3", code: "COSC 411", title: "Artificial Intelligence", instructor: "Dr. Jane Smith", attendancePercentage: 45, totalClasses: 15, attendedClasses: 7, status: "critical" },
    { id: "4", code: "GEDS 420", title: "Entrepreneurship", instructor: "Mr. Johnson", attendancePercentage: 100, totalClasses: 10, attendedClasses: 10, status: "safe" },
];

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const SCHEDULE_DATA = [
    { day: "Monday", time: "09:00 AM - 11:00 AM", course: "GEDS 400", title: "Software Engineering", room: "BBS Room 2", type: "Lecture" },
    { day: "Monday", time: "01:00 PM - 03:00 PM", course: "SENG 402", title: "Mobile Computing", room: "SAT Hub", type: "Lab" },
    { day: "Wednesday", time: "11:00 AM - 01:00 PM", course: "COSC 411", title: "Artificial Intelligence", room: "BBS Room 1", type: "Lecture" },
    { day: "Thursday", time: "02:00 PM - 04:00 PM", course: "GEDS 420", title: "Entrepreneurship", room: "Main Auditorium", type: "Seminar" },
    { day: "Friday", time: "09:00 AM - 11:00 AM", course: "SENG 402", title: "Mobile Computing", room: "SAT Lab 1", type: "Lab" },
];

// --- Admin Dashboard Demo Data ---
export const ADMIN_STATS = [
    { title: "Total Students", value: "8,432", icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Active Sessions", value: "45", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "System Health", value: "99.9%", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
    { title: "Flagged Absences", value: "112", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
];

export const ADMIN_USERS_DATA = [
    { id: 1, name: "John Doe", identifier: "21/1234", role: "Student", status: "Active" },
    { id: 2, name: "Dr. Jane Smith", identifier: "S-4001", role: "Lecturer", status: "Active" },
    { id: 3, name: "Michael Johnson", identifier: "19/5432", role: "Student", status: "Suspended" },
    { id: 4, name: "Sarah Williams", identifier: "22/8876", role: "Student", status: "Active" },
    { id: 5, name: "Prof. Alan Turing", identifier: "S-1004", role: "Admin", status: "Active" },
    { id: 6, name: "Emily Brown", identifier: "20/4455", role: "Student", status: "Inactive" },
];

// --- Lecturer Dashboard Demo Data ---
export const CLASSROOM_LOCATIONS = [
    { id: "bbs-rm-1", name: "BBS Room 1", capacity: 150 },
    { id: "bbs-rm-2", name: "BBS Room 2", capacity: 100 },
    { id: "sat-hub", name: "SAT Innovation Hub", capacity: 200 },
    { id: "sat-lab-1", name: "SAT Computer Lab 1", capacity: 80 },
    { id: "main-aud", name: "Main Auditorium", capacity: 2000 },
];

export const LECTURER_COURSES = [
    { id: "1", code: "GEDS 400", title: "Software Engineering", totalStudents: 45, averageAttendance: 88, sessionsHeld: 14 },
    { id: "2", code: "COSC 411", title: "Artificial Intelligence", totalStudents: 60, averageAttendance: 72, sessionsHeld: 12 },
    { id: "3", code: "SENG 402", title: "Mobile Computing", totalStudents: 30, averageAttendance: 95, sessionsHeld: 8 },
];

export const LECTURER_SYNC_HISTORY = [
    { id: 1, platform: "Google Classroom", course: "GEDS 400", date: "Oct 24, 2023", time: "11:00 AM", studentsSynced: 42, status: "Success" },
    { id: 2, platform: "Microsoft Teams", course: "COSC 411", date: "Oct 20, 2023", time: "09:30 AM", studentsSynced: 58, status: "Success" },
    { id: 3, platform: "Google Classroom", course: "SENG 402", date: "Oct 15, 2023", time: "02:15 PM", studentsSynced: 0, status: "Failed (API Error)" },
];

// --- Analytics & Reports Demo Data ---
export const WEEKLY_ATTENDANCE = [
    { day: "Mon", rate: 88 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 85 },
    { day: "Thu", rate: 78 },
    { day: "Fri", rate: 95 },
];

export const DEPARTMENT_RATES = [
    { dept: "Computer Science", rate: 91 },
    { dept: "Software Engineering", rate: 85 },
    { dept: "Information Tech", rate: 76 },
    { dept: "Computer Technology", rate: 88 },
];

export const CRITICAL_STUDENTS = [
    { id: 1, name: "Michael Johnson", matric: "19/5432", dept: "Software Engineering", attendance: 45 },
    { id: 2, name: "Emily Brown", matric: "20/4455", dept: "Computer Science", attendance: 68 },
    { id: 3, name: "David Miller", matric: "21/4433", dept: "Information Tech", attendance: 72 },
    { id: 4, name: "Sophia Wilson", matric: "22/7711", dept: "Software Engineering", attendance: 55 },
];

export const DETAILED_REPORTS = [
    { id: 1, name: "Sharon Lawal", matric: "22/0234", course: "GEDS 400", date: "Oct 24, 2023", status: "Present" },
    { id: 2, name: "John Doe", matric: "21/1234", course: "GEDS 400", date: "Oct 24, 2023", status: "Absent" },
    { id: 3, name: "Michael Johnson", matric: "19/5432", course: "COSC 411", date: "Oct 23, 2023", status: "Present" },
    { id: 4, name: "Sarah Williams", matric: "22/8876", course: "SENG 402", date: "Oct 22, 2023", status: "Late" },
    { id: 5, name: "Emily Brown", matric: "20/4455", course: "GEDS 400", date: "Oct 24, 2023", status: "Absent" },
    { id: 6, name: "David Miller", matric: "21/4433", course: "GEDS 400", date: "Oct 24, 2023", status: "Present" },
    { id: 7, name: "Jessica Davis", matric: "22/1122", course: "COSC 411", date: "Oct 23, 2023", status: "Present" },
];

