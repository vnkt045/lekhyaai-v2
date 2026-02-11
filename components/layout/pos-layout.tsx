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
import { Calculator } from "@/components/ui/calculator";

import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { useSession } from "next-auth/react";
import { T } from "@/components/ui/translate";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Vouchers", href: "/vouchers", icon: Receipt },
    { name: "Ledgers", href: "/ledgers", icon: BookOpen },
    { name: "Parties", href: "/parties", icon: Users },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Compliance", href: "/dashboard/compliance", icon: TrendingUp },
    { name: "Items", href: "/items", icon: Package },
    { name: "GST Returns", href: "/gst/returns", icon: FileSpreadsheet },
    { name: "Reports", href: "/reports", icon: TrendingUp },
    { name: "Settings", href: "/settings/profile", icon: Settings },
];

import { signOut } from "next-auth/react";

import { Clock } from "@/components/ui/clock";

function POSLayoutContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar - Navy Blue & Orange */}
            <header className="sticky top-0 z-50 bg-[#001f3f] text-white shadow-lg border-b-4 border-[#FF851B]">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-white hover:bg-[#FF851B] hover:text-white transition-colors"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white rounded-sm">
                                <Building2 className="w-6 h-6 text-[#001f3f]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-[#FF851B]">LekhyaAI</h1>
                                <p className="text-[10px] text-gray-300 uppercase tracking-wider">GST Accounting</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Clock */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FF851B]">
                        <Clock />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Switcher */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="px-3 py-1.5 text-sm font-medium bg-[#003366] border border-[#FF851B]/30 rounded text-white hover:border-[#FF851B] focus:outline-none focus:ring-2 focus:ring-[#FF851B] transition-all cursor-pointer"
                            style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23FF851B\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 8px center',
                                paddingRight: '28px'
                            }}
                        >
                            <option value="en" className="bg-white text-gray-900">🇬🇧 English</option>
                            <option value="hi" className="bg-white text-gray-900">🇮🇳 हिंदी (Hindi)</option>
                            <option value="ta" className="bg-white text-gray-900">🇮🇳 தமிழ் (Tamil)</option>
                            <option value="te" className="bg-white text-gray-900">🇮🇳 తెలుగు (Telugu)</option>
                            <option value="bn" className="bg-white text-gray-900">🇮🇳 বাংলা (Bengali)</option>
                            <option value="mr" className="bg-white text-gray-900">🇮🇳 मराठी (Marathi)</option>
                            <option value="gu" className="bg-white text-gray-900">🇮🇳 ગુજરાતી (Gujarati)</option>
                            <option value="kn" className="bg-white text-gray-900">🇮🇳 ಕನ್ನಡ (Kannada)</option>
                            <option value="ml" className="bg-white text-gray-900">🇮🇳 മലയാളം (Malayalam)</option>
                            <option value="pa" className="bg-white text-gray-900">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="or" className="bg-white text-gray-900">🇮🇳 ଓଡ଼ିଆ (Odia)</option>
                            <option value="as" className="bg-white text-gray-900">🇮🇳 অসমীয়া (Assamese)</option>
                            <option value="ur" className="bg-white text-gray-900">🇮🇳 اردو (Urdu)</option>
                            <option value="sa" className="bg-white text-gray-900">🇮🇳 संस्कृतम् (Sanskrit)</option>
                            <option value="ks" className="bg-white text-gray-900">🇮🇳 कॉशुर (Kashmiri)</option>
                            <option value="kok" className="bg-white text-gray-900">🇮🇳 कोंकणी (Konkani)</option>
                            <option value="mni" className="bg-white text-gray-900">🇮🇳 মৈতৈলোন্ (Manipuri)</option>
                            <option value="ne" className="bg-white text-gray-900">🇮🇳 नेपाली (Nepali)</option>
                            <option value="brx" className="bg-white text-gray-900">🇮🇳 बड़ो (Bodo)</option>
                            <option value="doi" className="bg-white text-gray-900">🇮🇳 डोगरी (Dogri)</option>
                            <option value="mai" className="bg-white text-gray-900">🇮🇳 मैथिली (Maithili)</option>
                            <option value="sat" className="bg-white text-gray-900">🇮🇳 ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
                            <option value="sd" className="bg-white text-gray-900">🇮🇳 سنڌي (Sindhi)</option>
                        </select>

                        <div className="text-right hidden md:block border-l border-white/10 pl-4">
                            <p className="text-sm font-bold text-white leading-none mb-1">
                                {session?.user?.tenant?.companyName || "Your Company"}
                            </p>
                            {session?.user?.tenant?.gstin && (
                                <p className="text-[10px] text-[#FF851B] font-mono">
                                    {session.user.tenant.gstin}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-red-600 hover:text-white transition-colors"
                            onClick={handleLogout}
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
                        "fixed left-0 top-[70px] h-[calc(100vh-70px)] bg-[#001f3f] text-white border-r border-[#FF851B]/20 transition-all duration-300 z-40 overflow-y-auto",
                        sidebarOpen ? "w-64" : "w-0 -translate-x-full"
                    )}
                >
                    <nav className="p-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-4",
                                        isActive
                                            ? "bg-white/10 border-[#FF851B] text-[#FF851B]"
                                            : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#FF851B]" : "text-gray-400")} />
                                    <T>{item.name}</T>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 pt-6",
                        sidebarOpen ? "ml-64" : "ml-0"
                    )}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
            <Calculator />
        </div >
    );
}

export function POSLayout({ children }: { children: React.ReactNode }) {
    return (
        <POSLayoutContent>{children}</POSLayoutContent>
    );
}
