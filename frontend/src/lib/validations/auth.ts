/**
 * @fileoverview Contextual execution boundary for frontend/src/lib/validations/auth.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { z } from "zod";

const BABCOCK_SCHOOLS = [
  "School of Computing & Engineering Sciences",
  "School of Education and Humanities",
  "School of Law & Security Studies",
  "School of Management Sciences",
  "School of Public & Applied Health",
  "Veronica Adeleke School of Social Sciences",
  "School of Science and Technology",
  "School of Nursing Sciences",
  "Benjamin Carson School of Medicine",
  "College of Postgraduate Studies",
] as const;

const babcockEmailRule = z
  .string()
  .email("Please enter a valid email address")
  .refine(
    (email) =>
      email.endsWith("@babcock.edu.ng") ||
      email.endsWith("@student.babcock.edu.ng"),
    {
      message:
        "You must use a valid Babcock University email (@babcock.edu.ng)",
    }
  );

const signupPasswordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

const loginPasswordRule = z.string().min(1, "Password is required");

export const loginSchema = z.object({
  email: babcockEmailRule,
  password: loginPasswordRule,
  rememberMe: z.boolean(),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: babcockEmailRule,
    idNumber: z.string().min(4, "ID Number is required"),
    role: z.enum(["Student", "Lecturer"], {
      message: "Please select a valid role",
    }),
    school: z.string().optional(),
    password: signupPasswordRule,
    confirmPassword: signupPasswordRule,
    terms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {

      if (data.role === "Lecturer" && !data.school) return false;
      return true;
    },
    {
      message: "Please select your school/faculty",
      path: ["school"],
    }
  );

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export { BABCOCK_SCHOOLS };