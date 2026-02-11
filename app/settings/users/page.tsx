"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Settings, User } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
    designation: string | null;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#001f3f]"><T>User Management</T></h1>
                    <p className="text-muted-foreground"><T>Manage access and permissions</T></p>
                </div>
            </div>

            <Card className="border-t-4 border-t-[#FF851B]">
                <CardHeader>
                    <CardTitle className="text-[#001f3f]"><T>Users</T></CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4"><span className="animate-spin">⏳</span> <T>Loading users...</T></div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#001f3f]">{user.name}</h4>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <Button variant="outline" size="sm" asChild className="border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white">
                                            <Link href={`/settings/users/${user.id}/permissions`}>
                                                <Shield className="h-3 w-3 mr-2" />
                                                <T>Permissions</T>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
