export class TranslationErrorHandler {
    /**
     * Decodes HTML entities to proper Unicode characters
     */
    static decodeHTMLEntities(text: string): string {
        if (!text) return "";

        // Decode numeric entities like &#2980; (Tamil characters)
        text = text.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(dec);
        });

        // Decode hex entities like &#x0BAE;
        text = text.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        // Decode common named entities
        const entities: { [key: string]: string } = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': "'",
            '&nbsp;': ' '
        };

        text = text.replace(/&[a-z]+;/gi, (match) => {
            return entities[match.toLowerCase()] || match;
        });

        return text;
    }

    /**
     * Removes HTML/XML tags from the translated text.
     * key:value pairs might be preserved if needed, but for now we strip all tags.
     */
    static sanitize(text: string): string {
        if (!text) return "";

        // First decode HTML entities
        let clean = this.decodeHTMLEntities(text);

        // Remove <g id="1">, </g>, <x id="1"/>, etc.
        clean = clean.replace(/<[^>]*>/g, "");

        // Remove multiple spaces
        clean = clean.replace(/\s+/g, " ").trim();

        return clean;
    }

    /**
     * Validates the translation.
     * Returns true if valid, false if suspicious (e.g. empty, or just symbols).
     */
    static validate(original: string, translated: string): boolean {
        if (!translated || !translated.trim()) return false;

        // If original had no tags but translated has tags, that's bad (handled by sanitize, but good to know)
        if (!/<[^>]*>/.test(original) && /<[^>]*>/.test(translated)) return false;

        return true;
    }

    /**
     * Heuristic to fix common translation glitches
     */
    static fix(text: string): string {
        let fixed = this.sanitize(text);

        // Fix spaces before punctuation (common in some AI translations)
        fixed = fixed.replace(/\s+([.,!?;:])/g, "$1");

        return fixed;
    }
}
