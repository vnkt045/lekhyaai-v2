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
import { useEffect, useState } from "react";
import { T } from "@/components/ui/translate";
import { DateRangeFilter } from "@/components/ui/date-range-filter";

export default function GSTReturnsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/gst/returns")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const returns = [
        {
            id: "1",
            type: "GSTR-1",
            period: data?.period || "Current",
            status: "pending",
            amount: data?.gstr1?.totalSales || 0,
            invoices: data?.gstr1?.invoiceCount || 0,
            dueDate: "11th of Next Month"
        },
        {
            id: "2",
            type: "GSTR-3B",
            period: data?.period || "Current",
            status: "pending",
            taxPayable: data?.gstr3b?.taxPayable || 0,
            dueDate: "20th of Next Month"
        }
    ];

    if (loading) {
        return <div className="p-6"><T>Loading GST data...</T></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900"><T>GST Returns</T></h1>
                <p className="text-gray-600 mt-1"><T>File and manage your GST returns</T></p>
            </div>

            <div className="flex justify-end">
                <DateRangeFilter />
            </div>

            {/* Quick Actions - NOW WITH href! */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TileButton
                    icon={FileSpreadsheet}
                    label="GSTR-1"
                    description="Sales Return"
                    variant="primary"
                    href="/gst/returns"
                    onClick={() => alert("GSTR-1 report will show outward supply details from your invoices.")}
                />
                <TileButton
                    icon={FileSpreadsheet}
                    label="GSTR-3B"
                    description="Monthly Return"
                    variant="success"
                    href="/gst/returns"
                    onClick={() => alert("GSTR-3B summary return with tax liability and ITC details.")}
                />
                <TileButton
                    icon={Download}
                    label="GSTR-2B"
                    description="ITC Statement"
                    variant="navy"
                    href="/gst/returns"
                    onClick={() => alert("GSTR-2B auto-drafted ITC statement. Connect with GST Portal for live data.")}
                />
                <TileButton
                    icon={Upload}
                    label="File Return"
                    description="Submit to GSTN"
                    variant="warning"
                    onClick={() => alert("Filing returns requires GST Portal integration. This feature will connect to the GST portal API.")}
                />
            </div>

            {/* Current Period Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription><T>Outward Supplies</T> ({data?.period})</CardDescription>
                        <CardTitle className="text-2xl text-primary-600">
                            {formatCurrency(data?.gstr1?.totalSales || 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">{data?.gstr1?.invoiceCount || 0} <T>invoices</T></p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription><T>ITC Available</T></CardDescription>
                        <CardTitle className="text-2xl text-success-600">
                            {formatCurrency(0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600"><T>Purchase data pending</T></p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription><T>Tax Payable</T></CardDescription>
                        <CardTitle className="text-2xl text-warning">
                            {formatCurrency(data?.gstr3b?.taxPayable || 0)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600"><T>Total Tax Liability</T></p>
                    </CardContent>
                </Card>
            </div>

            {/* Returns History */}
            <Card>
                <CardHeader>
                    <CardTitle><T>Returns Filing Status</T></CardTitle>
                    <CardDescription><T>Your pending GST returns</T> ({data?.period})</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {returns.map((ret: any) => (
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
                                        <p className="text-sm text-gray-600"><T>Period</T>: {ret.period}</p>
                                        {ret.status === "pending" && ret.dueDate && (
                                            <p className="text-xs text-warning"><T>Due</T>: {ret.dueDate}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    {ret.amount !== undefined && (
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatCurrency(ret.amount)}
                                        </p>
                                    )}
                                    {ret.taxPayable !== undefined && (
                                        <p className="text-xl font-bold text-warning">
                                            {formatCurrency(ret.taxPayable)}
                                        </p>
                                    )}
                                    {ret.invoices !== undefined && (
                                        <p className="text-sm text-gray-600">{ret.invoices} <T>invoices</T></p>
                                    )}
                                    <div className="mt-3 space-x-2">
                                        <Button variant="outline" size="sm"
                                            onClick={() => alert(`${ret.type} details:\nPeriod: ${ret.period}\nStatus: ${ret.status}\n${ret.amount !== undefined ? `Sales: ${formatCurrency(ret.amount)}` : `Tax: ${formatCurrency(ret.taxPayable)}`}`)}
                                        >
                                            <T>View</T>
                                        </Button>
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
