"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthCheck({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === "/login") {
            return;
        }

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [pathname, router]);

    return <>{children}</>;
}
