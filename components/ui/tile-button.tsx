"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    label: string;
    description?: string;
    variant?: "primary" | "success" | "navy" | "warning" | "danger";
    count?: number;
}

const variantStyles = {
    primary: "bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700",
    success: "bg-gradient-to-br from-success-400 to-success-600 hover:from-success-500 hover:to-success-700",
    navy: "bg-gradient-to-br from-navy-500 to-navy-700 hover:from-navy-600 hover:to-navy-800",
    warning: "bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700",
    danger: "bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700",
};

export function TileButton({
    icon: Icon,
    label,
    description,
    variant = "primary",
    count,
    className,
    ...props
}: TileButtonProps) {
    return (
        <button
            className={cn(
                "relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl text-white shadow-pos-lg transition-all duration-200 hover:scale-105 active:scale-95 min-h-[140px]",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            <Icon className="w-10 h-10" strokeWidth={2} />
            <div className="text-center">
                <div className="font-semibold text-pos-base">{label}</div>
                {description && (
                    <div className="text-pos-xs opacity-90 mt-1">{description}</div>
                )}
            </div>
            {count !== undefined && (
                <div className="absolute top-3 right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {count}
                </div>
            )}
        </button>
    );
}
