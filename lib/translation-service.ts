import { TranslationErrorHandler } from "@/lib/translation-error-handler";

interface TranslationCache {
    [key: string]: {
        [lang: string]: string;
    };
}

class TranslationService {
    private memoryCache: TranslationCache = {};

    // Check database for cached translation (Client calls API, Server calls DB directly?)
    // To keep it simple and safe for dual usage, we'll rely on the API route which handles DB check.
    // The previous getFromDB/saveToDB methods are now largely redundant if we use the backend API for everything,
    // but getFromDB is useful for checking cache without triggering external API.

    // However, the user wants "read from database to avoid API calls".
    // Our new /api/translations/translate route DOES exactly that (Check DB -> if missing -> External -> Save).
    // So Client just needs to call that route.

    async translate(text: string, targetLang: string): Promise<string> {
        // Return original if English or empty
        if (targetLang === 'en' || !text.trim()) {
            return text;
        }

        // Check memory cache first (fastest)
        const memoryKey = `${text}_${targetLang}`;
        if (this.memoryCache[text]?.[targetLang]) {
            return this.memoryCache[text][targetLang];
        }

        // Call Internal Backend API which handles:
        // 1. DB Cache Check
        // 2. External API Fallback (Server-side)
        // 3. Sanitization
        // 4. Saving to DB
        try {
            // Note: Relative URL works in Client Components and usually in Next.js Server Actions/Components context 
            // if configured, but safe to assume this runs mostly on client for dynamic UI
            const response = await fetch('/api/translations/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceText: text, targetLang })
            });

            if (response.ok) {
                const data = await response.json();
                let translation = data.translatedText;

                // Cache in memory
                if (translation) {
                    if (!this.memoryCache[text]) this.memoryCache[text] = {};
                    this.memoryCache[text][targetLang] = translation;
                    return translation;
                }
            }
            return text;
        } catch (error) {
            console.error('Translation Backend API error:', error);
            return text; // Fallback to original text
        }
    }

    async translateBatch(texts: string[], targetLang: string): Promise<string[]> {
        return Promise.all(texts.map(text => this.translate(text, targetLang)));
    }
}

export const translationService = new TranslationService();
