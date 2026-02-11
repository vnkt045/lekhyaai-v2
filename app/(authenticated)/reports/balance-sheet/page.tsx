"use client";

import * as React from "react";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { T } from "@/components/ui/translate";

export default function BalanceSheetPage() {
    const [asOfDate, setAsOfDate] = React.useState(new Date().toISOString().split("T")[0]);

    const handleDate = () => {
        const newDate = prompt("Enter date (YYYY-MM-DD):", asOfDate);
        if (newDate) setAsOfDate(newDate);
    };

    const handleExport = () => {
        alert(`Exporting Balance Sheet as of ${asOfDate}...\nThis will generate a PDF/Excel report once transaction data is available.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900"><T>Balance Sheet</T></h1>
                    <p className="text-gray-600 mt-1"><T>Financial position statement</T> - {asOfDate}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleDate}>
                        <Calendar className="w-5 h-5" />
                        <T>As of Date</T>
                    </Button>
                    <Button className="gap-2" onClick={handleExport}>
                        <Download className="w-5 h-5" />
                        <T>Export</T>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>No Balance Sheet Data</T></h3>
                    <p className="text-gray-600">
                        <T>Balance sheet will show assets, liabilities, and equity once you have transactions</T>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
