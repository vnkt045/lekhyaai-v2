"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/components/ui/use-toast"; // Removed to fix build
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";

export default function NewEmployeePage() {
    const router = useRouter();
    // const { toast } = useToast(); 
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        department: "",
        email: "",
        phone: "",
        dateOfJoining: "",
        salary: "",
        bankName: "",
        accountNo: "",
        ifsc: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                bankDetails: {
                    bankName: formData.bankName,
                    accountNo: formData.accountNo,
                    ifsc: formData.ifsc
                }
            };

            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // toast({ title: "Success", description: "Employee created successfully" });
                router.push("/employees");
                router.refresh();
            } else {
                // toast({ title: "Error", description: "Failed to create employee", variant: "destructive" });
                alert("Failed to create employee");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/employees">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <T>Back</T>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-[#001f3f]"><T>New Employee</T></h1>
                    <p className="text-muted-foreground"><T>Onboard a new team member</T></p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-t-4 border-t-[#FF851B]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-[#FF851B]" />
                            <T>Employee Details</T>
                        </CardTitle>
                        <CardDescription><T>Enter personal and professional information</T></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name"><T>Full Name</T> *</Label>
                                <Input required id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Kumar" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email"><T>Email Address</T></Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="rahul@company.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone"><T>Phone Number</T></Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfJoining"><T>Date of Joining</T> *</Label>
                                <Input required id="dateOfJoining" name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="border-t border-dashed my-4"></div>

                        {/* Professional Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="designation"><T>Designation</T> *</Label>
                                <Input required id="designation" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Senior Accountant" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department"><T>Department</T></Label>
                                <Input id="department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Finance" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary"><T>Salary (CTC)</T></Label>
                                <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="border-t border-dashed my-4"></div>

                        {/* Bank Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider"><T>Bank Details</T></h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName"><T>Bank Name</T></Label>
                                    <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNo"><T>Account Number</T></Label>
                                    <Input id="accountNo" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="XXXXXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifsc"><T>IFSC Code</T></Label>
                                    <Input id="ifsc" name="ifsc" value={formData.ifsc} onChange={handleChange} className="uppercase" placeholder="HDFC0001234" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="bg-[#001f3f] hover:bg-[#003366] text-white min-w-[150px]">
                                {loading ? <span className="animate-spin mr-2">⏳</span> : <Save className="mr-2 h-4 w-4" />}
                                <T>Save Employee</T>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
