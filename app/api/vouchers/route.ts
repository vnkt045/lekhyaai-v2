import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.tenantId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { date, type, narration, entries } = body;

        // Basic validation
        const totalDebit = entries.reduce((sum: number, e: any) => sum + (e.type === 'by' ? Number(e.amount) : 0), 0);
        const totalCredit = entries.reduce((sum: number, e: any) => sum + (e.type === 'to' ? Number(e.amount) : 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            return NextResponse.json({ error: "Debit and Credit totals do not match" }, { status: 400 });
        }

        // Generate Voucher Number (Simple Auto-increment logic for now, or just random)
        // Ideally should query max voucher number for tenant and increment.
        const count = await prisma.voucher.count({ where: { tenantId: session.user.tenantId } });
        const voucherNumber = `${type.toUpperCase().substring(0, 3)}-${String(count + 1).padStart(4, '0')}`;

        const result = await prisma.$transaction(async (tx) => {
            // Create Voucher
            const voucher = await tx.voucher.create({
                data: {
                    voucherNumber,
                    voucherType: type,
                    date: new Date(date),
                    narration,
                    totalAmount: totalDebit,
                    tenantId: session.user.tenantId,
                },
            });

            // Create Entries
            for (const entry of entries) {
                await tx.voucherEntry.create({
                    data: {
                        voucherId: voucher.id,
                        amount: entry.amount,
                        debitLedgerId: entry.type === 'by' ? entry.ledgerId : null,
                        creditLedgerId: entry.type === 'to' ? entry.ledgerId : null,
                    }
                });

                // Update Ledger Balances logic would go here
            }

            return voucher;
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        console.error("Voucher creation error:", error);
        return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 });
    }
}
