/**
 * @module utils/apiTransformers
 * @description Enforces strict structural normalization across all incoming asynchronous server payloads. Extracts normalized strings to guarantee safe React UI error hydration.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export function transformStudentStats(apiData: any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      stats: {
        attendancePercentage: payload.stats?.attendance_percentage || 0,
        totalClasses: payload.stats?.total_classes || 0,
        attendedClasses: payload.stats?.attended_classes || 0,
        streakDays: payload.stats?.streak_days || 0
      },
      todaysSchedule: payload.todays_schedule ? payload.todays_schedule.map(transformScheduleItem) : [],
      recentHistory: payload.recent_history ? payload.recent_history.map(transformHistoryItem) : []
    }
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

export function transformPaginatedResponse(apiData: any, itemTransformer: (item: any) => any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      data: payload.data?.map(itemTransformer) || [],
      pagination: {
        currentPage: payload.pagination?.current_page || 1,
        totalPages: payload.pagination?.total_pages || 1,
        totalItems: payload.pagination?.total_items || 0,
        itemsPerPage: payload.pagination?.items_per_page || 10,
        hasNextPage: payload.pagination?.has_next_page || false,
        hasPrevPage: payload.pagination?.has_prev_page || false,
      }
    }
  };
}

export function transformLecturerDashboard(apiData: any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      stats: {
        totalCourses: payload.total_courses || 0,
        activeSessions: payload.active_sessions || 0,
        totalStudents: payload.total_students || 0,
        averageAttendance: payload.average_attendance || 0,
      },
      activeSession: payload.active_session ? {
        id: payload.active_session.id,
        courseCode: payload.active_session.course_code,
        courseName: payload.active_session.course_name,
        otcCode: payload.active_session.otc_code,
        startTime: payload.active_session.start_time,
        endTime: payload.active_session.end_time,
      } : null,
      upcomingSessions: payload.upcoming_sessions || []
    }
  };
}

export function transformLiveSessionStats(apiData: any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      sessionId: payload.session_id,
      courseCode: payload.course_code,
      courseName: payload.course_name,
      otcCode: payload.otc_code,
      checkedInCount: payload.checked_in_count || 0,
      expectedCount: payload.expected_count || 0,
      attendanceRate: payload.attendance_rate || 0,
      timeRemaining: payload.time_remaining || 0,
      startTime: payload.start_time,
      endTime: payload.end_time,
    }
  };
}

export function transformAdminStats(apiData: any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      totalStudents: payload.totalStudents || "0",
      activeSessions: payload.activeSessions || "0",
      systemHealth: payload.systemHealth || "0%",
      flaggedAbsences: payload.flaggedAbsences || "0",
    }
  };
}

export function transformAdminUsers(apiData: any): ApiResponse {
  const payload = apiData.data || apiData;
  return {
    success: apiData.success ?? true,
    message: apiData.message || (apiData.success === false ? "Request failed" : "Success"),
    data: {
      users: payload.users || [],
      pagination: {
        currentPage: payload.page || 1,
        totalPages: payload.pages || 1,
        totalItems: payload.total || 0,
      }
    }
  };
}
