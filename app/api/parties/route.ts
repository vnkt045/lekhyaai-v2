import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const parties = await prisma.ledger.findMany({
            where: {
                tenantId: session.user.tenantId,
                group: {
                    name: { in: ["Sundry Debtors", "Sundry Creditors"] }
                }
            },
            include: {
                group: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(parties);
    } catch (error) {
        console.error("Error fetching parties:", error);
        return NextResponse.json({ error: "Failed to fetch parties" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, type, gstin, pan, email, phone, address, state, openingBalance } = body;

        // Determine group based on type
        let groupName = "Sundry Debtors"; // customer
        if (type === "supplier") groupName = "Sundry Creditors";
        if (type === "both") groupName = "Sundry Debtors"; // Default to customer

        // Find the group
        const group = await prisma.group.findFirst({
            where: {
                tenantId: session.user.tenantId,
                name: groupName
            }
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Create ledger (party)
        const party = await prisma.ledger.create({
            data: {
                name,
                groupId: group.id,
                tenantId: session.user.tenantId,
                gstin: gstin || null,
                pan: pan || null,
                address: address || null,
                state: state || null,
                openingBalance: parseFloat(openingBalance) || 0,
                currentBalance: parseFloat(openingBalance) || 0,
            }
        });

        return NextResponse.json(party, { status: 201 });
    } catch (error) {
        console.error("Error creating party:", error);
        return NextResponse.json({ error: "Failed to create party" }, { status: 500 });
    }
}
