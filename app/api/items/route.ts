import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const items = await prisma.item.findMany({
            where: {
                tenantId: session.user.tenantId
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, hsnCode, unit, gstRate, sellingPrice, purchasePrice, openingStock, description } = body;

        const item = await prisma.item.create({
            data: {
                name,
                hsnCode: hsnCode || null,
                unit: unit || "NOS",
                gstRate: parseFloat(gstRate) || 0,
                sellingPrice: parseFloat(sellingPrice) || 0,
                purchasePrice: parseFloat(purchasePrice) || 0,
                openingStock: parseFloat(openingStock) || 0,
                currentStock: parseFloat(openingStock) || 0,
                description: description || null,
                tenantId: session.user.tenantId,
            }
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error("Error creating item:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
