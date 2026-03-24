/**
 * @fileoverview Contextual execution boundary for frontend/src/lib/auth-utils.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  role: "Student" | "Lecturer" | "Admin";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  role?: "Student" | "Lecturer" | "Admin";
}

/**
 * Simulates a secure Login API call.
 * Replace the setTimeout with a real fetch request when backend is ready.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log("Attempting Login:", credentials);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!credentials.email.endsWith("@babcock.edu.ng") && !credentials.email.endsWith("@student.babcock.edu.ng")) {
    return {
      success: false,
      message: "Access denied. Please use your official Babcock email (@babcock.edu.ng or @student.babcock.edu.ng).",
    };
  }

  if (credentials.password.length < 6) {
    return {
      success: false,
      message: "Invalid credentials. Password must be at least 6 characters.",
    };
  }

  let determinedRole: "Student" | "Lecturer" | "Admin" = "Student";
  if (credentials.email.includes("admin")) {
    determinedRole = "Admin";
  } else if (!credentials.email.includes("student")) {
    determinedRole = "Lecturer";
  }

  return {
    success: true,
    message: "Login successful! Redirecting...",
    token: "mock-jwt-token-12345",
    role: determinedRole
  };
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  console.log("Attempting Signup:", data);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  if (!data.email.endsWith("@babcock.edu.ng") && !data.email.endsWith("@student.babcock.edu.ng")) {
    return {
      success: false,
      message: "Registration is restricted to Babcock University emails only.",
    };
  }

  if (data.studentId.length < 3) {
    return {
      success: false,
      message: `Invalid ${data.role === 'Student' ? 'Matric Number' : 'Staff ID'}.`,
    };
  }

  return {
    success: true,
    message: "Account created successfully! Please log in.",
  };
};
