
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
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const where: any = {
            tenantId: user.tenantId
        };

        if (from || to) {
            where.invoiceDate = {};
            if (from) where.invoiceDate.gte = new Date(from);
            if (to) where.invoiceDate.lte = new Date(to);
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: { customer: true, items: true },
            orderBy: { invoiceDate: 'desc' }
        });

        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Failed to fetch invoices:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
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

        const body = await req.json();
        const {
            customerName,
            customerGSTIN,
            invoiceDate,
            items,
            supplyType
        } = body;

        // 1. Find or Create Customer Ledger
        // Note: In a real app, we should probably select from existing ledgers.
        // For simplicity/POS speed, we'll find by name or create a Sundry Debtor.

        let customer = await prisma.ledger.findFirst({
            where: {
                tenantId: user.tenantId,
                name: customerName
            }
        });

        if (!customer) {
            // Find "Sundry Debtors" group
            const debtorsGroup = await prisma.group.findFirst({
                where: { tenantId: user.tenantId, name: "Sundry Debtors" }
            });

            if (debtorsGroup) {
                customer = await prisma.ledger.create({
                    data: {
                        name: customerName,
                        gstin: customerGSTIN,
                        groupId: debtorsGroup.id,
                        tenantId: user.tenantId,
                        state: customerGSTIN.substring(0, 2) // Simple logic
                    }
                });
            } else {
                return NextResponse.json({ error: "Sundry Debtors group not found. Run seed?" }, { status: 400 });
            }
        }

        // 2. Calculate Totals
        let subtotal = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;

        const invoiceItems = items.map((item: any) => {
            const amount = parseFloat(item.amount);
            const gstRate = parseFloat(item.gstRate);
            let cgst = 0, sgst = 0, igst = 0;

            if (supplyType === "Intrastate") {
                cgst = (amount * (gstRate / 2)) / 100;
                sgst = (amount * (gstRate / 2)) / 100;
            } else {
                igst = (amount * gstRate) / 100;
            }

            subtotal += amount;
            totalCGST += cgst;
            totalSGST += sgst;
            totalIGST += igst;

            return {
                description: item.description,
                hsnCode: item.hsnCode,
                quantity: parseFloat(item.quantity),
                rate: parseFloat(item.rate),
                amount: amount,
                gstRate: gstRate,
                cgst,
                sgst,
                igst
            };
        });

        const totalAmount = subtotal + totalCGST + totalSGST + totalIGST;

        // 3. Create Invoice Transaction
        const invoice = await prisma.$transaction(async (tx) => {
            // Generate Invoice Number (Simple Auto-increment logic or Random for now to avoid collision)
            const count = await tx.invoice.count({ where: { tenantId: user.tenantId } });
            const invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;

            const newInvoice = await tx.invoice.create({
                data: {
                    invoiceNumber,
                    invoiceDate: new Date(invoiceDate),
                    customerId: customer!.id,
                    placeOfSupply: customerGSTIN.substring(0, 2) || "27",
                    supplyType,
                    subtotal,
                    cgst: totalCGST,
                    sgst: totalSGST,
                    igst: totalIGST,
                    totalAmount,
                    tenantId: user.tenantId,
                    items: {
                        create: invoiceItems
                    }
                }
            });

            // TODO: Create Accounting Voucher (Journal) automatically here? 
            // Leaving it for now to keep it simple. GSTR-1 reads Invoice table.

            return newInvoice;
        });

        return NextResponse.json(invoice);

    } catch (error) {
        console.error("Failed to create invoice:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
