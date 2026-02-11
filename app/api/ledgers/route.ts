import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const ledgers = await prisma.ledger.findMany({
            where: {
                tenantId: session.user.tenantId,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(ledgers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch ledgers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, groupId, openingBalance } = body;

        const ledger = await prisma.ledger.create({
            data: {
                name,
                groupId,
                openingBalance: openingBalance || 0,
                currentBalance: openingBalance || 0,
                tenantId: session.user.tenantId,
            },
        });

        return NextResponse.json(ledger, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create ledger" }, { status: 500 });
    }
}
