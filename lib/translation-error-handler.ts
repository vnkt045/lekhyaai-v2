export class TranslationErrorHandler {
    /**
     * Removes HTML/XML tags from the translated text.
     * key:value pairs might be preserved if needed, but for now we strip all tags.
     */
    static sanitize(text: string): string {
        if (!text) return "";
        // Remove <g id="1">, </g>, <x id="1"/>, etc.
        // Also remove specific artifacts like `&#39;` if they appear raw (though usually decoded by browser)
        let clean = text.replace(/<[^>]*>/g, "");

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
