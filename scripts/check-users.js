
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Always ensure admin exists
        const hashedPassword = await bcrypt.hash("password123", 10);
        const adminEmail = "admin@lekhya.ai";

        // Check if tenant exists, if not create
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            tenant = await prisma.tenant.create({
                data: {
                    companyName: "Lekhya Demo",
                    gstin: "29ABCDE1234F1Z5",
                    pan: "ABCDE1234F",
                    state: "Karnataka",
                    address: "Bangalore",
                    email: adminEmail,
                    phone: "9999999999",
                    financialYear: "2024-25",
                    turnover: "Below 40 Lakhs",
                    gstRegType: "Regular"
                }
            });
            console.log("Created Default Tenant");
        }

        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

        if (existingAdmin) {
            await prisma.user.update({
                where: { email: adminEmail },
                data: { password: hashedPassword, role: 'admin' }
            });
            console.log("Updated admin password for:", adminEmail);
        } else {
            await prisma.user.create({
                data: {
                    name: "Admin User",
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin",
                    tenantId: tenant.id
                },
            });
            console.log("Created user:", adminEmail);
        }

        // List all users
        const users = await prisma.user.findMany();
        console.log("All Users:", users.map(u => ({ email: u.email, role: u.role })));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
