
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: List specific payrolls
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const month = searchParams.get("month");
        const year = searchParams.get("year");

        const where: any = {
            tenantId: session.user.tenantId,
        };

        if (month) where.month = parseInt(month);
        if (year) where.year = parseInt(year);

        const payrolls = await prisma.payroll.findMany({
            where,
            include: {
                employee: {
                    select: { name: true, designation: true }
                },
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(payrolls);
    } catch (error) {
        console.error("[PAYROLL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
