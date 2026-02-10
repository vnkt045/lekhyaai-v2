"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function VouchersPage() {
    const vouchers = [
        {
            id: "1",
            voucherNumber: "JV-001",
            type: "Journal",
            date: new Date("2024-02-10"),
            narration: "Being rent paid for February 2024",
            amount: 25000,
        },
        {
            id: "2",
            voucherNumber: "PAY-045",
            type: "Payment",
            date: new Date("2024-02-09"),
            narration: "Payment to XYZ Suppliers",
            amount: 15000,
        },
        {
            id: "3",
            voucherNumber: "REC-078",
            type: "Receipt",
            date: new Date("2024-02-08"),
            narration: "Receipt from ABC Traders",
            amount: 50000,
        },
    ];

    const voucherTypes = [
        { name: "Journal", color: "primary" },
        { name: "Payment", color: "danger" },
        { name: "Receipt", color: "success" },
        { name: "Contra", color: "navy" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
                    <p className="text-gray-600 mt-1">Manage your accounting vouchers</p>
                </div>
                <Link href="/vouchers/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="w-5 h-5" />
                        New Voucher
                    </Button>
                </Link>
            </div>

            {/* Voucher Type Quick Access */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {voucherTypes.map((type) => (
                    <Link key={type.name} href={`/vouchers/new?type=${type.name.toLowerCase()}`}>
                        <Card className="hover:shadow-pos-lg transition-all cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <h3 className="font-semibold text-lg">{type.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">Create {type.name}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Vouchers List */}
            <div className="space-y-4">
                {vouchers.map((voucher) => (
                    <Card key={voucher.id} className="hover:shadow-pos-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold">{voucher.voucherNumber}</h3>
                                        <Badge variant="default">{voucher.type}</Badge>
                                    </div>
                                    <p className="text-gray-700 mb-2">{voucher.narration}</p>
                                    <p className="text-sm text-gray-500">{formatDate(voucher.date)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">
                                        {formatCurrency(voucher.amount)}
                                    </p>
                                    <div className="mt-3 space-x-2">
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
