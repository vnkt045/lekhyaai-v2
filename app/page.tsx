"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

export default function HomePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        // Use setTimeout to ensure hydration is complete and yield to event loop
        const timer = setTimeout(() => {
            if (isLoggedIn) {
                window.location.href = "/dashboard";
            } else {
                window.location.href = "/login";
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 font-medium animate-pulse">Loading LekhyaAI...</p>
            </div>
        </div>
    );
}
