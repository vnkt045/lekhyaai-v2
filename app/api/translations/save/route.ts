import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { sourceText, targetLang, translatedText } = await req.json();

        const translation = await prisma.translation.upsert({
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

        return NextResponse.json(translation);
    } catch (error) {
        console.error("Error saving translation:", error);
        return NextResponse.json({ error: "Failed to save translation" }, { status: 500 });
    }
}
