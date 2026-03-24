import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // ARCHITECTURE NOTE:
    // Due to cross-domain security (Netlify Frontend -> Render Backend),
    // the Next.js Edge Middleware cannot physically read the cross-site HttpOnly JWT cookies.
    // Therefore, all route protection is strictly delegated to the Client-Side
    // inside DashboardLayout.tsx utilizing the AuthContext.

    return NextResponse.next();
}

export const config = {
    // Remove matcher entirely so the middleware doesn't trigger unnecessary Edge compute
    matcher: [],
};
