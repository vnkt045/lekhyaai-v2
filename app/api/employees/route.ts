
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check permission (RBAC check placeholder)
        // if (session.user.role !== 'admin' && !session.user.permissions?.employees?.read) ...

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const department = searchParams.get("department");

        const where: any = {
            tenantId: session.user.tenantId,
        };

        if (query) {
            where.OR = [
                { name: { contains: query } },
                { email: { contains: query } },
                { phone: { contains: query } },
            ];
        }

        if (department && department !== 'all') {
            where.department = department;
        }

        const employees = await prisma.employee.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("[EMPLOYEES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check permission
        // if (session.user.role !== 'admin' && !session.user.permissions?.employees?.write) ...

        const body = await req.json();
        const { name, designation, department, email, phone, dateOfJoining, salary, bankDetails } = body;

        if (!name || !designation || !dateOfJoining) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const employee = await prisma.employee.create({
            data: {
                name,
                designation,
                department,
                email,
                phone,
                dateOfJoining: new Date(dateOfJoining),
                salary: salary ? parseFloat(salary) : null,
                bankDetails: bankDetails || {}, // Json
                tenantId: session.user.tenantId,
                status: "Active"
            }
        });

        return NextResponse.json(employee);
    } catch (error) {
        console.error("[EMPLOYEES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
