import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { companyName, gstin, name, email, password } = await req.json();

        // Basic validation
        if (!companyName || !gstin || !name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 }
            );
        }

        // Check if tenant exists (by GSTIN)
        const existingTenant = await prisma.tenant.findUnique({
            where: { gstin },
        });

        if (existingTenant) {
            return NextResponse.json(
                { error: "Company already registered with this GSTIN" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create Tenant and User
        const result = await prisma.$transaction(async (tx) => {
            // Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    companyName,
                    gstin,
                    pan: gstin.substring(2, 12), // Extract PAN from GSTIN roughly
                    state: "Unknown", // Placeholder, can extract from GSTIN first 2 digits
                    address: "To be updated",
                    email,
                    phone: "",
                    financialYear: "2024-25",
                    turnover: "Unknown",
                    gstRegType: "Regular",
                },
            });

            // Create Admin User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "admin",
                    tenantId: tenant.id,
                },
            });

            // Create Default Groups for Accounting
            // (We could verify seed data here or assume it's run)
            // But ideally we should copy standard groups for this tenant.
            // For now, let's keep it simple.

            return { tenant, user };
        });

        return NextResponse.json(
            { message: "Registration successful", tenantId: result.tenant.id },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
