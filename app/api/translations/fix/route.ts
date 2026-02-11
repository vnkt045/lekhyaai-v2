import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TranslationErrorHandler } from "@/lib/translation-error-handler";

export async function GET() {
    try {
        // 1. Fetch all translations
        const allTranslations = await prisma.translation.findMany();

        let fixedCount = 0;
        const updates = [];

        // 2. Iterate and check for errors
        for (const t of allTranslations) {
            const original = t.translatedText;
            const fixed = TranslationErrorHandler.fix(original);

            // 3. If fixed text is different, update it
            if (original !== fixed) {
                updates.push(prisma.translation.update({
                    where: { id: t.id },
                    data: { translatedText: fixed }
                }));
                fixedCount++;
            }
        }

        // 4. Batch update
        await prisma.$transaction(updates);

        return NextResponse.json({
            success: true,
            totalScanned: allTranslations.length,
            fixedCount,
            message: `Scanned ${allTranslations.length} translations and fixed ${fixedCount} errors.`
        });
    } catch (error) {
        console.error("Error fixing translations:", error);
        return NextResponse.json({ error: "Failed to fix translations" }, { status: 500 });
    }
}
