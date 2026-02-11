"use client";

import * as React from "react";
import { ArrowLeft, Plus, Trash2, Save, Printer, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HSNSelect } from "@/components/ui/hsn-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculateGST, getSupplyType } from "@/lib/utils";
import { T } from "@/components/ui/translate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface InvoiceItem {
    id: string;
    description: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    amount: number;
    gstRate: number;
    unit: string;
}

interface PartyDetails {
    legalName: string;
    tradeName: string;
    address: string;
    state: string;
    stateCode: string;
    pan: string;
    existsInDB: boolean;
    ledgerId?: string;
}

export default function NewInvoicePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const [customerName, setCustomerName] = React.useState("");
    const [customerGSTIN, setCustomerGSTIN] = React.useState("");
    const [customerAddress, setCustomerAddress] = React.useState("");
    const [customerState, setCustomerState] = React.useState("");
    const [customerStateCode, setCustomerStateCode] = React.useState("27");
    const [customerPAN, setCustomerPAN] = React.useState("");
    const [gstinLookupStatus, setGstinLookupStatus] = React.useState<"idle" | "loading" | "found" | "not_found">("idle");

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
            unit: "NOS",
        },
    ]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(false);
    const [savedInvoice, setSavedInvoice] = React.useState<any>(null);

    // Get seller details from session
    const sellerName = session?.user?.tenant?.companyName || "Your Company";
    const sellerGSTIN = session?.user?.tenant?.gstin || "";
    const sellerAddress = session?.user?.tenant?.address || "";
    const sellerState = session?.user?.tenant?.state || "Maharashtra";
    const sellerStateCode = sellerGSTIN.substring(0, 2) || "27";

    // ========== GSTIN LOOKUP ==========
    const lookupGSTIN = async (gstin: string) => {
        if (gstin.length !== 15) return;

        setGstinLookupStatus("loading");
        try {
            const res = await fetch(`/api/gstin-lookup?gstin=${gstin}`);
            if (res.ok) {
                const data: PartyDetails = await res.json();
                setCustomerName(data.legalName || data.tradeName || "");
                setCustomerAddress(data.address || "");
                setCustomerState(data.state || "");
                setCustomerStateCode(data.stateCode || "");
                setCustomerPAN(data.pan || "");
                setGstinLookupStatus(data.existsInDB ? "found" : "not_found");
            } else {
                setGstinLookupStatus("not_found");
            }
        } catch {
            setGstinLookupStatus("not_found");
        }
    };

    // ========== ITEM MANAGEMENT ==========
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
                unit: "NOS",
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
                    if (field === "quantity" || field === "rate") {
                        updated.amount = updated.quantity * updated.rate;
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    // ========== CALCULATIONS ==========
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const supplyType = getSupplyType(sellerStateCode, customerStateCode);

    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach((item) => {
        const gst = calculateGST(item.amount, item.gstRate, supplyType);
        totalCGST += gst.cgst;
        totalSGST += gst.sgst;
        totalIGST += gst.igst;
    });

    const totalTax = totalCGST + totalSGST + totalIGST;
    const grandTotal = Math.round(subtotal + totalTax);
    const roundOff = grandTotal - (subtotal + totalTax);

    // ========== NUMBER TO WORDS ==========
    const numberToWords = (num: number): string => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        if (num === 0) return "Zero";

        const convert = (n: number): string => {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
            if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convert(n % 100) : "");
            if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
            if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
            return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
        };

        return "Rupees " + convert(Math.floor(num)) + " Only";
    };

    // ========== SUBMIT ==========
    const handleSubmit = async (shouldPrint: boolean = false) => {
        if (!customerName || !customerGSTIN) {
            alert("Please enter customer name and GSTIN");
            return;
        }
        if (items.length === 0 || items.every(i => !i.description)) {
            alert("Please add at least one item with a description");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    customerGSTIN,
                    customerAddress,
                    customerState,
                    invoiceDate,
                    supplyType,
                    items: items.map(i => ({
                        description: i.description,
                        hsnCode: i.hsnCode,
                        quantity: i.quantity,
                        rate: i.rate,
                        amount: i.amount,
                        gstRate: i.gstRate,
                        unit: i.unit,
                    }))
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setSavedInvoice(data);
                if (shouldPrint) {
                    setShowPreview(true);
                } else {
                    alert(`Invoice ${data.invoiceNumber} saved successfully!`);
                    router.push("/invoices");
                }
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save invoice");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving");
        } finally {
            setIsLoading(false);
        }
    };

    // ========== PRINT FUNCTION ==========
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const invoiceNumber = savedInvoice?.invoiceNumber || "PREVIEW";

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Tax Invoice - ${invoiceNumber}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; padding: 20px; color: #1a1a1a; }
        .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #1a1a1a; }
        .header { display: flex; justify-content: space-between; padding: 20px; border-bottom: 2px solid #1a1a1a; background: #f8fafc; }
        .header-left { flex: 1; }
        .company-name { font-size: 22px; font-weight: 700; color: #1e40af; margin-bottom: 4px; }
        .company-details { font-size: 11px; color: #4b5563; line-height: 1.6; }
        .invoice-title { text-align: center; padding: 10px; font-size: 18px; font-weight: 700; background: #1e40af; color: white; letter-spacing: 2px; }
        .meta-row { display: flex; border-bottom: 1px solid #d1d5db; }
        .meta-cell { flex: 1; padding: 8px 15px; border-right: 1px solid #d1d5db; font-size: 12px; }
        .meta-cell:last-child { border-right: none; }
        .meta-label { font-weight: 600; color: #4b5563; font-size: 10px; text-transform: uppercase; }
        .meta-value { font-weight: 500; margin-top: 2px; }
        .parties { display: flex; border-bottom: 2px solid #1a1a1a; }
        .party-box { flex: 1; padding: 15px; }
        .party-box:first-child { border-right: 2px solid #1a1a1a; }
        .party-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #1e40af; margin-bottom: 8px; letter-spacing: 1px; }
        .party-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .party-detail { font-size: 11px; color: #4b5563; line-height: 1.5; }
        .party-gstin { font-size: 12px; font-weight: 600; color: #1a1a1a; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e40af; color: white; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
        th:first-child { text-align: left; }
        td { padding: 8px 10px; font-size: 11px; border-bottom: 1px solid #e5e7eb; text-align: center; }
        td:first-child { text-align: left; }
        td:nth-child(2) { text-align: left; }
        .amount-col { text-align: right !important; font-weight: 500; }
        .totals-section { display: flex; border-top: 2px solid #1a1a1a; }
        .amount-words { flex: 1.5; padding: 12px 15px; border-right: 2px solid #1a1a1a; }
        .amount-words-title { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #4b5563; }
        .amount-words-value { font-size: 12px; font-weight: 500; margin-top: 4px; font-style: italic; }
        .totals { flex: 1; padding: 8px 15px; }
        .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
        .total-row.grand { font-size: 16px; font-weight: 700; color: #1e40af; border-top: 2px solid #1a1a1a; padding-top: 8px; margin-top: 4px; }
        .bank-section { display: flex; border-top: 2px solid #1a1a1a; }
        .bank-details { flex: 1.5; padding: 12px 15px; border-right: 2px solid #1a1a1a; }
        .bank-title { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #4b5563; margin-bottom: 6px; }
        .bank-info { font-size: 11px; line-height: 1.6; }
        .signature-box { flex: 1; padding: 12px 15px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
        .sig-label { font-size: 10px; font-weight: 600; text-transform: uppercase; color: #4b5563; }
        .sig-name { font-size: 12px; font-weight: 600; margin-top: 40px; }
        .footer { text-align: center; padding: 8px; font-size: 10px; color: #6b7280; border-top: 1px solid #d1d5db; background: #f8fafc; }
        .hsn-summary { border-top: 2px solid #1a1a1a; }
        .hsn-summary th { background: #374151; }
        @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
            .invoice-container { border: 2px solid #000; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align:center; margin-bottom:15px;">
        <button onclick="window.print()" style="padding:12px 30px; background:#1e40af; color:white; border:none; border-radius:8px; font-size:15px; cursor:pointer; font-weight:600;">
            🖨️ Print Invoice
        </button>
        <button onclick="window.close()" style="padding:12px 30px; background:#6b7280; color:white; border:none; border-radius:8px; font-size:15px; cursor:pointer; margin-left:10px; font-weight:600;">
            ✕ Close
        </button>
    </div>

    <div class="invoice-container">
        <div class="invoice-title">TAX INVOICE</div>

        <div class="header">
            <div class="header-left">
                <div class="company-name">${sellerName}</div>
                <div class="company-details">
                    ${sellerAddress}<br>
                    GSTIN: ${sellerGSTIN}<br>
                    State: ${sellerState} (${sellerStateCode})
                </div>
            </div>
        </div>

        <div class="meta-row">
            <div class="meta-cell">
                <div class="meta-label">Invoice No.</div>
                <div class="meta-value">${invoiceNumber}</div>
            </div>
            <div class="meta-cell">
                <div class="meta-label">Invoice Date</div>
                <div class="meta-value">${new Date(invoiceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
            <div class="meta-cell">
                <div class="meta-label">Place of Supply</div>
                <div class="meta-value">${customerState} (${customerStateCode})</div>
            </div>
            <div class="meta-cell">
                <div class="meta-label">Supply Type</div>
                <div class="meta-value">${supplyType}</div>
            </div>
        </div>

        <div class="parties">
            <div class="party-box">
                <div class="party-title">Billed To</div>
                <div class="party-name">${customerName}</div>
                <div class="party-detail">${customerAddress}</div>
                <div class="party-gstin">GSTIN: ${customerGSTIN}</div>
                <div class="party-detail">State: ${customerState} (${customerStateCode})</div>
                ${customerPAN ? `<div class="party-detail">PAN: ${customerPAN}</div>` : ""}
            </div>
            <div class="party-box">
                <div class="party-title">Shipped To</div>
                <div class="party-name">${customerName}</div>
                <div class="party-detail">${customerAddress}</div>
                <div class="party-gstin">GSTIN: ${customerGSTIN}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width:30px">#</th>
                    <th style="text-align:left">Description</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Rate (₹)</th>
                    <th>Amount (₹)</th>
                    ${supplyType === "Intrastate" ? `<th>CGST</th><th>SGST</th>` : `<th>IGST</th>`}
                    <th>Total (₹)</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item, i) => {
            const gst = calculateGST(item.amount, item.gstRate, supplyType);
            const itemTotal = item.amount + gst.cgst + gst.sgst + gst.igst;
            return `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${item.description}</td>
                        <td>${item.hsnCode || "-"}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unit}</td>
                        <td class="amount-col">${formatCurrency(item.rate)}</td>
                        <td class="amount-col">${formatCurrency(item.amount)}</td>
                        ${supplyType === "Intrastate"
                    ? `<td>${formatCurrency(gst.cgst)}<br><small>${item.gstRate / 2}%</small></td>
                               <td>${formatCurrency(gst.sgst)}<br><small>${item.gstRate / 2}%</small></td>`
                    : `<td>${formatCurrency(gst.igst)}<br><small>${item.gstRate}%</small></td>`
                }
                        <td class="amount-col" style="font-weight:600">${formatCurrency(itemTotal)}</td>
                    </tr>`;
        }).join("")}
            </tbody>
        </table>

        <div class="totals-section">
            <div class="amount-words">
                <div class="amount-words-title">Amount in Words</div>
                <div class="amount-words-value">${numberToWords(grandTotal)}</div>
            </div>
            <div class="totals">
                <div class="total-row"><span>Subtotal:</span><span>${formatCurrency(subtotal)}</span></div>
                ${totalCGST > 0 ? `<div class="total-row"><span>CGST:</span><span>${formatCurrency(totalCGST)}</span></div>` : ""}
                ${totalSGST > 0 ? `<div class="total-row"><span>SGST:</span><span>${formatCurrency(totalSGST)}</span></div>` : ""}
                ${totalIGST > 0 ? `<div class="total-row"><span>IGST:</span><span>${formatCurrency(totalIGST)}</span></div>` : ""}
                ${roundOff !== 0 ? `<div class="total-row"><span>Round Off:</span><span>${roundOff > 0 ? "+" : ""}${roundOff.toFixed(2)}</span></div>` : ""}
                <div class="total-row grand"><span>Grand Total:</span><span>₹${grandTotal.toLocaleString("en-IN")}</span></div>
            </div>
        </div>

        <div class="bank-section">
            <div class="bank-details">
                <div class="bank-title">Terms & Conditions</div>
                <div class="bank-info">
                    1. Goods once sold will not be taken back.<br>
                    2. Interest @ 18% p.a. will be charged on delayed payments.<br>
                    3. Subject to local jurisdiction.
                </div>
            </div>
            <div class="signature-box">
                <div class="sig-label">For ${sellerName}</div>
                <div class="sig-name">Authorized Signatory</div>
            </div>
        </div>

        <div class="footer">
            This is a computer-generated invoice. | Powered by LekhyaAI
        </div>
    </div>
</body>
</html>
        `);
        printWindow.document.close();
    };

    // ========== INVOICE PREVIEW MODAL ==========
    if (showPreview) {
        return (
            <div className="space-y-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        <T>Invoice Saved Successfully!</T>
                    </h1>
                    <div className="flex gap-3">
                        <Button onClick={handlePrint} size="lg" className="gap-2">
                            <Printer className="w-5 h-5" />
                            <T>Print Invoice</T>
                        </Button>
                        <Link href="/invoices">
                            <Button variant="outline" size="lg">
                                <T>Back to Invoices</T>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* On-screen Preview */}
                <Card className="border-2 border-blue-200">
                    <CardContent className="p-0">
                        <div className="bg-blue-700 text-white text-center py-3 text-lg font-bold tracking-widest">
                            TAX INVOICE
                        </div>

                        {/* Seller Details */}
                        <div className="p-5 bg-slate-50 border-b-2">
                            <h2 className="text-xl font-bold text-blue-700">{sellerName}</h2>
                            <p className="text-sm text-gray-600 mt-1">{sellerAddress}</p>
                            <p className="text-sm font-semibold mt-1">GSTIN: {sellerGSTIN} | State: {sellerState} ({sellerStateCode})</p>
                        </div>

                        {/* Invoice Meta */}
                        <div className="grid grid-cols-4 border-b text-sm">
                            <div className="p-3 border-r">
                                <div className="text-xs font-semibold text-gray-500 uppercase">Invoice No.</div>
                                <div className="font-semibold">{savedInvoice?.invoiceNumber || "—"}</div>
                            </div>
                            <div className="p-3 border-r">
                                <div className="text-xs font-semibold text-gray-500 uppercase">Date</div>
                                <div className="font-semibold">{new Date(invoiceDate).toLocaleDateString("en-IN")}</div>
                            </div>
                            <div className="p-3 border-r">
                                <div className="text-xs font-semibold text-gray-500 uppercase">Place of Supply</div>
                                <div className="font-semibold">{customerState}</div>
                            </div>
                            <div className="p-3">
                                <div className="text-xs font-semibold text-gray-500 uppercase">Supply Type</div>
                                <div className="font-semibold">{supplyType}</div>
                            </div>
                        </div>

                        {/* Buyer Details */}
                        <div className="grid grid-cols-2 border-b-2">
                            <div className="p-4 border-r-2">
                                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Billed To</div>
                                <div className="font-semibold text-base">{customerName}</div>
                                <div className="text-sm text-gray-600 mt-1">{customerAddress}</div>
                                <div className="text-sm font-semibold mt-1">GSTIN: {customerGSTIN}</div>
                                <div className="text-sm text-gray-600">State: {customerState}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Shipped To</div>
                                <div className="font-semibold text-base">{customerName}</div>
                                <div className="text-sm text-gray-600 mt-1">{customerAddress}</div>
                                <div className="text-sm font-semibold mt-1">GSTIN: {customerGSTIN}</div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-700 text-white text-xs uppercase">
                                        <th className="p-2 text-left">#</th>
                                        <th className="p-2 text-left">Description</th>
                                        <th className="p-2 text-center">HSN</th>
                                        <th className="p-2 text-center">Qty</th>
                                        <th className="p-2 text-right">Rate</th>
                                        <th className="p-2 text-right">Amount</th>
                                        {supplyType === "Intrastate" ? (
                                            <><th className="p-2 text-right">CGST</th><th className="p-2 text-right">SGST</th></>
                                        ) : (
                                            <th className="p-2 text-right">IGST</th>
                                        )}
                                        <th className="p-2 text-right font-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => {
                                        const gst = calculateGST(item.amount, item.gstRate, supplyType);
                                        const itemTotal = item.amount + gst.cgst + gst.sgst + gst.igst;
                                        return (
                                            <tr key={item.id} className="border-b">
                                                <td className="p-2">{i + 1}</td>
                                                <td className="p-2 font-medium">{item.description}</td>
                                                <td className="p-2 text-center">{item.hsnCode || "—"}</td>
                                                <td className="p-2 text-center">{item.quantity} {item.unit}</td>
                                                <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                                                <td className="p-2 text-right">{formatCurrency(item.amount)}</td>
                                                {supplyType === "Intrastate" ? (
                                                    <>
                                                        <td className="p-2 text-right text-xs">{formatCurrency(gst.cgst)}<br />({item.gstRate / 2}%)</td>
                                                        <td className="p-2 text-right text-xs">{formatCurrency(gst.sgst)}<br />({item.gstRate / 2}%)</td>
                                                    </>
                                                ) : (
                                                    <td className="p-2 text-right text-xs">{formatCurrency(gst.igst)}<br />({item.gstRate}%)</td>
                                                )}
                                                <td className="p-2 text-right font-semibold">{formatCurrency(itemTotal)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex border-t-2">
                            <div className="flex-1 p-4 border-r-2">
                                <div className="text-xs font-semibold text-gray-500 uppercase">Amount in Words</div>
                                <div className="text-sm font-medium mt-1 italic">{numberToWords(grandTotal)}</div>
                            </div>
                            <div className="w-72 p-4">
                                <div className="flex justify-between text-sm py-1"><span>Subtotal:</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
                                {totalCGST > 0 && <div className="flex justify-between text-sm py-1"><span>CGST:</span><span>{formatCurrency(totalCGST)}</span></div>}
                                {totalSGST > 0 && <div className="flex justify-between text-sm py-1"><span>SGST:</span><span>{formatCurrency(totalSGST)}</span></div>}
                                {totalIGST > 0 && <div className="flex justify-between text-sm py-1"><span>IGST:</span><span>{formatCurrency(totalIGST)}</span></div>}
                                <div className="flex justify-between text-lg font-bold text-blue-700 pt-2 border-t-2 mt-1">
                                    <span>Grand Total:</span>
                                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center py-3 text-xs text-gray-500 bg-slate-50 border-t">
                            Computer-generated invoice | Powered by LekhyaAI
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ========== INVOICE FORM ==========
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
                    <h1 className="text-3xl font-bold text-gray-900"><T>New Sales Invoice</T></h1>
                    <p className="text-gray-600 mt-1"><T>Create a new GST invoice</T></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Details with GSTIN Lookup */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <T>Customer Details</T>
                                {gstinLookupStatus === "found" && (
                                    <span className="flex items-center gap-1 text-sm text-green-600 font-normal">
                                        <CheckCircle2 className="w-4 h-4" /> <T>Auto-filled from database</T>
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* GSTIN Input - PRIMARY with auto-lookup */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    GSTIN <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-2"><T>Enter 15-digit GSTIN to auto-fetch details</T></span>
                                </label>
                                <div className="relative">
                                    <Input
                                        placeholder="27AABCU9603R1ZM"
                                        value={customerGSTIN}
                                        onChange={(e) => {
                                            const gstin = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                                            setCustomerGSTIN(gstin);
                                            if (gstin.length >= 2) {
                                                setCustomerStateCode(gstin.substring(0, 2));
                                            }
                                            if (gstin.length === 15) {
                                                lookupGSTIN(gstin);
                                            } else {
                                                setGstinLookupStatus("idle");
                                            }
                                        }}
                                        maxLength={15}
                                        className="pr-10 text-lg font-mono tracking-wider"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {gstinLookupStatus === "loading" && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                                        {gstinLookupStatus === "found" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                        {gstinLookupStatus === "not_found" && <Search className="w-5 h-5 text-orange-500" />}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <T>Customer Name</T> <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder="Enter customer name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">PAN</label>
                                    <Input
                                        placeholder="PAN Number"
                                        value={customerPAN}
                                        onChange={(e) => setCustomerPAN(e.target.value.toUpperCase())}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2"><T>Address</T></label>
                                    <Input
                                        placeholder="Customer address"
                                        value={customerAddress}
                                        onChange={(e) => setCustomerAddress(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2"><T>State</T></label>
                                    <Input
                                        placeholder="State"
                                        value={customerState}
                                        onChange={(e) => setCustomerState(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2"><T>Invoice Date</T> <span className="text-red-500">*</span></label>
                                    <Input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Supply Type Indicator */}
                            <div className={`p-3 rounded-lg text-sm ${supplyType === "Intrastate" ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"}`}>
                                <span className="font-semibold"><T>Supply Type</T>:</span> {supplyType}
                                {" — "}
                                {supplyType === "Intrastate"
                                    ? "CGST + SGST will apply"
                                    : "IGST will apply"}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle><T>Invoice Items</T></CardTitle>
                            <Button onClick={addItem} size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                <T>Add Item</T>
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
                                                <T>Item</T> {index + 1}
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
                                                <HSNSelect
                                                    value={item.hsnCode}
                                                    onChange={(code) => updateItem(item.id, "hsnCode", code)}
                                                    onSelect={(found) => {
                                                        updateItem(item.id, "gstRate", found.gstRate);
                                                        if (!item.description) {
                                                            updateItem(item.id, "description", found.description);
                                                        }
                                                    }}
                                                    placeholder="Search HSN/SAC"
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
                                            <span className="text-sm text-gray-600"><T>Item Total</T>:</span>
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

                {/* Invoice Summary Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-primary-500 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-2">
                                <T>Invoice Summary</T>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span><T>Subtotal</T>:</span>
                                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
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
                                {roundOff !== 0 && (
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span><T>Round Off</T>:</span>
                                        <span>{roundOff > 0 ? "+" : ""}{roundOff.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t-2 border-dashed pt-3 flex justify-between text-lg font-bold">
                                    <span><T>Grand Total</T>:</span>
                                    <span className="text-primary-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <Button
                                    className="w-full gap-2"
                                    size="lg"
                                    onClick={() => handleSubmit(false)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <T>Save Invoice</T>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    size="lg"
                                    onClick={() => handleSubmit(true)}
                                    disabled={isLoading}
                                >
                                    <Printer className="w-5 h-5" />
                                    <T>Save & Print</T>
                                </Button>
                                <Link href="/invoices">
                                    <Button variant="ghost" className="w-full" size="lg">
                                        <T>Cancel</T>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
