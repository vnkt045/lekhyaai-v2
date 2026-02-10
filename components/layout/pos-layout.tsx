"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Receipt,
    BookOpen,
    Users,
    Package,
    Settings,
    FileSpreadsheet,
    TrendingUp,
    Menu,
    X,
    Building2,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Vouchers", href: "/vouchers", icon: Receipt },
    { name: "Ledgers", href: "/ledgers", icon: BookOpen },
    { name: "Parties", href: "/parties", icon: Users },
    { name: "Items", href: "/items", icon: Package },
    { name: "GST Returns", href: "/gst/returns", icon: FileSpreadsheet },
    { name: "Reports", href: "/reports", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function POSLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-white hover:bg-primary-600"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-8 h-8" />
                            <div>
                                <h1 className="text-xl font-bold">LekhyaAI</h1>
                                <p className="text-xs opacity-90">GST Accounting & Compliance</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold">Demo Company Pvt Ltd</p>
                            <p className="text-xs opacity-90">GSTIN: 27AABCU9603R1ZM</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-primary-600"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-y-auto",
                        sidebarOpen ? "w-64" : "w-0 -translate-x-full"
                    )}
                >
                    <nav className="p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-pos-sm font-medium transition-all",
                                        isActive
                                            ? "bg-primary-100 text-primary-700 shadow-sm"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 transition-all duration-300",
                        sidebarOpen ? "ml-64" : "ml-0"
                    )}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
