/**
 * @fileoverview Contextual execution boundary for frontend/src/app/student/page.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { redirect } from 'next/navigation';

export default function StudentIndex() {
    redirect('/student/dashboard');
}

