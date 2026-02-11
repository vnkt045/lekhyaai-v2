
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Only Admin/Owner should see users?
        // if (session.user.role !== 'admin' && session.user.role !== 'owner') ...

        const users = await prisma.user.findMany({
            where: {
                tenantId: session.user.tenantId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                designation: true,
                permissions: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
