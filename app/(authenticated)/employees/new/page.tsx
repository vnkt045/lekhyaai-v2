"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    const [salaryStructure, setSalaryStructure] = useState({
        basic: "",
        hra: "",
        special: "",
        pf: "",
        pt: "200"
    });

    // Auto-calculate Total CTC when structure changes
    React.useEffect(() => {
        const basic = parseFloat(salaryStructure.basic) || 0;
        const hra = parseFloat(salaryStructure.hra) || 0;
        const special = parseFloat(salaryStructure.special) || 0;
        // Total Earnings = Basic + HRA + Special
        // Note: PF/PT are deductions, but CTC usually includes Employer PF. 
        // For simplicity, let's say "Salary" here matches Total Earnings (Gross).
        const total = basic + hra + special;
        setFormData(prev => ({ ...prev, salary: total > 0 ? total.toString() : "" }));
    }, [salaryStructure]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStructureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSalaryStructure({ ...salaryStructure, [e.target.name]: e.target.value });
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
                },
                salaryStructure: {
                    basic: parseFloat(salaryStructure.basic) || 0,
                    hra: parseFloat(salaryStructure.hra) || 0,
                    special: parseFloat(salaryStructure.special) || 0,
                    pf: parseFloat(salaryStructure.pf) || 0,
                    pt: parseFloat(salaryStructure.pt) || 0
                }
            };

            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push("/employees");
                router.refresh();
            } else {
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
                <div className="flex items-center gap-4">
                    <Link href="/employees">
                        <Button variant="ghost">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            <T>Back</T>
                        </Button>
                    </Link>
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
                                    <Input suppressHydrationWarning required id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Kumar" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email"><T>Email Address</T></Label>
                                    <Input suppressHydrationWarning id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="rahul@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone"><T>Phone Number</T></Label>
                                    <Input suppressHydrationWarning id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfJoining"><T>Date of Joining</T> *</Label>
                                    <Input suppressHydrationWarning required id="dateOfJoining" name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="border-t border-dashed my-4"></div>

                            {/* Professional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="designation"><T>Designation</T> *</Label>
                                    <Select
                                        value={formData.designation}
                                        onValueChange={(value: string) => setFormData({ ...formData, designation: value })}
                                    >
                                        <SelectTrigger id="designation">
                                            <SelectValue placeholder="Select Designation" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Accountant">Accountant</SelectItem>
                                            <SelectItem value="CA">CA (Chartered Accountant)</SelectItem>
                                            <SelectItem value="Clerk">Clerk</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department"><T>Department</T></Label>
                                    <Input suppressHydrationWarning id="department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Finance" />
                                </div>
                            </div>

                            {/* Salary Structure */}
                            <div className="space-y-4 pt-2">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider"><T>Salary Structure (Monthly)</T></h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md border">
                                    <div className="space-y-2">
                                        <Label htmlFor="basic"><T>Basic Salary</T></Label>
                                        <Input suppressHydrationWarning id="basic" name="basic" type="number" value={salaryStructure.basic} onChange={handleStructureChange} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hra"><T>HRA</T></Label>
                                        <Input suppressHydrationWarning id="hra" name="hra" type="number" value={salaryStructure.hra} onChange={handleStructureChange} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="special"><T>Special Allowance</T></Label>
                                        <Input suppressHydrationWarning id="special" name="special" type="number" value={salaryStructure.special} onChange={handleStructureChange} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pf"><T>PF (Deduction)</T></Label>
                                        <Input suppressHydrationWarning id="pf" name="pf" type="number" value={salaryStructure.pf} onChange={handleStructureChange} placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pt"><T>Prof. Tax (Deduction)</T></Label>
                                        <Input suppressHydrationWarning id="pt" name="pt" type="number" value={salaryStructure.pt} onChange={handleStructureChange} placeholder="200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary" className="text-[#001f3f] font-bold"><T>Total Gross Salary</T></Label>
                                        <Input suppressHydrationWarning id="salary" name="salary" type="number" value={formData.salary} readOnly className="font-bold bg-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-dashed my-4"></div>

                            {/* Bank Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider"><T>Bank Details</T></h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bankName"><T>Bank Name</T></Label>
                                        <Input suppressHydrationWarning id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="accountNo"><T>Account Number</T></Label>
                                        <Input suppressHydrationWarning id="accountNo" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="XXXXXXXXXX" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ifsc"><T>IFSC Code</T></Label>
                                        <Input suppressHydrationWarning id="ifsc" name="ifsc" value={formData.ifsc} onChange={handleChange} className="uppercase" placeholder="HDFC0001234" />
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
        </div>
    );
}
