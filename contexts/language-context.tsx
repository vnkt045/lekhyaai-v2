"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translationService } from "@/lib/translation-service";

type Language = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu" | "kn" | "ml" | "pa" | "or" | "as" | "ur" | "sa" | "ks" | "kok" | "mni" | "ne" | "brx" | "doi" | "mai" | "sat" | "sd";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (text: string) => Promise<string>;
    tSync: (text: string) => string;
}

export const SUPPORTED_LANGUAGES = {
    en: "English",
    hi: "हिंदी (Hindi)",
    ta: "தமிழ் (Tamil)",
    te: "తెలుగు (Telugu)",
    bn: "বাংলা (Bengali)",
    mr: "मराठी (Marathi)",
    gu: "ગુજરાતી (Gujarati)",
    kn: "ಕನ್ನಡ (Kannada)",
    ml: "മലയാളം (Malayalam)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
    or: "ଓଡ଼ିଆ (Odia)",
    as: "অসমীয়া (Assamese)",
    ur: "اردو (Urdu)",
    sa: "संस्कृतम् (Sanskrit)",
    ks: "कॉशुर (Kashmiri)",
    kok: "कोंकणी (Konkani)",
    mni: "মৈতৈলোন্ (Manipuri)",
    ne: "नेपाली (Nepali)",
    brx: "बड़ो (Bodo)",
    doi: "डोगरी (Dogri)",
    mai: "मैथिली (Maithili)",
    sat: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)",
    sd: "سنڌي (Sindhi)"
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

    // Load saved language preference - try API first (persists across deployments), localStorage as fallback
    useEffect(() => {
        const loadLanguage = async () => {
            // Try localStorage first for instant load
            const localSaved = localStorage.getItem("language") as Language;
            if (localSaved && SUPPORTED_LANGUAGES[localSaved]) {
                setLanguage(localSaved);
            }

            // Then check API for server-persisted preference (authoritative)
            try {
                const res = await fetch("/api/user/preferences");
                if (res.ok) {
                    const data = await res.json();
                    if (data.language && SUPPORTED_LANGUAGES[data.language as Language]) {
                        const serverLang = data.language as Language;
                        setLanguage(serverLang);
                        localStorage.setItem("language", serverLang);
                    }
                }
            } catch {
                // API unavailable, use localStorage value
            }
        };

        loadLanguage();
    }, []);

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        setTranslationCache(new Map()); // Clear cache when language changes

        // Persist to server (fire-and-forget)
        fetch("/api/user/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: lang })
        }).catch(() => { });
    }, []);

    // Async translation function
    const t = useCallback(async (text: string): Promise<string> => {
        if (language === "en" || !text.trim()) {
            return text;
        }

        const cacheKey = `${text}_${language}`;

        // Check in-memory cache
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey)!;
        }

        // Translate using service (checks DB then external API)
        const translated = await translationService.translate(text, language);

        // Update cache
        setTranslationCache(prev => new Map(prev).set(cacheKey, translated));

        return translated;
    }, [language, translationCache]);

    // Sync translation (returns original if not cached)
    const tSync = useCallback((text: string): string => {
        if (language === "en" || !text.trim()) {
            return text;
        }

        const cacheKey = `${text}_${language}`;
        return translationCache.get(cacheKey) || text;
    }, [language, translationCache]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tSync }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
