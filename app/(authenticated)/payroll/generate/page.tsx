"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Play, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function GeneratePayrollPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/payroll/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ month, year })
            });
            const data = await res.json();

            if (res.ok) {
                setResult({ success: true, ...data });
            } else {
                setResult({ success: false, message: data.message || "Failed to generate" });
            }
        } catch (error) {
            setResult({ success: false, message: "An error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/payroll">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <T>Back to Payroll</T>
                    </Link>
                </Button>
            </div>

            <Card className="border-t-4 border-t-[#FF851B]">
                <CardHeader>
                    <CardTitle className="text-[#001f3f]"><T>Generate Payroll</T></CardTitle>
                    <CardDescription>
                        <T>Process salaries for all active employees for the selected period.</T>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium"><T>Select Month</T></label>
                            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium"><T>Select Year</T></label>
                            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2026">2026</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-md flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {result.success ? <CheckCircle className="h-5 w-5 mt-0.5" /> : <AlertTriangle className="h-5 w-5 mt-0.5" />}
                            <div>
                                <p className="font-semibold">{result.message}</p>
                                {result.success && (
                                    <p className="text-sm mt-1">
                                        Created: {result.createdCount}, Skipped: {result.skippedCount}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-[#001f3f] hover:bg-[#003366] text-white h-12 text-lg"
                    >
                        {loading ? <span className="animate-spin mr-2">⏳</span> : <Play className="mr-2 h-5 w-5" />}
                        <T>Start Processing</T>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
