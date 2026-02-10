"use client";

import * as React from "react";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TileButton } from "@/components/ui/tile-button";

export default function PartiesPage() {
    const parties: any[] = [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Parties</h1>
                    <p className="text-gray-600 mt-1">Manage customers and suppliers</p>
                </div>
                <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    New Party
                </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TileButton
                    icon={Users}
                    label="Customers"
                    description="View all"
                    variant="primary"
                />
                <TileButton
                    icon={Users}
                    label="Suppliers"
                    description="View all"
                    variant="success"
                />
                <TileButton
                    icon={Users}
                    label="Both"
                    description="View all"
                    variant="navy"
                />
                <TileButton
                    icon={Plus}
                    label="Add New"
                    description="Create party"
                    variant="warning"
                />
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by party name, GSTIN, or contact..."
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {parties.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No parties yet</h3>
                        <p className="text-gray-600 mb-6">Add customers and suppliers to start doing business</p>
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Add Party
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {/* Party list will be rendered here */}
                </div>
            )}
        </div>
    );
}
