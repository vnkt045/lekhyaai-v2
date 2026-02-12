
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.tenantId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { month, year } = body;
        // month is 1-12, year is e.g. 2024

        if (!month || !year) {
            return new NextResponse("Month and Year required", { status: 400 });
        }

        const period = `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })}-${year}`;

        // 1. Get all active employees
        const employees = await prisma.employee.findMany({
            where: {
                tenantId: session.user.tenantId,
                status: "Active"
            }
        });

        if (employees.length === 0) {
            return NextResponse.json({ message: "No active employees found", count: 0 });
        }

        let createdCount = 0;
        let skippedCount = 0;

        // 2. Process each employee
        for (const emp of employees) {
            // Check if payroll already exists for this period
            const existing = await prisma.payroll.findUnique({
                where: {
                    tenantId_employeeId_period: {
                        tenantId: session.user.tenantId,
                        employeeId: emp.id,
                        period
                    }
                }
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            // 3. Calculate salary components
            const totalSalary = emp.salary || 0;
            const structure = emp.salaryStructure as any;

            let basic, hra, special, pf, pt;

            if (structure && structure.basic) {
                // Use defined structure
                basic = parseFloat(structure.basic) || 0;
                hra = parseFloat(structure.hra) || 0;
                special = parseFloat(structure.special) || 0;
                pf = parseFloat(structure.pf) || 0;
                pt = parseFloat(structure.pt) || 0;
            } else {
                // Fallback to default logic
                basic = totalSalary * 0.5;
                hra = totalSalary * 0.4;
                special = totalSalary * 0.1;
                pf = basic * 0.12;
                pt = 200;
            }

            const totalEarnings = basic + hra + special;
            const totalDeductions = pf + pt;
            const netSalary = totalEarnings - totalDeductions;

            // 4. Create Payroll Record
            await prisma.payroll.create({
                data: {
                    period,
                    month,
                    year,
                    employeeId: emp.id,
                    tenantId: session.user.tenantId,
                    basicSalary: basic,
                    totalEarnings,
                    totalDeductions,
                    netSalary,
                    status: "Draft",
                    items: {
                        create: [
                            { name: "Basic Salary", type: "Earning", amount: basic },
                            { name: "HRA", type: "Earning", amount: hra },
                            { name: "Special Allowance", type: "Earning", amount: special },
                            { name: "Provident Fund", type: "Deduction", amount: pf },
                            { name: "Professional Tax", type: "Deduction", amount: pt },
                        ]
                    }
                }
            });
            createdCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Generated ${createdCount} payslips. Skipped ${skippedCount} existing.`,
            createdCount,
            skippedCount
        });

    } catch (error) {
        console.error("[PAYROLL_GENERATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
