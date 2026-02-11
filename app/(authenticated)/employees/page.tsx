"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, User, Briefcase, Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/ui/translate";
import { format } from "date-fns";

interface Employee {
    id: string;
    name: string;
    designation: string;
    department: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    dateOfJoining: string;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/employees");
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase()) ||
        (e.department && e.department.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#001f3f]">
                        <T>Employees</T>
                    </h1>
                    <p className="text-muted-foreground">
                        <T>Manage your organization's workforce</T>
                    </p>
                </div>
                <Button asChild className="bg-[#FF851B] hover:bg-[#FF851B]/90 text-white">
                    <Link href="/employees/new">
                        <Plus className="mr-2 h-4 w-4" />
                        <T>Add Employee</T>
                    </Link>
                </Button>
            </div>

            <Card className="border-t-4 border-t-[#FF851B]">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[#001f3f]"><T>Employee List</T></CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF851B]"></div>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <User className="mx-auto h-12 w-12 opacity-20 mb-3" />
                            <p><T>No employees found</T></p>
                            {search && <p className="text-sm"><T>Try adjusting your search</T></p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEmployees.map((employee) => (
                                <Card key={employee.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-[#001f3f]">
                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold border border-blue-100">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#001f3f]">{employee.name}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        {employee.designation}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            {employee.department && (
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-gray-400" />
                                                    <span>{employee.department}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>Joined {format(new Date(employee.dateOfJoining), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
