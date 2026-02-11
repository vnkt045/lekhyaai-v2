"use client";

import { useLanguage } from "@/contexts/language-context";
import { useTranslationProgress } from "@/contexts/translation-progress-context";
import { useEffect, useState, useRef } from "react";

interface TranslateProps {
    children: string;
    className?: string;
}

export function T({ children, className }: TranslateProps) {
    const { language, t } = useLanguage();
    const { addPending, markCompleted } = useTranslationProgress();
    const [translated, setTranslated] = useState(children);
    const [isLoading, setIsLoading] = useState(false);
    const trackedRef = useRef(false);

    useEffect(() => {
        if (language === "en") {
            setTranslated(children);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Track this translation in the global progress
        if (!trackedRef.current) {
            trackedRef.current = true;
            addPending();
        }

        t(children)
            .then((result) => {
                setTranslated(result);
            })
            .finally(() => {
                setIsLoading(false);
                if (trackedRef.current) {
                    trackedRef.current = false;
                    markCompleted();
                }
            });
    }, [children, language, t, addPending, markCompleted]);

    // Reset tracking when language changes
    useEffect(() => {
        trackedRef.current = false;
    }, [language]);

    if (isLoading) {
        return (
            <span className={`inline-block ${className || ""}`}>
                <span className="relative inline-block overflow-hidden">
                    {/* Show original text with shimmer overlay */}
                    <span className="opacity-40">{children}</span>
                    <span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        style={{
                            animation: "shimmer 1.5s ease-in-out infinite",
                        }}
                    />
                </span>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </span>
        );
    }

    return (
        <span className={className}>
            {translated}
        </span>
    );
}
