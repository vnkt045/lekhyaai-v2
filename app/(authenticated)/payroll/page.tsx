"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Printer, FileInit, Loader2 } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast"; // Placeholder

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default current month
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchPayrolls();
    }, [month, year]);

    const fetchPayrolls = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payroll?month=${month}&year=${year}`);
            if (res.ok) {
                const data = await res.json();
                setPayrolls(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalPayout = payrolls.reduce((sum, p) => sum + parseFloat(p.netSalary), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#001f3f]"><T>Payroll</T></h1>
                    <p className="text-muted-foreground"><T>Manage monthly salary processing</T></p>
                </div>
                <div className="flex gap-2">
                    <Link href="/payroll/generate">
                        <Button className="bg-[#FF851B] hover:bg-[#e07516] text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            <T>Generate Payroll</T>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-t-4 border-t-[#001f3f]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg"><T>Filter Period</T></CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="space-y-2 w-40">
                            <label className="text-sm font-medium"><T>Month</T></label>
                            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 w-32">
                            <label className="text-sm font-medium"><T>Year</T></label>
                            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2026">2026</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground"><T>Total Net Payout</T></div>
                        <div className="text-2xl font-bold text-[#001f3f]">₹{totalPayout.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground"><T>Employees Processed</T></div>
                        <div className="text-2xl font-bold text-[#001f3f]">{payrolls.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-muted-foreground"><T>Status</T></div>
                        <div className="text-2xl font-bold text-green-600">
                            {payrolls.length > 0 ? payrolls[0].status : "-"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700"><T>Employee</T></th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 hidden md:table-cell"><T>Designation</T></th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700"><T>Earnings</T></th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700"><T>Deductions</T></th>
                                    <th className="px-6 py-4 text-right font-semibold text-gray-700"><T>Net Salary</T></th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-700"><T>Actions</T></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                            <T>Loading payroll data...</T>
                                        </td>
                                    </tr>
                                ) : payrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <FileInit className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                            <p><T>No payroll records found for this period</T></p>
                                        </td>
                                    </tr>
                                ) : (
                                    payrolls.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-[#001f3f]">{p.employee?.name}</td>
                                            <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{p.employee?.designation}</td>
                                            <td className="px-6 py-4 text-right text-green-600">₹{parseFloat(p.totalEarnings).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-red-500">₹{parseFloat(p.totalDeductions).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-bold">₹{parseFloat(p.netSalary).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Button variant="ghost" size="icon" title="View Payslip">
                                                    <Printer className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
