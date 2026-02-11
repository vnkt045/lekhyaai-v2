import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET user preferences (language, etc.)
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ language: "en" });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { language: true }
        });

        return NextResponse.json({
            language: user?.language || "en"
        });
    } catch (error) {
        console.error("Error fetching preferences:", error);
        return NextResponse.json({ language: "en" });
    }
}

// POST - save user preferences
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { language } = await req.json();

        await prisma.user.update({
            where: { id: session.user.id },
            data: { language: language || "en" }
        });

        return NextResponse.json({ success: true, language });
    } catch (error) {
        console.error("Error saving preferences:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
