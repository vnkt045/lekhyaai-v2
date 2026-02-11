
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        // Only admin can update company settings
        if (session?.user?.role !== 'admin' && session?.user?.role !== 'owner') {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        if (!session?.user?.tenantId) {
            return new NextResponse("Tenant ID missing", { status: 400 });
        }

        const body = await req.json();
        const {
            companyName,
            gstin,
            pan,
            state,
            address,
            email,
            phone,
            financialYear,
            turnover,
            gstRegType
        } = body;

        const tenant = await prisma.tenant.update({
            where: {
                id: session.user.tenantId
            },
            data: {
                companyName,
                gstin,
                pan,
                state,
                address,
                email,
                phone,
                financialYear,
                turnover,
                gstRegType
            }
        });

        return NextResponse.json(tenant);

    } catch (error) {
        console.error("Failed to update tenant:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
