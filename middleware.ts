import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isAuthPage = nextUrl.pathname.startsWith('/login');
    const isDashboardPage = nextUrl.pathname.startsWith('/dashboard');
    const isStudentPage = nextUrl.pathname.startsWith('/student');
    const isEditorPage = nextUrl.pathname.startsWith('/editor');
    const isGuruPage = nextUrl.pathname.startsWith('/guru');
    const isApiRoute = nextUrl.pathname.startsWith('/api');

    // Allow API routes to handle their own auth
    if (isApiRoute) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        if (userRole === 'student') {
            return NextResponse.redirect(new URL('/student', req.url));
        }
        if (userRole === 'editor') {
            return NextResponse.redirect(new URL('/editor', req.url));
        }
        if (userRole === 'guru') {
            return NextResponse.redirect(new URL('/guru', req.url));
        }
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Protect dashboard routes (admin/staff only)
    if (isDashboardPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole === 'student') {
            return NextResponse.redirect(new URL('/student', req.url));
        }
        if (userRole === 'editor') {
            return NextResponse.redirect(new URL('/editor', req.url));
        }
    }

    // Protect student routes (students only)
    if (isStudentPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole !== 'student') {
            if (userRole === 'editor') {
                return NextResponse.redirect(new URL('/editor', req.url));
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Protect editor routes (editors only)
    if (isEditorPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole !== 'editor') {
            if (userRole === 'student') {
                return NextResponse.redirect(new URL('/student', req.url));
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Protect guru routes (guru only)
    if (isGuruPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (userRole !== 'guru') {
            if (userRole === 'student') {
                return NextResponse.redirect(new URL('/student', req.url));
            }
            if (userRole === 'editor') {
                return NextResponse.redirect(new URL('/editor', req.url));
            }
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!_next|api/auth|monitoring).*)'],
};
