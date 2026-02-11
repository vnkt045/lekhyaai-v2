"use client";

import * as React from "react";
import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GSTSummaryPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">GST Summary</h1>
                    <p className="text-gray-600 mt-1">Tax overview and summary</p>
                </div>
                <Button className="gap-2">
                    <Download className="w-5 h-5" />
                    Export
                </Button>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No GST Data</h3>
                    <p className="text-gray-600">
                        GST summary will be calculated once you have invoices and vouchers
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
