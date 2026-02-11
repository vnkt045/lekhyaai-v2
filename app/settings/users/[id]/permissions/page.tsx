"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";

// Modules to control
const MODULES = [
    "invoices", "vouchers", "items", "parties", "reports", "employees", "banking", "settings"
];

// Actions per module
const ACTIONS = ["read", "create", "update", "delete"];

export default function PermissionsMatrixPage() {
    const params = useParams();
    const router = useRouter();
    const [permissions, setPermissions] = useState<any>({});
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (params.id) fetchUserPermissions();
    }, [params.id]);

    const fetchUserPermissions = async () => {
        try {
            // Need a specific endpoint or use the general users one with filtering?
            // Let's assume we can fetch specific user details via GET /api/users?id=... or /api/users/[id]
            // For now, let's just fetch all and filter in client (not ideal but works for prototype) or create /api/users/[id]
            const res = await fetch(`/api/users/${params.id}`); // This route needs to be created!
            if (res.ok) {
                const user = await res.json();
                setUserName(user.name);
                setRole(user.role);
                setPermissions(user.permissions || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (module: string, action: string) => {
        setPermissions((prev: any) => {
            const modulePerms = prev[module] || {};
            return {
                ...prev,
                [module]: {
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
                body: JSON.stringify({ permissions, role }) // Can also update role here if needed
            });
            if (res.ok) {
                alert("Permissions updated!");
                router.refresh();
            } else {
                alert("Failed to update");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><T>Loading...</T></div>;

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
                    <h1 className="text-2xl font-bold text-[#001f3f]"><T>Permissions</T>: {userName}</h1>
                    <p className="text-muted-foreground"><T>Configure granular access control</T></p>
                </div>
            </div>

            <Card className="border-t-4 border-t-[#FF851B]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-[#001f3f]"><T>Access Matrix</T></CardTitle>
                        <CardDescription><T>Toggle specific actions for each module</T></CardDescription>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-[#001f3f] hover:bg-[#003366] text-white">
                        {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /><T>Save Changes</T></>}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left p-3 font-semibold text-gray-700"><T>Module</T></th>
                                    {ACTIONS.map(action => (
                                        <th key={action} className="text-center p-3 font-semibold text-gray-700 capitalize"><T>{action}</T></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODULES.map(module => (
                                    <tr key={module} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium capitalize text-[#001f3f]"><T>{module}</T></td>
                                        {ACTIONS.map(action => {
                                            const isChecked = permissions[module]?.[action] || false;
                                            return (
                                                <td key={action} className="text-center p-3">
                                                    <Switch
                                                        checked={isChecked}
                                                        onCheckedChange={() => handleToggle(module, action)}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
