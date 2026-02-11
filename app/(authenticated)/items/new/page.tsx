"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { T } from "@/components/ui/translate";

export default function NewItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        hsnCode: "",
        unit: "NOS",
        gstRate: "18",
        sellingPrice: "",
        purchasePrice: "",
        openingStock: "0",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/items");
            } else {
                alert("Failed to create item");
            }
        } catch (error) {
            console.error("Error creating item:", error);
            alert("Error creating item");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/items">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900"><T>New Item</T></h1>
                        <p className="text-gray-600 mt-1"><T>Add a new product or service</T></p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle><T>Item Details</T></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Item Name & HSN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    <T>Item Name</T> <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter item name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hsnCode"><T>HSN/SAC Code</T></Label>
                                <Input
                                    id="hsnCode"
                                    value={formData.hsnCode}
                                    onChange={(e) => handleChange("hsnCode", e.target.value)}
                                    placeholder="e.g., 8471"
                                />
                            </div>
                        </div>

                        {/* Unit & GST Rate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="unit"><T>Unit</T></Label>
                                <Select
                                    value={formData.unit}
                                    onValueChange={(value) => handleChange("unit", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NOS">NOS (Numbers)</SelectItem>
                                        <SelectItem value="KG">KG (Kilograms)</SelectItem>
                                        <SelectItem value="LTR">LTR (Liters)</SelectItem>
                                        <SelectItem value="MTR">MTR (Meters)</SelectItem>
                                        <SelectItem value="BOX">BOX</SelectItem>
                                        <SelectItem value="PCS">PCS (Pieces)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gstRate"><T>GST Rate (%)</T></Label>
                                <Select
                                    value={formData.gstRate}
                                    onValueChange={(value) => handleChange("gstRate", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">0%</SelectItem>
                                        <SelectItem value="5">5%</SelectItem>
                                        <SelectItem value="12">12%</SelectItem>
                                        <SelectItem value="18">18%</SelectItem>
                                        <SelectItem value="28">28%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="sellingPrice"><T>Selling Price</T></Label>
                                <Input
                                    id="sellingPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.sellingPrice}
                                    onChange={(e) => handleChange("sellingPrice", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice"><T>Purchase Price</T></Label>
                                <Input
                                    id="purchasePrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.purchasePrice}
                                    onChange={(e) => handleChange("purchasePrice", e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="openingStock"><T>Opening Stock</T></Label>
                                <Input
                                    id="openingStock"
                                    type="number"
                                    step="0.01"
                                    value={formData.openingStock}
                                    onChange={(e) => handleChange("openingStock", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description"><T>Description</T></Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Enter item description (optional)"
                                rows={3}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/items">
                                <Button type="button" variant="outline">
                                    <T>Cancel</T>
                                </Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="gap-2">
                                <Save className="w-5 h-5" />
                                {loading ? <T>Saving...</T> : <T>Save Item</T>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
