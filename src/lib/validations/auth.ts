import { z } from "zod";

// --- Rules ---
const babcockEmailRule = z
  .string()
  .email("Please enter a valid email address")
  .refine((email) => email.endsWith("@babcock.edu.ng") || email.endsWith("@student.babcock.edu.ng"), {
    message: "You must use a valid Babcock University email (@babcock.edu.ng)",
  });

const passwordRule = z
  .string()
  .min(6, "Password must be at least 6 characters");

// --- Login Schema ---
export const loginSchema = z.object({
  email: babcockEmailRule,
  password: passwordRule,
  role: z.enum(["Student", "Lecturer", "Admin"], {
    message: "Please select a valid role",
  }),
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
    password: passwordRule,
    confirmPassword: passwordRule,
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