"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { T } from "@/components/ui/translate";

export default function InvoicesPage() {
    const searchParams = useSearchParams();
    const [invoices, setInvoices] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        fetchInvoices();
    }, [searchParams]); // Re-fetch when URL params (date filter) change

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            // Construct query string from current URL params
            const params = new URLSearchParams(searchParams.toString());
            const res = await fetch(`/api/invoices?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.customer?.gstin?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#001f3f]"><T>Sales Invoices</T></h1>
                    <p className="text-gray-600 mt-1"><T>Manage your GST invoices</T></p>
                </div>
                <Link href="/invoices/new">
                    <Button size="lg" className="gap-2 bg-[#FF851B] hover:bg-[#e07516] text-white">
                        <Plus className="w-5 h-5" />
                        <T>New Invoice</T>
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <Card className="border-t-4 border-t-[#001f3f]">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search by invoice number, customer..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Date Range Filter */}
                            <DateRangeFilter />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices List */}
            {loading ? (
                <div className="text-center py-12"><span className="animate-spin text-2xl">⏳</span> <T>Loading invoices...</T></div>
            ) : filteredInvoices.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>No invoices found</T></h3>
                        <p className="text-gray-600 mb-6"><T>Create a new invoice or adjust filters</T></p>
                        <Link href="/invoices/new">
                            <Button size="lg" className="gap-2 bg-[#001f3f] text-white">
                                <Plus className="w-5 h-5" />
                                <T>Create Invoice</T>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredInvoices.map((inv) => (
                        <Card key={inv.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-lg text-[#001f3f]">{inv.invoiceNumber}</h4>
                                    <p className="text-sm text-gray-500">{new Date(inv.invoiceDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{parseFloat(inv.totalAmount).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">{inv.customer?.name}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
