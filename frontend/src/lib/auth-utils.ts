// Define the structure for Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Define the structure for Signup Data
export interface SignupData {
  fullName: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
  role: "Student" | "Lecturer" | "Admin";
}

// Standard API Response type
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

  // Simulate network delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 1. Validate Email Domain (Babcock Constraint)
  if (!credentials.email.endsWith("@babcock.edu.ng")) {
    return {
      success: false,
      message: "Access denied. Please use your official Babcock email (@babcock.edu.ng).",
    };
  }

  // 2. Validate Password Length (Basic Security)
  if (credentials.password.length < 6) {
    return {
      success: false,
      message: "Invalid credentials. Password must be at least 6 characters.",
    };
  }

  // 3. Simulate Backend Role Determination
  let determinedRole: "Student" | "Lecturer" | "Admin" = "Student";
  if (credentials.email.includes("admin")) {
    determinedRole = "Admin";
  } else if (!credentials.email.includes("student")) {
    determinedRole = "Lecturer";
  }

  // 4. Success Case
  return {
    success: true,
    message: "Login successful! Redirecting...",
    token: "mock-jwt-token-12345",
    role: determinedRole
  };
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  console.log("Attempting Signup:", data);

  // Simulate network delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  if (!data.email.endsWith("@babcock.edu.ng")) {
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
