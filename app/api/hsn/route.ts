import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        // Allow unauthenticated access? Probably not for production, but maybe for public facing?
        // Let's require auth for now as per app standard.
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const hsnCodes = await prisma.hSNCode.findMany({
            where: {
                OR: [
                    { code: { startsWith: query } },
                    { description: { contains: query } } // Case insensitive in SQLite/Postgres usually or depends on collation
                ]
            },
            take: 20,
            orderBy: {
                code: 'asc'
            }
        });

        return NextResponse.json(hsnCodes);
    } catch (error) {
        console.error("HSN Search error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
