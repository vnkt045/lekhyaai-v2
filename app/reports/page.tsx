"use client";

import * as React from "react";
import { TrendingUp, FileText, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TileButton } from "@/components/ui/tile-button";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">View business insights and analytics</p>
            </div>

            {/* Report Categories */}
            <div>
                <h2 className="text-xl font-semibold mb-4">GST Reports</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TileButton
                        icon={FileText}
                        label="Sales Register"
                        description="View all sales"
                        variant="primary"
                    />
                    <TileButton
                        icon={FileText}
                        label="Purchase Register"
                        description="View all purchases"
                        variant="success"
                    />
                    <TileButton
                        icon={BarChart3}
                        label="GST Summary"
                        description="Tax overview"
                        variant="navy"
                    />
                    <TileButton
                        icon={PieChart}
                        label="ITC Report"
                        description="Input tax credit"
                        variant="warning"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Financial Reports</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TileButton
                        icon={TrendingUp}
                        label="Profit & Loss"
                        description="P&L statement"
                        variant="primary"
                    />
                    <TileButton
                        icon={FileText}
                        label="Balance Sheet"
                        description="Financial position"
                        variant="success"
                    />
                    <TileButton
                        icon={BarChart3}
                        label="Trial Balance"
                        description="Account balances"
                        variant="navy"
                    />
                    <TileButton
                        icon={PieChart}
                        label="Cash Flow"
                        description="Cash movement"
                        variant="warning"
                    />
                </div>
            </div>

            {/* Coming Soon Message */}
            <Card>
                <CardContent className="py-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Coming Soon</h3>
                    <p className="text-gray-600">
                        Detailed reports and analytics will be available once you start recording transactions
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
