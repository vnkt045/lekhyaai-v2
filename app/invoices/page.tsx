"use client";

import * as React from "react";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function InvoicesPage() {
    // Mock data
    const invoices = [
        {
            id: "1",
            invoiceNumber: "INV-001",
            date: new Date("2024-02-10"),
            customer: "ABC Traders Pvt Ltd",
            gstin: "27AABCU9603R1ZM",
            amount: 125000,
            cgst: 11250,
            sgst: 11250,
            igst: 0,
            total: 147500,
            status: "paid",
        },
        {
            id: "2",
            invoiceNumber: "INV-002",
            date: new Date("2024-02-09"),
            customer: "XYZ Enterprises",
            gstin: "29AABCU9603R1ZN",
            amount: 85000,
            cgst: 0,
            sgst: 0,
            igst: 15300,
            total: 100300,
            status: "pending",
        },
        {
            id: "3",
            invoiceNumber: "INV-003",
            date: new Date("2024-02-08"),
            customer: "DEF Industries Ltd",
            gstin: "27AABCU9603R1ZO",
            amount: 250000,
            cgst: 22500,
            sgst: 22500,
            igst: 0,
            total: 295000,
            status: "paid",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sales Invoices</h1>
                    <p className="text-gray-600 mt-1">Manage your GST invoices</p>
                </div>
                <Link href="/invoices/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="w-5 h-5" />
                        New Invoice
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search by invoice number, customer name, or GSTIN..."
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="grid gap-4">
                {invoices.map((invoice) => (
                    <Card key={invoice.id} className="hover:shadow-pos-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-5 h-5 text-primary-600" />
                                        <h3 className="text-lg font-semibold">{invoice.invoiceNumber}</h3>
                                        <Badge variant={invoice.status === "paid" ? "compliant" : "warning"}>
                                            {invoice.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-medium">{invoice.customer}</p>
                                            <p className="text-xs text-gray-500">{invoice.gstin}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium">{formatDate(invoice.date)}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Amount</p>
                                            <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 mt-4 pt-4 border-t">
                                        {invoice.cgst > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">CGST: </span>
                                                <span className="font-medium">{formatCurrency(invoice.cgst)}</span>
                                            </div>
                                        )}
                                        {invoice.sgst > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">SGST: </span>
                                                <span className="font-medium">{formatCurrency(invoice.sgst)}</span>
                                            </div>
                                        )}
                                        {invoice.igst > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">IGST: </span>
                                                <span className="font-medium">{formatCurrency(invoice.igst)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-primary-600">
                                        {formatCurrency(invoice.total)}
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full">
                                            Print
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
