"use client";

import * as React from "react";
import { FileText, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesRegisterPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sales Register</h1>
                    <p className="text-gray-600 mt-1">View all sales transactions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-5 h-5" />
                        Filter
                    </Button>
                    <Button className="gap-2">
                        <Download className="w-5 h-5" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Data</h3>
                    <p className="text-gray-600">
                        Sales register will show all your invoices once you start creating them
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
