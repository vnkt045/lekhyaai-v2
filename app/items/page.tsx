"use client";

import * as React from "react";
import { Plus, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ItemsPage() {
    const items: any[] = [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Items</h1>
                    <p className="text-gray-600 mt-1">Manage products and services</p>
                </div>
                <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    New Item
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by item name, HSN code, or description..."
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {items.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
                        <p className="text-gray-600 mb-6">Add products or services to include in invoices</p>
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Add Item
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {/* Items list will be rendered here */}
                </div>
            )}
        </div>
    );
}
