
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const payroll = await prisma.payroll.findUnique({
            where: {
                id: params.id,
                tenantId: session.user.tenantId
            },
            include: {
                employee: true,
                items: true,
                tenant: true // Include company details for payslip header
            }
        });

        if (!payroll) {
            return new NextResponse("Payroll record not found", { status: 404 });
        }

        return NextResponse.json(payroll);
    } catch (error) {
        console.error("[PAYROLL_DETAIL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
