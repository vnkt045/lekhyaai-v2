import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Ideally check for admin role here
        if ((session.user as any).role !== 'admin') {
            // Or check permissions
        }

        const users = await prisma.user.findMany({
            where: {
                tenantId: (session.user as any).tenantId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                designation: true,
                // Do not expose password
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
