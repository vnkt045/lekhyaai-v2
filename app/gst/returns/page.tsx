"use client";

import {
    FileSpreadsheet,
    Download,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import { TileButton } from "@/components/ui/tile-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function GSTReturnsPage() {
    const returns = [
        {
            id: "1",
            type: "GSTR-1",
            period: "Feb 2024",
            status: "filed",
            filedDate: "11 Mar 2024",
            invoices: 45,
            amount: 1250000,
        },
        {
            id: "2",
            type: "GSTR-3B",
            period: "Feb 2024",
            status: "pending",
            dueDate: "20 Mar 2024",
            taxPayable: 125000,
        },
        {
            id: "3",
            type: "GSTR-1",
            period: "Jan 2024",
            status: "filed",
            filedDate: "10 Feb 2024",
            invoices: 38,
            amount: 980000,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">GST Returns</h1>
                <p className="text-gray-600 mt-1">File and manage your GST returns</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TileButton
                    icon={FileSpreadsheet}
                    label="GSTR-1"
                    description="Sales Return"
                    variant="primary"
                />
                <TileButton
                    icon={FileSpreadsheet}
                    label="GSTR-3B"
                    description="Monthly Return"
                    variant="success"
                />
                <TileButton
                    icon={Download}
                    label="GSTR-2B"
                    description="ITC Statement"
                    variant="navy"
                />
                <TileButton
                    icon={Upload}
                    label="File Return"
                    description="Submit to GSTN"
                    variant="warning"
                />
            </div>

            {/* Current Period Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Outward Supplies (Feb 2024)</CardDescription>
                        <CardTitle className="text-2xl text-primary-600">
                            {formatCurrency(1250000)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">45 invoices</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>ITC Available</CardDescription>
                        <CardTitle className="text-2xl text-success-600">
                            {formatCurrency(45000)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">From 32 bills</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Tax Payable</CardDescription>
                        <CardTitle className="text-2xl text-warning">
                            {formatCurrency(125000)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">Due: 20 Mar 2024</p>
                    </CardContent>
                </Card>
            </div>

            {/* Returns History */}
            <Card>
                <CardHeader>
                    <CardTitle>Returns History</CardTitle>
                    <CardDescription>Your filed and pending GST returns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {returns.map((ret) => (
                            <div
                                key={ret.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {ret.status === "filed" ? (
                                        <CheckCircle2 className="w-8 h-8 text-success-600" />
                                    ) : ret.status === "pending" ? (
                                        <Clock className="w-8 h-8 text-warning" />
                                    ) : (
                                        <AlertCircle className="w-8 h-8 text-danger" />
                                    )}

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-lg">{ret.type}</h3>
                                            <Badge
                                                variant={
                                                    ret.status === "filed"
                                                        ? "compliant"
                                                        : ret.status === "pending"
                                                            ? "warning"
                                                            : "danger"
                                                }
                                            >
                                                {ret.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">Period: {ret.period}</p>
                                        {ret.status === "filed" && ret.filedDate && (
                                            <p className="text-xs text-gray-500">Filed on: {ret.filedDate}</p>
                                        )}
                                        {ret.status === "pending" && ret.dueDate && (
                                            <p className="text-xs text-warning">Due: {ret.dueDate}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    {ret.amount && (
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatCurrency(ret.amount)}
                                        </p>
                                    )}
                                    {ret.taxPayable && (
                                        <p className="text-xl font-bold text-warning">
                                            {formatCurrency(ret.taxPayable)}
                                        </p>
                                    )}
                                    {ret.invoices && (
                                        <p className="text-sm text-gray-600">{ret.invoices} invoices</p>
                                    )}
                                    <div className="mt-3 space-x-2">
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                        {ret.status === "filed" && (
                                            <Button variant="ghost" size="sm">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
