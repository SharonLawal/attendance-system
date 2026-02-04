import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid Babcock email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Use your official institution email"),
    matricNumber: z
      .string()
      .min(5, "Valid matriculation/staff number required"),
    role: z.enum(["STUDENT", "LECTURER", "ADMIN"]),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
