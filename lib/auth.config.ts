import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // The POS/Authenticated routes are in (authenticated) group.
            // But URL might be /dashboard, not /(authenticated)/dashboard.
            // Next.js maps them.
            // We should check paths that require auth.
            const isProtected =
                nextUrl.pathname.startsWith("/dashboard") ||
                nextUrl.pathname.startsWith("/gst") ||
                nextUrl.pathname.startsWith("/vouchers") ||
                nextUrl.pathname.startsWith("/invoices") ||
                nextUrl.pathname.startsWith("/ledgers") ||
                nextUrl.pathname.startsWith("/reports") ||
                nextUrl.pathname.startsWith("/settings") ||
                nextUrl.pathname.startsWith("/items") ||
                nextUrl.pathname.startsWith("/parties");

            if (isProtected) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
