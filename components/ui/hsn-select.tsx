"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HSNItem {
    code: string;
    description: string;
    gstRate: number;
    type?: "global" | "tenant";
}

interface HSNSelectProps {
    value: string;
    onChange: (code: string) => void;
    onSelect: (item: HSNItem) => void;
    className?: string;
    placeholder?: string;
}

export function HSNSelect({ value, onChange, onSelect, className, placeholder = "HSN/SAC" }: HSNSelectProps) {
    const [query, setQuery] = React.useState(value);
    const [results, setResults] = React.useState<HSNItem[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    // Sync internal state if prop changes
    React.useEffect(() => {
        setQuery(value);
    }, [value]);

    // Handle outside click
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (val: string) => {
        setQuery(val);
        onChange(val);

        if (val.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/hsn?q=${encodeURIComponent(val)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Failed to search HSN:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: HSNItem) => {
        setQuery(item.code);
        onChange(item.code);
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative", className)} ref={wrapperRef}>
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="pr-8"
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-[300px] mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {loading && <div className="p-2 text-sm text-gray-500">Searching...</div>}
                    {!loading && results.map((item) => (
                        <div
                            key={item.code}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleSelect(item)}
                        >
                            <div className="flex justify-between font-medium">
                                <span>{item.code}</span>
                                <span className={item.type === 'tenant' ? 'text-blue-600' : 'text-gray-600'}>
                                    {item.gstRate}%
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={item.description}>
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
