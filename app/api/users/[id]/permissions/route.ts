
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        // Only admin can change permissions
        if (session?.user?.role !== 'admin' && session?.user?.role !== 'owner') {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { permissions, role } = body;

        const user = await prisma.user.update({
            where: {
                id: id,
                tenantId: session.user.tenantId
            },
            data: {
                permissions,
                // Only allow role update if provided
                ...(role && { role })
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PERMISSIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
