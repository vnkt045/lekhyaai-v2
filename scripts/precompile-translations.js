#!/usr/bin/env node

/**
 * Build-time Translation Pre-compiler
 * 
 * This script:
 * 1. Scans all .tsx/.ts files for <T> components
 * 2. Extracts all text to be translated
 * 3. Translates to all 22 Indian languages
 * 4. Stores in database for instant runtime access
 * 
 * Run: node scripts/precompile-translations.js
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SUPPORTED_LANGUAGES = [
    'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or',
    'as', 'ur', 'sa', 'ks', 'kok', 'mni', 'ne', 'brx', 'doi',
    'mai', 'sat', 'sd'
];

// Extract text from <T> components using regex
function extractTranslatableText(fileContent) {
    const texts = new Set();

    // Match <T>text</T> pattern
    const regex = /<T[^>]*>([^<]+)<\/T>/g;
    let match;

    while ((match = regex.exec(fileContent)) !== null) {
        const text = match[1].trim();
        if (text && !text.includes('{')) { // Exclude dynamic content
            texts.add(text);
        }
    }

    return Array.from(texts);
}

// Recursively scan directory for .tsx and .ts files
function scanDirectory(dir, texts = new Set()) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules, .next, etc.
            if (!['node_modules', '.next', '.git', 'dist'].includes(file)) {
                scanDirectory(filePath, texts);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const extracted = extractTranslatableText(content);
            extracted.forEach(text => texts.add(text));
        }
    }

    return Array.from(texts);
}

// Translate text using MyMemory API
async function translateText(text, targetLang) {
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error(`Error translating "${text}" to ${targetLang}:`, error.message);
        return text; // Fallback to original
    }
}

// Main function
async function precompileTranslations() {
    console.log('🌍 Starting translation pre-compilation...\n');

    // 1. Scan codebase for translatable text
    console.log('📂 Scanning codebase for <T> components...');
    const projectRoot = path.join(__dirname, '..');
    const texts = scanDirectory(projectRoot);

    console.log(`✅ Found ${texts.length} unique translatable texts\n`);

    if (texts.length === 0) {
        console.log('⚠️  No translatable text found. Make sure you\'re using <T> components.');
        return;
    }

    // 2. Translate to all languages
    console.log('🔄 Translating to 22 Indian languages...');
    let translationCount = 0;
    let skippedCount = 0;

    for (const text of texts) {
        for (const lang of SUPPORTED_LANGUAGES) {
            // Check if translation already exists
            const existing = await prisma.translation.findUnique({
                where: {
                    sourceText_targetLang: {
                        sourceText: text,
                        targetLang: lang
                    }
                }
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            // Translate and save
            const translated = await translateText(text, lang);

            await prisma.translation.create({
                data: {
                    sourceText: text,
                    targetLang: lang,
                    translatedText: translated
                }
            });

            translationCount++;
            process.stdout.write(`\r✓ Translated: ${translationCount} | Skipped: ${skippedCount}`);

            // Rate limiting: wait 200ms between API calls
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    console.log('\n\n✅ Translation pre-compilation complete!');
    console.log(`📊 Stats:`);
    console.log(`   - Unique texts: ${texts.length}`);
    console.log(`   - New translations: ${translationCount}`);
    console.log(`   - Already cached: ${skippedCount}`);
    console.log(`   - Total in database: ${translationCount + skippedCount}`);
}

// Run the script
precompileTranslations()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
