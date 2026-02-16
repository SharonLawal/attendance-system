const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { getToken } from "./auth-utils";

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  try {
    return JSON.parse(text || "{}");
  } catch (e) {
    return { success: false, message: 'Invalid JSON response' };
  }
}

export const getProfile = async () => {
  return await fetchWithAuth('/auth/profile');
};

export const getCourses = async () => {
  return await fetchWithAuth('/courses');
};

export const getCourseAttendance = async (courseId: string) => {
  return await fetchWithAuth(`/courses/${courseId}/attendance`);
};

export const markAttendance = async (courseId: string, studentId?: string, status?: string) => {
  const body: any = {};
  if (studentId) body.studentId = studentId;
  if (status) body.status = status;
  return await fetchWithAuth(`/courses/${courseId}/attendance`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export default {
  getProfile,
  getCourses,
  getCourseAttendance,
};
