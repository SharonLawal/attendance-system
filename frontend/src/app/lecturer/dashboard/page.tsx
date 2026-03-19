"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Play, Square, Clock, Map as MapIcon, RefreshCcw, CheckCircle2, ChevronRight, Pause, Plus, ShieldAlert, BookOpen, Edit, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import * as lecturerService from "@/services/lecturerService";
import { generateGeoJSONCircle } from "@/lib/geo";
import { LiveAttendeesTable } from "@/components/lecturer/LiveAttendeesTable";
import { useLecturerCourses, useLecturerDashboard, useLiveSessionAttendees, useClassrooms } from "@/hooks/useLecturerData";
import { CreateCourseModal } from "@/components/lecturer/CreateCourseModal";
import { EditCourseModal } from "@/components/lecturer/EditCourseModal";
import { ManageCourseModal } from "@/components/lecturer/ManageCourseModal";

export default function LecturerDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otc, setOtc] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Queries
  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useLecturerDashboard();
  const { data: coursesData, isLoading: isLoadingCourses, refetch: refetchCourses } = useLecturerCourses();
  const { data: attendeesData, isLoading: isLoadingAttendees } = useLiveSessionAttendees(activeSessionId);
  const { data: classroomsData } = useClassrooms();

  const courses = coursesData || [];
  const classrooms = classroomsData || [];

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<any>(null);
  const [courseToManage, setCourseToManage] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sessionDuration, setSessionDuration] = useState("5");

  // Sync state with dashboard data
  useEffect(() => {
    if (dashboardData?.activeSession && !sessionActive) {
      const active = dashboardData.activeSession;
      setActiveSessionId(active.id);
      setOtc(active.otcCode);
      
      const now = new Date();
      const endTime = new Date(active.endTime);
      const remainingSeconds = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      
      setTimeLeft(remainingSeconds);
      setSessionActive(remainingSeconds > 0);
    }
  }, [dashboardData, sessionActive]);

  // Sync live stats timestamp if polled
  useEffect(() => {
    // Note: Live attendees polling doesn't return time remaining currently.
    // relying on local fallback clock.
  }, [attendeesData]);

  // Fallback local timer to smooth out 5s polling gaps
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && sessionActive) {
      handleEndSession();
    }

    return () => clearInterval(timer);
  }, [sessionActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCreateSession = async () => {
    if (!selectedCourse || !selectedLocation || parseInt(sessionDuration) < 5) return;

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const loc = classrooms.find((l: any) => l.id === selectedLocation || l._id === selectedLocation);
      const radius = loc ? (loc.capacity > 100 ? 50 : 25) : 50;

      const polygon = generateGeoJSONCircle([position.coords.longitude, position.coords.latitude], radius);
      const res = await lecturerService.createSession({
        courseId: selectedCourse,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radiusInMeters: radius,
        durationInMinutes: parseInt(sessionDuration),
        locationPolygon: polygon
      });

      const data = res.data;
      setOtc(data.otcCode);
      setActiveSessionId(data.sessionId);
      setTimeLeft(parseInt(sessionDuration) * 60);
      setSessionActive(true);
      setIsSessionModalOpen(false);

      refetchDashboard();
      toast.success("Attendance Session Started successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start session. Ensure you have location permissions enabled.");
    }
  };

  const handleEndSession = async () => {
    try {
      if (activeSessionId) {
        await lecturerService.endSession(activeSessionId);
      }
      setSessionActive(false);
      setActiveSessionId(null);
      refetchDashboard();
      toast.info("Active session has been closed.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to end session cleanly.");
      // Force local clean anyway to prevent getting stuck
      setSessionActive(false);
      setActiveSessionId(null);
    }
  };

  const handleExtendSession = async () => {
    try {
      if (!activeSessionId) return;
      await lecturerService.extendSession(activeSessionId, 5);
      setTimeLeft(prev => prev + 300); // add 5 minutes on the frontend clock
      toast.success("Session extended by 5 minutes.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to extend session.");
    }
  };


  return (
    <DashboardLayout role="lecturer">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">Lecturer Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage physical and hybrid attendance sessions.</p>
        </div>
        {!sessionActive && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-white flex-1 md:flex-none justify-center border-slate-300 hover:bg-slate-50 text-slate-700">
              <Plus className="w-4 h-4" />
              New Course
            </Button>
            <Button onClick={() => setIsSessionModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 flex-1 md:flex-none justify-center shadow-md shadow-emerald-600/20">
              <Play className="w-4 h-4 fill-current" />
              Start Session
            </Button>
          </div>
        )}
      </div>

      {/* Aggregate Stats Row */}
      {!sessionActive && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Courses</p>
                <p className="text-xl font-bold text-slate-900">{dashboardData?.stats?.totalCourses || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Active Sessions</p>
                <p className="text-xl font-bold text-slate-900">{dashboardData?.stats?.activeSessions || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Students</p>
                <p className="text-xl font-bold text-slate-900">{dashboardData?.stats?.totalStudents || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Avg. Attendance</p>
                <p className="text-xl font-bold text-slate-900">{dashboardData?.stats?.averageAttendance || 0}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!sessionActive ? (
        <div className="w-full">
          {isLoadingCourses ? (
            <div className="w-full py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              title="No Courses Found"
              description="You have not created any courses yet. Create your first course to start tracking student attendance."
              icon="calendar"
              action={
                <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create First Course
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="border-slate-200 hover:border-babcock-blue/50 hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="neutral" className="bg-slate-100 text-slate-700">{course.courseCode}</Badge>
                          {course.department && <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">{course.department}</span>}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{course.courseName}</h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-babcock-blue hover:bg-slate-100/50 rounded-full"
                          title="Manage Roster"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseToManage(course);
                            setIsManageModalOpen(true);
                          }}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-babcock-blue hover:bg-slate-100/50 rounded-full"
                          title="Edit Course"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCourseToEdit(course);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium mb-1">Total Capacity</p>
                        <p className="font-semibold text-slate-900">{course.capacity || 50}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium mb-1">Credits</p>
                        <p className="font-semibold text-slate-900">{course.credits || 3}</p>
                      </div>
                    </div>

                    <Button
                      className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setSelectedCourse(course._id);
                        setIsSessionModalOpen(true);
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Session Control Panel */}
          <Card className="lg:col-span-1 border-babcock-gold/30 ring-2 ring-babcock-gold/20 shadow-lg shadow-babcock-gold/5 flex flex-col relative overflow-hidden">

            {/* Pulse ring background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-babcock-gold/10 rounded-full animate-ping opacity-20 pointer-events-none" />

            <CardHeader className="text-center pb-2 relative z-10 pt-10">
              <Badge variant="warning" className="absolute top-2 left-1/2 -translate-x-1/2 scale-90 tracking-widest uppercase animate-pulse border-babcock-gold/30">Live Session</Badge>
              <CardTitle className="text-2xl font-display font-bold tracking-tight text-slate-900">{courses.find(c => c._id === selectedCourse)?.courseCode || "Unknown Course"}</CardTitle>
              <CardDescription className="font-medium text-slate-500">Accepting check-ins now</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">

              <div className="w-48 h-48 rounded-full border-8 border-babcock-gold bg-amber-50 flex flex-col items-center justify-center mb-8 shadow-inner">
                <div className="text-4xl font-black font-display text-slate-800 tracking-widest mb-1">
                  {otc}
                </div>
                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Live Attendees Data */}
              {isLoadingAttendees ? (
                   <div className="w-full bg-slate-50 p-12 rounded-lg border border-slate-100 mb-6 flex justify-center">
                   <div className="w-8 h-8 rounded-full border-4 border-babcock-blue/30 border-t-babcock-blue animate-spin" />
                 </div>
              ) : attendeesData ? (
                 <div className="w-full mb-6">
                    <LiveAttendeesTable attendees={attendeesData.attendees} summary={attendeesData.summary} />
                 </div>
              ) : (
                <div className="w-full bg-slate-50 p-12 rounded-lg border border-slate-100 mb-6 flex justify-center text-slate-500 font-medium">
                  Failed to load attendees.
                </div>
              )}

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="w-full gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold" onClick={handleExtendSession}>
                  <Clock className="w-4 h-4" /> +5 Mins
                </Button>
                <Button variant="danger" className="w-full gap-2 font-semibold shadow-md shadow-red-500/20" onClick={handleEndSession}>
                  <Square className="w-4 h-4 fill-current" /> End Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Column */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader className="flex flex-row justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-900">
                  <MapIcon className="w-5 h-5 text-babcock-blue" />
                  Classroom Geofence
                </CardTitle>
                <CardDescription className="sm:ml-7 text-sm">Location restriction boundary.</CardDescription>
              </div>
              <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm mt-3 sm:mt-0 self-start sm:self-center">Boundary Enforced</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-[350px] bg-[#e5e3df] relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Targeted Polygon visually derived from the selected location */}
                <div className="w-72 h-56 bg-babcock-blue/20 border-2 border-babcock-blue border-dashed transform rotate-[-5deg] flex flex-col items-center justify-center shadow-lg relative z-10 backdrop-blur-[2px] transition-all">
                  <MapIcon className="w-8 h-8 text-babcock-blue mb-2" />
                  <span className="text-babcock-blue font-bold px-3 py-1 bg-white/90 rounded-full text-sm shadow-sm">
                    {classrooms.find((l: any) => l.id === selectedLocation || l._id === selectedLocation)?.name || "Babcock Business School"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-lg p-3 shadow-sm border border-slate-200 flex items-start gap-3 flex-row z-20">
                  <ShieldAlert className="w-5 h-5 text-babcock-blue mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-600 font-medium">Students must have physical GPS coordinates averaging within this highlighted polygon zone to fulfill the verification mandate.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Creation Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => { refetchCourses(); refetchDashboard(); }}
      />

      {/* Course Editing Modal */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refetchCourses}
        course={courseToEdit}
      />

      {/* Roster Management Modal */}
      <ManageCourseModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSuccess={refetchCourses}
        course={courseToManage}
      />

      {/* Session Start Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Start Attendance Session"
        description="Configure the class details to broadcast an OTC and activate the GPS boundary."
        maxWidth="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsSessionModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateSession}
              disabled={!selectedCourse || !selectedLocation || parseInt(sessionDuration) < 5}
              className="gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Generate OTC
            </Button>
          </>
        }
      >
        <div className="space-y-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Target Course</label>
            <Select
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="Select course to take attendance for..."
              options={courses.map(c => ({ label: `${c.courseCode} - ${c.courseName}`, value: c._id }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Classroom Location</label>
            <Select
              value={selectedLocation}
              onChange={setSelectedLocation}
              placeholder="Select physical venue..."
              options={classrooms.map((l: any) => ({ label: l.name, value: l.id || l._id }))}
            />

            {/* Dynamic Mini-map UX Enhancement */}
            {selectedLocation && (
              <div className="mt-3 w-full h-32 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-emerald-500/20 border border-emerald-500 border-dashed transform flex items-center justify-center">
                  <MapIcon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex justify-between">
              <span>Duration (Minutes)</span>
              <span className="text-xs text-slate-400 font-normal">Minimum 5 mins</span>
            </label>
            <input
              type="number"
              min="5"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-babcock-blue focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
