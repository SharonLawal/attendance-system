"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/constants/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    // Logic for backend integration goes here
    console.log("Login Data:", data);
  };

  const handleDemoMode = () => {
    // Bypass authentication for frontend development
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="doe.john@babcock.edu.ng" 
            {...register("email")} 
            error={errors.email?.message as string}
          />
          
          <Input 
            label="Password" 
            type="password" 
            {...register("password")} 
            error={errors.password?.message as string}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-2 text-slate-400">Or</span></div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-slate-300 text-slate-600 hover:bg-slate-50"
              onClick={handleDemoMode}
            >
              Enter Demo Mode
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}