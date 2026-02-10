"use client";

import * as React from "react";
import { Building2, User, Bell, Lock, Database, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>

            {/* Company Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-primary-600" />
                        <div>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Update your business details</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Company Name</label>
                        <Input placeholder="Enter company name" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">GSTIN</label>
                        <Input placeholder="Enter GSTIN" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Address</label>
                        <Input placeholder="Enter address" className="mt-1" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* User Profile */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-success-600" />
                        <div>
                            <CardTitle>User Profile</CardTitle>
                            <CardDescription>Manage your personal information</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input placeholder="Enter your name" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="Enter email" className="mt-1" />
                    </div>
                    <Button>Update Profile</Button>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-navy-600" />
                        <div>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Password and authentication settings</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">Change Password</Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-warning" />
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage email and app notifications</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">Notification preferences coming soon</p>
                </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Database className="w-6 h-6 text-primary-600" />
                        <div>
                            <CardTitle>Data & Privacy</CardTitle>
                            <CardDescription>Export, import, and backup your data</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-x-2">
                    <Button variant="outline">Export Data</Button>
                    <Button variant="outline">Import Data</Button>
                </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-success-600" />
                        <div>
                            <CardTitle>Language & Region</CardTitle>
                            <CardDescription>Set your preferred language and timezone</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">Multi-language support coming soon</p>
                </CardContent>
            </Card>
        </div>
    );
}
