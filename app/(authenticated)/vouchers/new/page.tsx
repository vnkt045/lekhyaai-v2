"use client";

import * as React from "react";
import { Save, ArrowLeft, Calendar as CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VoucherForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type");

    const [type, setType] = React.useState(typeParam ? typeParam.charAt(0).toUpperCase() + typeParam.slice(1) : "Journal");
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [narration, setNarration] = React.useState("");
    const [ledgers, setLedgers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isScanning, setIsScanning] = React.useState(false);

    // Dynamic Rows State
    const [rows, setRows] = React.useState([
        { id: 1, type: "by", ledgerId: "", amount: "" },
        { id: 2, type: "to", ledgerId: "", amount: "" }
    ]);

    // Fetch Ledgers
    React.useEffect(() => {
        fetch("/api/ledgers")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLedgers(data);
            })
            .catch(err => console.error("Failed to fetch ledgers", err));
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/scan", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.error) {
                alert(data.error);
            } else {
                let foundData = false;

                if (data.date) {
                    // Normalize date if needed, or just warn if format mismatch
                    setDate(data.date.split('/').reverse().join('-'));
                    foundData = true;
                }

                if (data.amount) {
                    setRows([
                        { id: Date.now(), type: "by", ledgerId: "", amount: data.amount },
                        { id: Date.now() + 1, type: "to", ledgerId: "", amount: data.amount }
                    ]);
                    foundData = true;
                }

                if (data.invoiceNo) {
                    setNarration(`Invoice No: ${data.invoiceNo}`);
                    foundData = true;
                }

                if (!foundData) {
                    alert("Scan complete but no clearly identifiable data found. Please enter details manually.");
                }

                if (data.rawText) console.log("Extracted:", data.rawText);
            }
        } catch (error) {
            console.error("Scan failed", error);
            alert("Failed to scan bill");
        } finally {
            setIsScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), type: "to", ledgerId: "", amount: "" }]);
    };

    const removeRow = (id: number) => {
        if (rows.length > 2) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const updateRow = (id: number, field: string, value: string) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const totalDebit = rows
        .filter(r => r.type === "by")
        .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    const totalCredit = rows
        .filter(r => r.type === "to")
        .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const handleSubmit = async () => {
        if (!isBalanced) {
            alert("Debit and Credit totals must match!");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/vouchers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    date,
                    narration,
                    entries: rows.map(r => ({
                        type: r.type,
                        ledgerId: r.ledgerId,
                        amount: parseFloat(r.amount) || 0
                    }))
                }),
            });

            if (res.ok) {
                router.push("/vouchers");
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save voucher");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/vouchers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">New Voucher</h1>
                        <p className="text-sm text-gray-500">Create a new accounting entry</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isScanning}
                    >
                        {isScanning ? <span className="animate-spin">⏳</span> : <Upload className="w-4 h-4" />}
                        {isScanning ? "Scanning..." : "Upload Bill"}
                    </Button>
                    <Button
                        variant="default"
                        className="gap-2 bg-primary-600 hover:bg-primary-700"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />}
                        Save Voucher
                    </Button>
                </div>
            </div>

            {/* Main Form */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Voucher Type</label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Journal">Journal</SelectItem>
                                    <SelectItem value="Payment">Payment</SelectItem>
                                    <SelectItem value="Receipt">Receipt</SelectItem>
                                    <SelectItem value="Contra">Contra</SelectItem>
                                    <SelectItem value="Purchase">Purchase</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Voucher No.</label>
                            <Input placeholder="Auto-generated" disabled className="bg-gray-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="date"
                                    className="pl-10"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ledger Entries */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700 w-24">By/To</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ledger Account</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-40">Debit</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-700 w-40">Credit</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {rows.map((row) => (
                                    <tr key={row.id} className="bg-white group">
                                        <td className="px-4 py-2">
                                            <Select
                                                value={row.type}
                                                onValueChange={(val) => updateRow(row.id, "type", val)}
                                            >
                                                <SelectTrigger className="border-0 shadow-none h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="by">By (Dr)</SelectItem>
                                                    <SelectItem value="to">To (Cr)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                className="w-full border-0 focus:ring-0 text-sm bg-transparent"
                                                value={row.ledgerId}
                                                onChange={(e) => updateRow(row.id, "ledgerId", e.target.value)}
                                            >
                                                <option value="">Select Ledger</option>
                                                {ledgers.map(l => (
                                                    <option key={l.id} value={l.id}>{l.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                placeholder="0.00"
                                                className="text-right border-0 shadow-none focus-visible:ring-0"
                                                value={row.type === 'by' ? row.amount : ''}
                                                onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                                                disabled={row.type !== 'by'}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                placeholder="0.00"
                                                className="text-right border-0 shadow-none focus-visible:ring-0"
                                                value={row.type === 'to' ? row.amount : ''}
                                                onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                                                disabled={row.type !== 'to'}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => removeRow(row.id)}
                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 border-t font-semibold">
                                <tr>
                                    <td colSpan={2} className="px-4 py-3">
                                        <Button variant="link" size="sm" onClick={addRow} className="text-primary-600 p-0 h-auto">
                                            + Add Row
                                        </Button>
                                    </td>
                                    <td className={`px-4 py-3 text-right ${!isBalanced ? 'text-red-600' : ''}`}>
                                        {totalDebit.toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-3 text-right ${!isBalanced ? 'text-red-600' : ''}`}>
                                        {totalCredit.toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Narration</label>
                        <Input
                            placeholder="Enter narration..."
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function NewVoucherPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <VoucherForm />
        </Suspense>
    );
}
