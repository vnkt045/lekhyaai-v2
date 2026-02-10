"use client";

import {
    FileText,
    Receipt,
    Users,
    Package,
    FileSpreadsheet,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    IndianRupee,
} from "lucide-react";
import { TileButton } from "@/components/ui/tile-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
    // Mock data - will be replaced with real data from API
    const stats = {
        todaySales: 125000,
        pendingInvoices: 8,
        itcAvailable: 45000,
        gstPayable: 32000,
    };

    const recentTransactions = [
        { id: 1, type: "Sales Invoice", number: "INV-001", party: "ABC Traders", amount: 25000, date: new Date() },
        { id: 2, type: "Payment", number: "PAY-045", party: "XYZ Suppliers", amount: -15000, date: new Date() },
        { id: 3, type: "Purchase Bill", number: "PUR-123", party: "DEF Industries", amount: -35000, date: new Date() },
    ];

    const complianceAlerts = [
        { id: 1, type: "success", message: "GSTR-1 for Jan 2024 filed successfully", date: "2 days ago" },
        { id: 2, type: "warning", message: "GSTR-3B for Feb 2024 due in 5 days", date: "Today" },
        { id: 3, type: "pending", message: "Reconcile 3 invoices with GSTR-2B", date: "Today" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Today's Sales</CardDescription>
                        <CardTitle className="text-2xl text-success-600 flex items-center gap-2">
                            <IndianRupee className="w-6 h-6" />
                            {formatCurrency(stats.todaySales)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pending Invoices</CardDescription>
                        <CardTitle className="text-2xl text-warning flex items-center gap-2">
                            <Clock className="w-6 h-6" />
                            {stats.pendingInvoices}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>ITC Available</CardDescription>
                        <CardTitle className="text-2xl text-navy-600 flex items-center gap-2">
                            <IndianRupee className="w-6 h-6" />
                            {formatCurrency(stats.itcAvailable)}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>GST Payable</CardDescription>
                        <CardTitle className="text-2xl text-primary-600 flex items-center gap-2">
                            <IndianRupee className="w-6 h-6" />
                            {formatCurrency(stats.gstPayable)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <TileButton
                        icon={FileText}
                        label="New Invoice"
                        variant="primary"
                    />
                    <TileButton
                        icon={Receipt}
                        label="New Voucher"
                        variant="success"
                    />
                    <TileButton
                        icon={Users}
                        label="Add Party"
                        variant="navy"
                    />
                    <TileButton
                        icon={Package}
                        label="Add Item"
                        variant="warning"
                    />
                    <TileButton
                        icon={FileSpreadsheet}
                        label="GST Returns"
                        variant="primary"
                    />
                    <TileButton
                        icon={TrendingUp}
                        label="Reports"
                        variant="success"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest business activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTransactions.map((txn) => (
                                <div
                                    key={txn.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{txn.type} - {txn.number}</p>
                                        <p className="text-xs text-gray-600">{txn.party}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${txn.amount > 0 ? 'text-success-600' : 'text-red-600'}`}>
                                            {formatCurrency(Math.abs(txn.amount))}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatDate(txn.date)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Alerts</CardTitle>
                        <CardDescription>GST filing status and reminders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {complianceAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    {alert.type === "success" && (
                                        <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                                    )}
                                    {alert.type === "warning" && (
                                        <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                                    )}
                                    {alert.type === "pending" && (
                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{alert.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                                    </div>
                                    <Badge
                                        variant={
                                            alert.type === "success"
                                                ? "compliant"
                                                : alert.type === "warning"
                                                    ? "warning"
                                                    : "pending"
                                        }
                                    >
                                        {alert.type}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
