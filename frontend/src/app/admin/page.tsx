/**
 * @fileoverview Contextual execution boundary for frontend/src/app/admin/page.tsx
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { redirect } from 'next/navigation';

export default function AdminIndex() {
    redirect('/admin/dashboard');
}

