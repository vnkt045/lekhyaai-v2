import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { sourceText, targetLang } = await req.json();

        const translation = await prisma.translation.findUnique({
            where: {
                sourceText_targetLang: {
                    sourceText,
                    targetLang
                }
            }
        });

        if (translation) {
            return NextResponse.json({ translatedText: translation.translatedText });
        }

        return NextResponse.json({ translatedText: null }, { status: 404 });
    } catch (error) {
        console.error("Error fetching translation:", error);
        return NextResponse.json({ error: "Failed to fetch translation" }, { status: 500 });
    }
}
