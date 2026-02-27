import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const path = request.nextUrl.pathname;

    // Public routes (accessible without authentication)
    const publicRoutes = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/',
    ];

    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));
    // strict check for exactly '/' or starting with public route e.g. /login
    const exactPublicRoute = publicRoutes.includes(path);

    // Protected routes
    const protectedRoutes = [
        { path: '/admin', roles: ['Admin'] },
        { path: '/lecturer', roles: ['Lecturer', 'Admin'] },
        { path: '/student', roles: ['Student'] }, // 'Student' replaces 'Applicant', etc. based on User schema.
    ];

    // If accessing public route while logged in, redirect to dashboard
    if (exactPublicRoute && accessToken && path !== '/') {
        try {
            // Very basic verify via token payload isn't secure enough if the token is tampered,
            // but the backend handles real validation. Here we can decode without verifying just to route,
            // OR we can fetch from the backend. The user snippet requested fetching from backend `/api/auth/me`.
            const user = await verifyToken(accessToken);
            if (user) {
                const dashboardPath = getDashboardPath(user.role);
                return NextResponse.redirect(new URL(dashboardPath, request.url));
            }
        } catch {
            // Invalid token - allow access to public route
            return NextResponse.next();
        }
    }

    // If accessing protected route without token, redirect to login
    const isProtectedRoute = protectedRoutes.some(route =>
        path.startsWith(route.path)
    );

    if (isProtectedRoute && !accessToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    // If accessing protected route with token, verify role
    if (isProtectedRoute && accessToken) {
        try {
            const user = await verifyToken(accessToken);

            const route = protectedRoutes.find(r => path.startsWith(r.path));
            if (route && !route.roles.includes(user.role)) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }

            return NextResponse.next();
        } catch {
            // Invalid token - redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', path);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

async function verifyToken(token: string) {
    try {
        const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        // Call backend /api/auth/me to verify token
        const response = await fetch(`${apiUrl}/api/auth/me`, {
            headers: {
                Cookie: `accessToken=${token}`,
            },
            // Important to not cache this
            cache: 'no-store'
        });

        if (!response.ok) throw new Error('Invalid token');

        const data = await response.json();
        return data.data;
    } catch (err) {
        throw err;
    }
}

function getDashboardPath(role: string) {
    switch (role) {
        case 'Admin':
            return '/admin/dashboard';
        case 'Lecturer':
            return '/lecturer/dashboard';
        case 'Student':
            return '/student/dashboard';
        default:
            return '/login';
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
