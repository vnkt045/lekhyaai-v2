"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TranslationProgressContextType {
    pending: number;
    completed: number;
    total: number;
    isTranslating: boolean;
    startTime: number | null;
    addPending: () => void;
    markCompleted: () => void;
    reset: () => void;
}

const TranslationProgressContext = createContext<TranslationProgressContextType>({
    pending: 0,
    completed: 0,
    total: 0,
    isTranslating: false,
    startTime: null,
    addPending: () => { },
    markCompleted: () => { },
    reset: () => { },
});

export function TranslationProgressProvider({ children }: { children: React.ReactNode }) {
    const [pending, setPending] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [total, setTotal] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    const addPending = useCallback(() => {
        setPending(p => p + 1);
        setTotal(t => t + 1);
        setStartTime(prev => prev ?? Date.now());
    }, []);

    const markCompleted = useCallback(() => {
        setPending(p => {
            const newPending = Math.max(0, p - 1);
            if (newPending === 0) {
                // All done — reset after a short delay to show 100%
                setTimeout(() => {
                    setPending(0);
                    setCompleted(0);
                    setTotal(0);
                    setStartTime(null);
                }, 1500);
            }
            return newPending;
        });
        setCompleted(c => c + 1);
    }, []);

    const reset = useCallback(() => {
        setPending(0);
        setCompleted(0);
        setTotal(0);
        setStartTime(null);
    }, []);

    const isTranslating = pending > 0;

    return (
        <TranslationProgressContext.Provider value={{
            pending,
            completed,
            total,
            isTranslating,
            startTime,
            addPending,
            markCompleted,
            reset,
        }}>
            {children}
        </TranslationProgressContext.Provider>
    );
}

export function useTranslationProgress() {
    return useContext(TranslationProgressContext);
}
