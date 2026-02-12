
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { T } from "@/components/ui/translate";
// Wait, I removed useToast from employees/new/page.tsx because it didn't exist.
// So I should avoid it here too unless I create it.
// I'll stick to alert() or basic feedback if toast is missing. 
// Or better, just show inline error/success.

// Actually, let's check if I can make a simple toast or just alert.
// I'll use simple alert for now to avoid build errors.

interface ProfileClientProps {
    user: any;
    tenant: any;
}

export default function ProfileClient({ user, tenant }: ProfileClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Company Form State
    const [companyDetails, setCompanyDetails] = useState({
        companyName: tenant.companyName,
        gstin: tenant.gstin,
        pan: tenant.pan,
        state: tenant.state,
        address: tenant.address,
        email: tenant.email,
        phone: tenant.phone,
        financialYear: tenant.financialYear,
        turnover: tenant.turnover,
        gstRegType: tenant.gstRegType
    });

    const isAdmin = user.role === 'admin' || user.role === 'owner';

    const handleCompanyUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/settings/tenant", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(companyDetails)
            });

            if (!res.ok) throw new Error("Failed to update");

            alert("Company details updated successfully!"); // Simple feedback
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to update company details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
                <TabsTrigger value="profile"><T>My Profile</T></TabsTrigger>
                <TabsTrigger value="company"><T>Company Settings</T></TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-[#001f3f]"><T>Personal Information</T></CardTitle>
                        <CardDescription>
                            <T>View your personal details and role.</T>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label><T>Full Name</T></Label>
                                <Input value={user.name} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label><T>Email Address</T></Label>
                                <Input value={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label><T>Role</T></Label>
                                <Input value={user.role} disabled className="capitalize" />
                            </div>
                            <div className="space-y-2">
                                <Label><T>Designation</T></Label>
                                <Input value={user.designation || "N/A"} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label><T>Tenant ID</T></Label>
                                <Input value={user.tenantId} disabled className="font-mono text-xs" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-4">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-[#001f3f]"><T>Company Details</T></CardTitle>
                        <CardDescription>
                            <T>Manage your business information.</T>
                            {!isAdmin && <span className="text-red-500 ml-2">(Read Only)</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCompanyUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label><T>Company Name</T></Label>
                                    <Input
                                        value={companyDetails.companyName}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>GSTIN</T></Label>
                                    <Input
                                        value={companyDetails.gstin}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, gstin: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>PAN</T></Label>
                                    <Input
                                        value={companyDetails.pan}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, pan: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>State</T></Label>
                                    <Input
                                        value={companyDetails.state}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, state: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label><T>Address</T></Label>
                                    <Input
                                        value={companyDetails.address}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>Email</T></Label>
                                    <Input
                                        value={companyDetails.email}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>Phone</T></Label>
                                    <Input
                                        value={companyDetails.phone}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>Financial Year</T></Label>
                                    <Input
                                        value={companyDetails.financialYear}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, financialYear: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>Turnover Range</T></Label>
                                    <Input
                                        value={companyDetails.turnover}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, turnover: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label><T>GST Reg Type</T></Label>
                                    <Input
                                        value={companyDetails.gstRegType}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, gstRegType: e.target.value })}
                                        disabled={!isAdmin}
                                    />
                                </div>
                            </div>

                            {isAdmin && (
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={isLoading} className="bg-[#FF851B] hover:bg-[#e07516] text-white">
                                        {isLoading ? <T>Saving...</T> : <T>Save Changes</T>}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
