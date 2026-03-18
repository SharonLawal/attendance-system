export function transformStudentStats(apiData: any) {
  return {
    stats: {
      attendancePercentage: apiData.stats?.attendance_percentage || 0,
      totalClasses: apiData.stats?.total_classes || 0,
      attendedClasses: apiData.stats?.attended_classes || 0,
      streakDays: apiData.stats?.streak_days || 0
    },
    todaysSchedule: apiData.todays_schedule ? apiData.todays_schedule.map(transformScheduleItem) : [],
    recentHistory: apiData.recent_history ? apiData.recent_history.map(transformHistoryItem) : []
  };
}

export function transformScheduleItem(item: any) {
  return {
    courseCode: item.courseCode || item.course?.courseCode,
    courseName: item.courseName || item.course?.courseName || item.title,
    startTime: item.startTime,
    endTime: item.endTime,
    room: item.room || item.location,
    type: item.type
  };
}

export function transformHistoryItem(item: any) {
  return {
    id: item._id || item.id,
    course: item.course || item.sessionId?.courseId?.courseCode || 'Unknown',
    date: item.date || new Date(item.timestamp).toLocaleDateString(),
    time: item.time || new Date(item.timestamp).toLocaleTimeString(),
    status: item.status,
    method: item.method || item.source
  };
}

export function transformPaginatedResponse(apiData: any, itemTransformer: (item: any) => any) {
  return {
    data: apiData.data?.map(itemTransformer) || [],
    pagination: {
      currentPage: apiData.pagination?.current_page || 1,
      totalPages: apiData.pagination?.total_pages || 1,
      totalItems: apiData.pagination?.total_items || 0,
      itemsPerPage: apiData.pagination?.items_per_page || 10,
      hasNextPage: apiData.pagination?.has_next_page || false,
      hasPrevPage: apiData.pagination?.has_prev_page || false,
    },
  };
}

export function transformLecturerDashboard(apiData: any) {
  return {
    stats: {
      totalCourses: apiData.total_courses || 0,
      activeSessions: apiData.active_sessions || 0,
      totalStudents: apiData.total_students || 0,
      averageAttendance: apiData.average_attendance || 0,
    },
    activeSession: apiData.active_session ? {
      id: apiData.active_session.id,
      courseCode: apiData.active_session.course_code,
      courseName: apiData.active_session.course_name,
      otcCode: apiData.active_session.otc_code,
      startTime: apiData.active_session.start_time,
      endTime: apiData.active_session.end_time,
    } : null,
    upcomingSessions: apiData.upcoming_sessions || []
  };
}

export function transformLiveSessionStats(apiData: any) {
  return {
    sessionId: apiData.session_id,
    courseCode: apiData.course_code,
    courseName: apiData.course_name,
    otcCode: apiData.otc_code,
    checkedInCount: apiData.checked_in_count || 0,
    expectedCount: apiData.expected_count || 0,
    attendanceRate: apiData.attendance_rate || 0,
    timeRemaining: apiData.time_remaining || 0, // in seconds
    startTime: apiData.start_time,
    endTime: apiData.end_time,
  };
}

export function transformAdminStats(apiData: any) {
  return {
    totalStudents: apiData.totalStudents || "0",
    activeSessions: apiData.activeSessions || "0",
    systemHealth: apiData.systemHealth || "0%",
    flaggedAbsences: apiData.flaggedAbsences || "0",
  };
}

export function transformAdminUsers(apiData: any) {
  return {
    users: apiData.users || [],
    pagination: {
      currentPage: apiData.page || 1,
      totalPages: apiData.pages || 1,
      totalItems: apiData.total || 0,
    }
  };
}
