"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { T } from "@/components/ui/translate"; // Assuming translation exists
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
    className?: string;
    showClear?: boolean;
}

export function DateRangeFilter({ className, showClear = true }: DateRangeFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [from, setFrom] = React.useState(searchParams.get("from") || "");
    const [to, setTo] = React.useState(searchParams.get("to") || "");

    // Sync with URL if it changes externally
    React.useEffect(() => {
        setFrom(searchParams.get("from") || "");
        setTo(searchParams.get("to") || "");
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams);
        if (from) params.set("from", from);
        else params.delete("from");

        if (to) params.set("to", to);
        else params.delete("to");

        // Reset page to 1 on filter change
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setFrom("");
        setTo("");
        const params = new URLSearchParams(searchParams);
        params.delete("from");
        params.delete("to");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasActiveFilter = !!from || !!to;

    return (
        <div className={cn("flex items-center gap-2 bg-white p-1 rounded-md border shadow-sm", className)}>
            <div className="flex items-center gap-1.5 px-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline"><T>Period</T>:</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8 w-[130px] text-xs px-2 py-1"
                        placeholder="From"
                    />
                </div>
                <span className="text-gray-400 text-xs">-</span>
                <div className="relative">
                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8 w-[130px] text-xs px-2 py-1"
                        placeholder="To"
                    />
                </div>
            </div>

            <Button
                variant="default" // Assuming default is acceptable or 'secondary'
                size="sm"
                onClick={handleApply}
                className="h-8 px-3 text-xs bg-[#001f3f] hover:bg-[#003366] text-white"
            >
                <T>Go</T>
            </Button>

            {showClear && hasActiveFilter && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                    title="Clear Date Filter"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
