
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TranslationErrorHandler } from "@/lib/translation-error-handler";

export async function POST(req: Request) {
    try {
        const { sourceText, targetLang } = await req.json();

        if (!sourceText || !targetLang) {
            return new NextResponse("Missing params", { status: 400 });
        }

        // 1. Check DB first
        const translation = await prisma.translation.findUnique({
            where: {
                sourceText_targetLang: {
                    sourceText,
                    targetLang
                }
            }
        });

        if (translation) {
            // Validate cached content (DB cleanup handling)
            const sanitized = TranslationErrorHandler.fix(translation.translatedText);
            return NextResponse.json({ translatedText: sanitized });
        }

        // 2. Not in DB, call External API (Server-side)
        // MyMemory requires email for more quota, but works anonymously for small volume
        // Ideally use process.env.MYMEMORY_EMAIL if available
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=en|${targetLang}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        let translatedText = data.responseData.translatedText;

        // 3. Handle Null/Invalid
        if (!translatedText || translatedText === sourceText) {
            // Fallback to original
            translatedText = sourceText;
            // We might not want to save this if we think transient error, but user wants "avoid api calls in real time"
            // So we should save it to prevent re-fetching. 
            // Maybe verify if it's a known unsupported language.
        } else {
            // 4. Sanitize
            translatedText = TranslationErrorHandler.fix(translatedText);
        }

        // 5. Save to DB
        // Check if exists again to avoid race condition unique constraint error
        // Or use upsert
        await prisma.translation.upsert({
            where: {
                sourceText_targetLang: {
                    sourceText,
                    targetLang
                }
            },
            update: {
                translatedText
            },
            create: {
                sourceText,
                targetLang,
                translatedText
            }
        });

        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error("[TRANSLATION_API]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
