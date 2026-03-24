/**
 * @fileoverview Contextual execution boundary for frontend/src/app/layout.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/components/providers/QueryProvider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeriPoint - Attendance System",
  description: "Enterprise University Attendance Verification System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-body bg-slate-50 text-slate-900`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

