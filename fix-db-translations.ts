
import { PrismaClient } from '@prisma/client';
import { TranslationErrorHandler } from './lib/translation-error-handler'; // Assuming I can import this if I use ts-node with paths, or I'll just copy the logic here for safety.

const prisma = new PrismaClient();

// Copy of sanitize logic to be sure
function sanitize(text: string): string {
    if (!text) return "";
    let clean = text.replace(/<[^>]*>/g, "");
    clean = clean.replace(/\s+/g, " ").trim();
    return clean;
}

// Fix punctuation spaces
function fix(text: string): string {
    let fixed = sanitize(text);
    fixed = fixed.replace(/\s+([.,!?;:])/g, "$1");
    // Also remove backticks if they appear isolated
    fixed = fixed.replace(/`/g, "");
    return fixed;
}

async function check() {
    console.log("Checking for corrupted translations...");
    const all = await prisma.translation.findMany();

    let corrupted = 0;
    for (const t of all) {
        if (t.translatedText.includes('<') || t.translatedText.includes('>') || t.translatedText.includes('`')) {
            console.log(`[BAD] ID: ${t.id} | Source: "${t.sourceText}" | Bad: "${t.translatedText}"`);

            const fixed = fix(t.translatedText);
            console.log(`      -> Proposed Fix: "${fixed}"`);

            if (fixed !== t.translatedText) {
                await prisma.translation.update({
                    where: { id: t.id },
                    data: { translatedText: fixed }
                });
                console.log("      [FIXED]");
                corrupted++;
            }
        }
    }
    console.log(`Total corrupted found and fixed: ${corrupted}`);
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
