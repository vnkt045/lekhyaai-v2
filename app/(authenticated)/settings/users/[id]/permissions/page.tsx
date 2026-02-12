"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";

const MODULES = [
    { key: "dashboard", label: "Dashboard" },
    { key: "invoices", label: "Invoices" },
    { key: "vouchers", label: "Vouchers" },
    { key: "ledgers", label: "Ledgers & Groups" },
    { key: "items", label: "Inventory / Items" },
    { key: "parties", label: "Parties (Customers/Vendors)" },
    { key: "employees", label: "Employees" },
    { key: "payroll", label: "Payroll" },
    { key: "reports", label: "Reports" },
    { key: "gst", label: "GST Returns" },
    { key: "settings", label: "Settings" },
];

const ACTIONS = ["create", "read", "update", "delete"];

export default function PermissionsPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [permissions, setPermissions] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (params.id) fetchUser();
    }, [params.id]);

    const fetchUser = async () => {
        try {
            // We reuse the list API but filter client side or fetch single if endpoint existed
            // For now, let's fetch list and find (efficiency fix later)
            // Or better, create a specific GET /api/users/[id] endpoint? 
            // The list endpoint returns minimal data. Let's assume we can fetch listing and filter.
            // Actually, for a robust app, we should have a detail endpoint. 
            // But to save time and matching previous implementation:
            const res = await fetch("/api/users");
            if (res.ok) {
                const users = await res.json();
                const found = users.find((u: any) => u.id === params.id);
                if (found) {
                    setUser(found);
                    setPermissions(found.permissions || {});
                } else {
                    alert("User not found");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (moduleKey: string, action: string) => {
        setPermissions((prev: any) => {
            const modulePerms = prev[moduleKey] || {};
            return {
                ...prev,
                [moduleKey]: {
                    ...modulePerms,
                    [action]: !modulePerms[action]
                }
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/users/${params.id}/permissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions })
            });

            if (res.ok) {
                router.push("/settings/users");
                router.refresh();
            } else {
                alert("Failed to update permissions");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><T>Loading...</T></div>;
    if (!user) return <div className="p-8 text-center text-red-500"><T>User not found</T></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/settings/users">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <T>Back to Users</T>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[#001f3f]"><T>Permissions: {user.name}</T></h1>
                    <p className="text-muted-foreground"><T>Configure access control for this user</T></p>
                </div>
            </div>

            <Card className="border-t-4 border-t-[#FF851B]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-[#FF851B]" />
                        <T>Access Matrix</T>
                    </CardTitle>
                    <CardDescription><T>Define what this user can do in each module</T></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 w-1/3"><T>Module</T></th>
                                    {ACTIONS.map(action => (
                                        <th key={action} className="text-center py-3 px-4 font-semibold text-gray-700 capitalize">
                                            <T>{action}</T>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {MODULES.map((module) => (
                                    <tr key={module.key} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-[#001f3f]"><T>{module.label}</T></td>
                                        {ACTIONS.map(action => {
                                            const isChecked = permissions[module.key]?.[action] || false;
                                            return (
                                                <td key={action} className="text-center py-3 px-4">
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => handleToggle(module.key, action)}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button onClick={handleSave} disabled={saving} className="bg-[#001f3f] hover:bg-[#003366] text-white min-w-[150px]">
                            {saving ? <span className="animate-spin mr-2">⏳</span> : <Save className="mr-2 h-4 w-4" />}
                            <T>Save Permissions</T>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
