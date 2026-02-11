"use client";

import * as React from "react";
import { PieChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ITCReportPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ITC Report</h1>
                    <p className="text-gray-600 mt-1">Input Tax Credit analysis</p>
                </div>
                <Button className="gap-2">
                    <Download className="w-5 h-5" />
                    Export
                </Button>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No ITC Data</h3>
                    <p className="text-gray-600">
                        Input Tax Credit report will show available credits from your purchases
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
