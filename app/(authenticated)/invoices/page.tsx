"use client";

import * as React from "react";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { T } from "@/components/ui/translate";

export default function InvoicesPage() {
    // Real data will come from API
    const invoices: any[] = [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900"><T>Sales Invoices</T></h1>
                    <p className="text-gray-600 mt-1"><T>Manage your GST invoices</T></p>
                </div>
                <Link href="/invoices/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="w-5 h-5" />
                        <T>New Invoice</T>
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
                            <T>Filters</T>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Empty State or Invoices List */}
            {invoices.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>No invoices yet</T></h3>
                        <p className="text-gray-600 mb-6"><T>Create your first GST invoice to get started</T></p>
                        <Link href="/invoices/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                <T>Create Invoice</T>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {/* Invoice cards will be rendered here when data is available */}
                </div>
            )}
        </div>
    );
}
