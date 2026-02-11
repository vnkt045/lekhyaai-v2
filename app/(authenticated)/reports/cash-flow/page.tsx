"use client";

import * as React from "react";
import { PieChart, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { T } from "@/components/ui/translate";

export default function CashFlowPage() {
    const [period, setPeriod] = React.useState("2024-25");

    const handlePeriod = () => {
        const newPeriod = prompt("Enter Financial Year (e.g., 2024-25):", period);
        if (newPeriod) setPeriod(newPeriod);
    };

    const handleExport = () => {
        alert(`Exporting Cash Flow Statement for FY ${period}...\nThis will generate a PDF/Excel report once transaction data is available.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900"><T>Cash Flow Statement</T></h1>
                    <p className="text-gray-600 mt-1"><T>Cash movement analysis</T> - FY {period}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handlePeriod}>
                        <Calendar className="w-5 h-5" />
                        <T>Period</T>
                    </Button>
                    <Button className="gap-2" onClick={handleExport}>
                        <Download className="w-5 h-5" />
                        <T>Export</T>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>No Cash Flow Data</T></h3>
                    <p className="text-gray-600">
                        <T>Cash flow statement will track operating, investing, and financing activities</T>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
