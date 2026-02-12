"use client";

import * as React from "react";
import { Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { T } from "@/components/ui/translate";
import { DateRangeFilter } from "@/components/ui/date-range-filter";

export default function VouchersPage() {
    const vouchers: any[] = [];

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
                    <h1 className="text-3xl font-bold text-gray-900"><T>Vouchers</T></h1>
                    <p className="text-gray-600 mt-1"><T>Manage your accounting vouchers</T></p>
                </div>
                <Link href="/vouchers/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="w-5 h-5" />
                        <T>New Voucher</T>
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex justify-end">
                <div className="flex items-center gap-2">
                    <DateRangeFilter />
                </div>
            </div>

            {/* Voucher Type Quick Access */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {voucherTypes.map((type) => (
                    <Link key={type.name} href={`/vouchers/new?type=${type.name.toLowerCase()}`}>
                        <Card className="hover:shadow-pos-lg transition-all cursor-pointer h-full">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                                <span className={`w-3 h-3 rounded-full mb-3 bg-${type.color}-500`} />
                                <h3 className="font-semibold text-lg"><T>{type.name}</T></h3>
                                <p className="text-sm text-gray-600 mt-1"><T>Create</T> <T>{type.name}</T></p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {vouchers.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>No vouchers yet</T></h3>
                        <p className="text-gray-600 mb-6"><T>Create your first voucher to start recording transactions</T></p>
                        <Link href="/vouchers/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                <T>Create Voucher</T>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {/* Voucher list will be rendered here */}
                </div>
            )}
        </div>
    );
}
