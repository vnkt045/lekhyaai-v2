
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

async function getComplianceData(tenantId: string) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Deadlines Logic (Simplified)
    // GSTR-1: 11th of next month
    // GSTR-3B: 20th of next month

    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const deadlineGSTR1 = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 11);
    const deadlineGSTR3B = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 20);

    // Check if filed for LAST month (which is due now/soon)
    // Actually, usually you file for previous month. 
    // Example: In Feb, you file for Jan.

    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const period = `${previousMonthDate.toLocaleString('default', { month: 'short' })}-${previousMonthDate.getFullYear()}`;

    // Fetch return status
    const gstr1 = await db.gSTReturn.findFirst({
        where: { tenantId, returnType: 'GSTR1', period }
    });

    const gstr3b = await db.gSTReturn.findFirst({
        where: { tenantId, returnType: 'GSTR3B', period }
    });

    // Calculate Liability (Estimate for current month or previous?)
    // Let's show liability for the RETURN PERIOD (Previous Month)

    const startOfPeriod = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), 1);
    const endOfPeriod = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth() + 1, 0); // Last day

    // Fetch Invoices (Sales)
    const invoices = await db.invoice.findMany({
        where: {
            tenantId,
            invoiceDate: { gte: startOfPeriod, lte: endOfPeriod }
        },
        include: { items: true }
    });

    // Fetch Purchase Bills (ITC)
    const bills = await db.purchaseBill.findMany({
        where: {
            tenantId,
            billDate: { gte: startOfPeriod, lte: endOfPeriod }
        },
        include: { items: true }
    });

    const outputTax = invoices.reduce((sum, inv) => sum + Number(inv.cgst) + Number(inv.sgst) + Number(inv.igst), 0);
    const inputTax = bills.reduce((sum, bill) => sum + Number(bill.cgst) + Number(bill.sgst) + Number(bill.igst), 0);

    const liability = Math.max(0, outputTax - inputTax);

    return {
        period,
        deadlines: {
            gstr1: deadlineGSTR1,
            gstr3b: deadlineGSTR3B
        },
        status: {
            gstr1: gstr1?.status || 'Pending',
            gstr3b: gstr3b?.status || 'Pending'
        },
        liability,
        outputTax,
        inputTax
    };
}

export default async function CompliancePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const data = await getComplianceData(session.user.tenantId);

    const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const getDaysLeft = (d: Date) => Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track GST returns, deadlines, and tax liability</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg border border-blue-100">
                    <CalendarDays className="w-5 h-5" />
                    <span className="font-semibold">Period: {data.period}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tax Liability Card */}
                <Card className="md:col-span-1 border-l-4 border-l-primary-500 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-700">Net Tax Liability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(data.liability)}</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Output Tax (Sales):</span>
                                <span className="font-medium text-red-600">+{formatCurrency(data.outputTax)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Input Tax Credit (Purchases):</span>
                                <span className="font-medium text-green-600">-{formatCurrency(data.inputTax)}</span>
                            </div>
                        </div>
                        <Link href="/gst/returns">
                            <Button className="w-full mt-4" variant="outline">View Details</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Deadlines Card */}
                <Card className="md:col-span-2 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            Upcoming Deadlines
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* GSTR-1 */}
                        <div className="p-4 rounded-lg border bg-gray-50 flex items-start justify-between">
                            <div>
                                <div className="font-bold text-lg mb-1">GSTR-1</div>
                                <div className="text-sm text-gray-600">Outward Supplies</div>
                                <div className="mt-2 text-primary-600 font-medium">Due: {formatDate(data.deadlines.gstr1)}</div>
                            </div>
                            <div className="text-right">
                                {data.status.gstr1 === 'filed' ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                                        <CheckCircle2 className="w-4 h-4" /> Filed
                                    </span>
                                ) : (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">
                                            <AlertCircle className="w-4 h-4" /> Pending
                                        </span>
                                        <div className="text-xs font-semibold text-gray-500">
                                            {getDaysLeft(data.deadlines.gstr1)} days left
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* GSTR-3B */}
                        <div className="p-4 rounded-lg border bg-gray-50 flex items-start justify-between">
                            <div>
                                <div className="font-bold text-lg mb-1">GSTR-3B</div>
                                <div className="text-sm text-gray-600">Summary Return</div>
                                <div className="mt-2 text-primary-600 font-medium">Due: {formatDate(data.deadlines.gstr3b)}</div>
                            </div>
                            <div className="text-right">
                                {data.status.gstr3b === 'filed' ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                                        <CheckCircle2 className="w-4 h-4" /> Filed
                                    </span>
                                ) : (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">
                                            <AlertCircle className="w-4 h-4" /> Pending
                                        </span>
                                        <div className="text-xs font-semibold text-gray-500">
                                            {getDaysLeft(data.deadlines.gstr3b)} days left
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Compliance Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Placeholder alerts */}
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded border border-yellow-100 text-yellow-800">
                            <AlertCircle className="w-5 h-5 mt-0.5" />
                            <div>
                                <div className="font-semibold">Resolve ITC Mismatches</div>
                                <div className="text-sm mt-1">There are potential mismatches between your Purchase Register and GSTR-2B. Please review before filing GSTR-3B.</div>
                                <Button variant="link" className="p-0 h-auto text-yellow-900 mt-2">Check Reconciliation &rarr;</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

