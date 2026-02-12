import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = params.id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                tenantId: (session.user as any).tenantId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                designation: true,
                permissions: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
