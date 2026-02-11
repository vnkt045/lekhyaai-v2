"use client";

import { useTranslationProgress } from "@/contexts/translation-progress-context";
import { useEffect, useState, useRef } from "react";

export function TranslationProgressBar() {
    // Translation progress bar disabled - translations run silently in background
    // User requested to remove the intrusive progress bar
    return null;

    /* Original code commented out - can be re-enabled if needed
    const { isTranslating, completed, total, startTime } = useTranslationProgress();
    const [elapsed, setElapsed] = useState(0);
    const [visible, setVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Show/hide with animation
    useEffect(() => {
        if (isTranslating) {
            setVisible(true);
        } else if (visible && total > 0) {
            // Keep visible briefly at 100%
            const timeout = setTimeout(() => setVisible(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [isTranslating, visible, total]);

    // Realtime timer
    useEffect(() => {
        if (isTranslating && startTime) {
            intervalRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 100) / 10);
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isTranslating, startTime]);

    if (!visible) return null;

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isDone = !isTranslating && progress >= 100;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999]">
            <div className="relative h-10 bg-[#001f3f] shadow-lg border-t border-white/10">
                <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        {isTranslating ? (
                            <div className="relative w-5 h-5">
                                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            </div>
                        ) : (
                            <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        <span className="text-white text-sm font-medium tracking-wide">
                            {isDone
                                ? "✨ Translation complete"
                                : `🌐 Translating... ${completed}/${total}`
                            }
                        </span>
                    </div>

                    <div className="flex-1 mx-6 max-w-md">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${isDone ? 100 : progress}%`,
                                    background: isDone ? "#22c55e" : "#FF851B",
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-white/80 text-xs font-mono tabular-nums">
                            {elapsed.toFixed(1)}s
                        </span>
                        <span className="text-white/60 text-xs">
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 right-0 h-0.5">
                {isTranslating && (
                    <div className="h-full bg-cyan-400 animate-pulse"
                        style={{ width: `${progress}%`, transition: "width 0.3s ease-out" }} />
                )}
            </div>
        </div>
    );
    */
}
