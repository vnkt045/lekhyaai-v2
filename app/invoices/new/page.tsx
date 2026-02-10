"use client";

import * as React from "react";
import { ArrowLeft, Plus, Trash2, Save, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculateGST, getSupplyType } from "@/lib/utils";
import Link from "next/link";

interface InvoiceItem {
    id: string;
    description: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    amount: number;
    gstRate: number;
}

export default function NewInvoicePage() {
    const [customerName, setCustomerName] = React.useState("");
    const [customerGSTIN, setCustomerGSTIN] = React.useState("");
    const [customerState, setCustomerState] = React.useState("27"); // Maharashtra
    const [invoiceDate, setInvoiceDate] = React.useState(
        new Date().toISOString().split("T")[0]
    );
    const [items, setItems] = React.useState<InvoiceItem[]>([
        {
            id: "1",
            description: "",
            hsnCode: "",
            quantity: 1,
            rate: 0,
            amount: 0,
            gstRate: 18,
        },
    ]);

    const sellerState = "27"; // Maharashtra - from tenant settings

    const addItem = () => {
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                description: "",
                hsnCode: "",
                quantity: 1,
                rate: 0,
                amount: 0,
                gstRate: 18,
            },
        ]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(
            items.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    // Recalculate amount
                    if (field === "quantity" || field === "rate") {
                        updated.amount = updated.quantity * updated.rate;
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const supplyType = getSupplyType(sellerState, customerState);

    // Calculate GST for each item and sum up
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach((item) => {
        const gst = calculateGST(item.amount, item.gstRate, supplyType);
        totalCGST += gst.cgst;
        totalSGST += gst.sgst;
        totalIGST += gst.igst;
    });

    const grandTotal = subtotal + totalCGST + totalSGST + totalIGST;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/invoices">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Sales Invoice</h1>
                    <p className="text-gray-600 mt-1">Create a new GST invoice</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Customer Name *
                                    </label>
                                    <Input
                                        placeholder="Enter customer name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        GSTIN *
                                    </label>
                                    <Input
                                        placeholder="27AABCU9603R1ZM"
                                        value={customerGSTIN}
                                        onChange={(e) => {
                                            const gstin = e.target.value.toUpperCase();
                                            setCustomerGSTIN(gstin);
                                            if (gstin.length >= 2) {
                                                setCustomerState(gstin.substring(0, 2));
                                            }
                                        }}
                                        maxLength={15}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Invoice Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Supply Type
                                    </label>
                                    <Input
                                        value={supplyType}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Invoice Items</CardTitle>
                            <Button onClick={addItem} size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-gray-50 rounded-lg space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm">
                                                Item {index + 1}
                                            </span>
                                            {items.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <Input
                                                    placeholder="Item description"
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "description", e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    placeholder="HSN Code"
                                                    value={item.hsnCode}
                                                    onChange={(e) =>
                                                        updateItem(item.id, "hsnCode", e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="number"
                                                    placeholder="GST Rate %"
                                                    value={item.gstRate}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "gstRate",
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "quantity",
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="number"
                                                    placeholder="Rate per unit"
                                                    value={item.rate}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "rate",
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <span className="text-sm text-gray-600">Item Total:</span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(item.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice Summary - Receipt Style */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-primary-500 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="w-5 h-5" />
                                Invoice Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-3 receipt-text">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>

                                {totalCGST > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span>CGST:</span>
                                        <span>{formatCurrency(totalCGST)}</span>
                                    </div>
                                )}

                                {totalSGST > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span>SGST:</span>
                                        <span>{formatCurrency(totalSGST)}</span>
                                    </div>
                                )}

                                {totalIGST > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span>IGST:</span>
                                        <span>{formatCurrency(totalIGST)}</span>
                                    </div>
                                )}

                                <div className="border-t-2 border-dashed pt-3 flex justify-between text-lg font-bold">
                                    <span>Grand Total:</span>
                                    <span className="text-primary-600">
                                        {formatCurrency(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button className="w-full gap-2" size="lg">
                                    <Save className="w-5 h-5" />
                                    Save Invoice
                                </Button>
                                <Button variant="outline" className="w-full" size="lg">
                                    Save & Print
                                </Button>
                                <Link href="/invoices">
                                    <Button variant="ghost" className="w-full" size="lg">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>

                            {/* Supply Type Indicator */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs font-semibold text-blue-900">
                                    Supply Type: {supplyType}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    {supplyType === "Intrastate"
                                        ? "CGST + SGST will be applied"
                                        : "IGST will be applied"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
