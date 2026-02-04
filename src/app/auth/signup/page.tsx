"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/constants/icons";
import Link from "next/link";

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    // This is where the backend linking happens later [cite: 66]
    console.log("Signup Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="text-slate-500 text-sm">Join the Babcock Attendance Platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            {...register("name")} 
            error={errors.name?.message as string}
            icon={<Icons.User size={18} />}
          />
          
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="doe.john@babcock.edu.ng" 
            {...register("email")} 
            error={errors.email?.message as string}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Account Type</label>
            <select 
              {...register("role")}
              className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="STUDENT">Student</option>
              <option value="LECTURER">Lecturer</option>
            </select>
          </div>

          <Input 
            label="Password" 
            type="password" 
            {...register("password")} 
            error={errors.password?.message as string}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}