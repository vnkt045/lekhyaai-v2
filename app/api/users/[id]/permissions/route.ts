import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUserId = session.user.id;
        // const currentUserRole = (session.user as any).role; // If implemented

        // TODO: Strict security check
        // Only admin should be able to update permissions or role
        // if (currentUserRole !== 'admin') { ... }

        const body = await req.json();
        const { permissions, role } = body;

        const updatedUser = await prisma.user.update({
            where: {
                id: params.id, // Check tenant too? Ideally yes, but ID is unique
                // Safe if we assume UUIDs are unguessable, but better to check tenant
                tenantId: (session.user as any).tenantId
            },
            data: {
                permissions,
                // Only allow updating role if provided
                ...(role && { role })
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating permissions:", error);
        return NextResponse.json({ error: "Failed to update permissions" }, { status: 500 });
    }
}
