
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { tenantId: true }
        });

        if (!user?.tenantId) {
            return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        // Fetch Invoices for GSTR-1 (Outward Supplies)
        const invoices = await prisma.invoice.findMany({
            where: {
                tenantId: user.tenantId,
                invoiceDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                customer: true
            }
        });

        // Calculate Summary
        let totalSales = 0;
        let taxableValue = 0;
        let totalTax = 0;
        let b2bCount = 0;
        let b2cCount = 0;

        invoices.forEach(inv => {
            const amount = Number(inv.totalAmount);
            const tax = Number(inv.cgst) + Number(inv.sgst) + Number(inv.igst);

            totalSales += amount;
            taxableValue += Number(inv.subtotal);
            totalTax += tax;

            if (inv.customer.gstin && inv.customer.gstin.length > 2) {
                b2bCount++;
            } else {
                b2cCount++;
            }
        });

        // Fetch Purchase Vouchers for GSTR-3B (ITC)
        const purchaseVouchers = await prisma.voucher.findMany({
            where: {
                tenantId: user.tenantId,
                voucherType: "Purchase",
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                entries: {
                    include: {
                        debitLedger: true
                    }
                }
            }
        });

        let itcAvailable = 0;
        let inwardTaxable = 0;

        purchaseVouchers.forEach(voucher => {
            voucher.entries.forEach(entry => {
                // Check if it's a Tax Ledger (Simple heuristic)
                if (entry.debitLedger) {
                    const name = entry.debitLedger.name.toLowerCase();
                    if (name.includes("gst") || name.includes("tax") || name.includes("duty")) {
                        itcAvailable += Number(entry.amount);
                    } else if (name.includes("purchase")) {
                        inwardTaxable += Number(entry.amount);
                    }
                }
            });
        });

        const data = {
            period: `${new Date(startDate).toLocaleString('default', { month: 'short' })} ${year} `,
            gstr1: {
                totalSales,
                taxableValue,
                totalTax,
                b2bCount,
                b2cCount,
                invoiceCount: invoices.length
            },
            gstr3b: {
                outwardTaxable: taxableValue,
                taxPayable: totalTax,
                itcAvailable,
                inwardTaxable
            }
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Failed to fetch GST returns:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
