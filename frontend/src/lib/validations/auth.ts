import { z } from "zod";

// --- Rules ---
const babcockEmailRule = z
  .string()
  .email("Please enter a valid email address")
  .refine((email) => email.endsWith("@babcock.edu.ng") || email.endsWith("@student.babcock.edu.ng"), {
    message: "You must use a valid Babcock University email (@babcock.edu.ng)",
  });

const signupPasswordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

const loginPasswordRule = z
  .string()
  .min(1, "Password is required");

// --- Login Schema ---
export const loginSchema = z.object({
  email: babcockEmailRule,
  password: loginPasswordRule,
  rememberMe: z.boolean().optional().default(false),
});

// --- Signup Schema ---
export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: babcockEmailRule,
    idNumber: z.string().min(4, "ID Number is required"),
    role: z.enum(["Student", "Lecturer"], {
      message: "Please select a valid role",
    }),
    password: signupPasswordRule,
    confirmPassword: signupPasswordRule,
    terms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
