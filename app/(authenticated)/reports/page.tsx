"use client";

import * as React from "react";
import { TrendingUp, FileText, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TileButton } from "@/components/ui/tile-button";
import { T } from "@/components/ui/translate";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900"><T>Reports</T></h1>
                <p className="text-gray-600 mt-1"><T>View business insights and analytics</T></p>
            </div>

            {/* Report Categories */}
            <div>
                <h2 className="text-xl font-semibold mb-4"><T>GST Reports</T></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TileButton
                        icon={FileText}
                        label="Sales Register"
                        description="View all sales"
                        variant="primary"
                        href="/reports/sales-register"
                    />
                    <TileButton
                        icon={FileText}
                        label="Purchase Register"
                        description="View all purchases"
                        variant="success"
                        href="/reports/purchase-register"
                    />
                    <TileButton
                        icon={BarChart3}
                        label="GST Summary"
                        description="Tax overview"
                        variant="navy"
                        href="/reports/gst-summary"
                    />
                    <TileButton
                        icon={PieChart}
                        label="ITC Report"
                        description="Input tax credit"
                        variant="warning"
                        href="/reports/itc-report"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4"><T>Financial Reports</T></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TileButton
                        icon={TrendingUp}
                        label="Profit & Loss"
                        description="P&L statement"
                        variant="primary"
                        href="/reports/profit-loss"
                    />
                    <TileButton
                        icon={FileText}
                        label="Balance Sheet"
                        description="Financial position"
                        variant="success"
                        href="/reports/balance-sheet"
                    />
                    <TileButton
                        icon={BarChart3}
                        label="Trial Balance"
                        description="Account balances"
                        variant="navy"
                        href="/reports/trial-balance"
                    />
                    <TileButton
                        icon={PieChart}
                        label="Cash Flow"
                        description="Cash movement"
                        variant="warning"
                        href="/reports/cash-flow"
                    />
                </div>
            </div>

            {/* Coming Soon Message */}
            <Card>
                <CardContent className="py-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2"><T>Reports Coming Soon</T></h3>
                    <p className="text-gray-600">
                        <T>Detailed reports and analytics will be available once you start recording transactions</T>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
