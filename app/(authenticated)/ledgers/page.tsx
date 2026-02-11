"use client";

import * as React from "react";
import { Plus, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LedgersPage() {
    const ledgers: any[] = [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ledgers</h1>
                    <p className="text-gray-600 mt-1">Manage your chart of accounts</p>
                </div>
                {ledgers.length > 0 && (
                    <Link href="/ledgers/new">
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            New Ledger
                        </Button>
                    </Link>
                )}
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search ledgers by name or group..."
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {ledgers.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No ledgers yet</h3>
                        <p className="text-gray-600 mb-6">Create ledger accounts to track your transactions</p>
                        <Link href="/ledgers/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                Create Ledger
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {/* Ledger list will be rendered here */}
                </div>
            )}
        </div>
    );
}
