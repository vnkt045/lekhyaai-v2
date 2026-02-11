"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { T } from "@/components/ui/translate";

interface TileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    label: string;
    description?: string;
    variant?: "primary" | "success" | "navy" | "warning" | "danger";
    count?: number;
    href?: string;
}

const variantStyles = {
    primary: "bg-[#001f3f] text-white hover:bg-[#003366] border border-[#FF851B]/20",
    success: "bg-green-600 text-white hover:bg-green-700",
    navy: "bg-[#001f3f] text-white hover:bg-[#003366]",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
};

export function TileButton({
    icon: Icon,
    label,
    description,
    variant = "primary",
    count,
    className,
    href,
    ...props
}: TileButtonProps) {
    const buttonContent = (
        <>
            <div className="bg-white/10 p-3 mb-2">
                <Icon className="w-8 h-8 text-[#FF851B]" strokeWidth={2} />
            </div>
            <div className="text-center w-full">
                <div className="font-bold text-sm uppercase tracking-wide truncate px-2"><T>{label}</T></div>
                {description && (
                    <div className="text-[10px] opacity-70 mt-1 truncate px-2"><T>{description}</T></div>
                )}
            </div>
            {count !== undefined && (
                <div className="absolute top-2 right-2 bg-[#FF851B] text-white text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center">
                    {count}
                </div>
            )}
        </>
    );

    const buttonClasses = cn(
        "relative flex flex-col items-center justify-center aspect-square rounded-none transition-all duration-200 hover:shadow-lg active:scale-95 border-b-4 border-[#FF851B] bg-[#001f3f] text-white hover:bg-[#003366]",
        className
    );

    if (href) {
        return (
            <Link href={href} className={buttonClasses}>
                {buttonContent}
            </Link>
        );
    }

    return (
        <button className={buttonClasses} {...props}>
            {buttonContent}
        </button>
    );
}
