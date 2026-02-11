"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/language-context";
import { TranslationProgressProvider } from "@/contexts/translation-progress-context";
import { TranslationProgressBar } from "@/components/ui/translation-progress-bar";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <TranslationProgressProvider>
                <LanguageProvider>
                    <TranslationProgressBar />
                    {children}
                </LanguageProvider>
            </TranslationProgressProvider>
        </SessionProvider>
    );
}
