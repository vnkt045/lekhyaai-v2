"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Printer, Mail, Download } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";

export default function PayslipPage() {
    const params = useParams();
    const [payroll, setPayroll] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchPayroll();
    }, [params.id]);

    const fetchPayroll = async () => {
        try {
            const res = await fetch(`/api/payroll/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setPayroll(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><T>Loading payslip...</T></div>;
    if (!payroll) return <div className="p-8 text-center text-red-500"><T>Payslip not found</T></div>;

    const { employee, tenant, items } = payroll;
    const earnings = items.filter((i: any) => i.type === "Earning");
    const deductions = items.filter((i: any) => i.type === "Deduction");

    const handleDownload = () => {
        // Trigger browser print, user can "Save as PDF"
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between no-print">
                <Button variant="ghost" asChild>
                    <Link href="/payroll">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <T>Back to Payroll</T>
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" />
                        <T>Print</T>
                    </Button>
                    <Button variant="default" onClick={handleDownload} className="bg-[#001f3f] text-white">
                        <Download className="h-4 w-4 mr-2" />
                        <T>Download PDF</T>
                    </Button>
                </div>
            </div>

            <Card className="border shadow-lg print:shadow-none print:border-none">
                <CardContent className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center border-b pb-6">
                        <h1 className="text-2xl font-bold uppercase text-[#001f3f]">{tenant.companyName}</h1>
                        <p>{tenant.address}</p>
                        <p>{tenant.email} | {tenant.phone}</p>
                        <div className="mt-4 bg-[#FF851B] text-white py-1 px-4 inline-block font-bold rounded-sm uppercase tracking-wide">
                            <T>Payslip for</T> {payroll.period}
                        </div>
                    </div>

                    {/* Employee Details */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm border-b pb-6">
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Employee Name</T>:</span>
                            <span className="font-bold">{employee.name}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Employee ID</T>:</span>
                            <span>{employee.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Designation</T>:</span>
                            <span>{employee.designation}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Department</T>:</span>
                            <span>{employee.department || "-"}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Date of Joining</T>:</span>
                            <span>{new Date(employee.dateOfJoining).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span className="font-semibold text-gray-600"><T>Bank Account</T>:</span>
                            <span>{employee.bankDetails?.accountNo || "-"}</span>
                        </div>
                    </div>

                    {/* Salary Table */}
                    <div className="grid grid-cols-2 border border-gray-300">
                        {/* Earnings Column */}
                        <div className="border-r border-gray-300">
                            <div className="bg-gray-100 p-2 font-bold text-center border-b border-gray-300"><T>Earnings</T></div>
                            <div className="p-4 space-y-2">
                                {earnings.map((item: any) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.name}</span>
                                        <span>{parseFloat(item.amount).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-300 p-2 flex justify-between font-bold bg-gray-50">
                                <span><T>Total Earnings</T></span>
                                <span>{parseFloat(payroll.totalEarnings).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Deductions Column */}
                        <div>
                            <div className="bg-gray-100 p-2 font-bold text-center border-b border-gray-300"><T>Deductions</T></div>
                            <div className="p-4 space-y-2">
                                {deductions.map((item: any) => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.name}</span>
                                        <span>{parseFloat(item.amount).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-300 p-2 flex justify-between font-bold bg-gray-50">
                                <span><T>Total Deductions</T></span>
                                <span>{parseFloat(payroll.totalDeductions).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="flex justify-between items-center bg-[#001f3f] text-white p-4 rounded-md">
                        <span className="text-lg font-semibold"><T>Net Payable Amount</T></span>
                        <span className="text-2xl font-bold">₹{parseFloat(payroll.netSalary).toFixed(2)}</span>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-400 pt-8">
                        <p>This is a computer-generated document and does not require a signature.</p>
                        <p>{tenant.companyName} | Generated on {new Date(payroll.createdAt).toLocaleDateString()}</p>
                    </div>

                </CardContent>
            </Card>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    nav, aside, header { display: none !important; }
                }
            `}</style>
        </div>
    );
}
