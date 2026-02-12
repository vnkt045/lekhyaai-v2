const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create default tenant
    const tenant = await prisma.tenant.upsert({
        where: { gstin: '27AAAAA0000A1Z5' },
        update: {},
        create: {
            companyName: 'Admin Company',
            gstin: '27AAAAA0000A1Z5',
            pan: 'AAAAA0000A',
            state: 'Maharashtra',
            address: 'Admin Address, Mumbai',
            email: 'admin@admin.com',
            phone: '9876543210',
            financialYear: '2024-25',
            turnover: 'Below 40 Lakhs',
            gstRegType: 'Regular',
        },
    });

    console.log('✅ Created tenant:', tenant.companyName);

    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'admin@admin.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'admin',
            tenantId: tenant.id,
            language: 'en',
        },
    });

    console.log('✅ Created admin user:', admin.email);
    console.log('\n📧 Login credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: test123');
    console.log('\n🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
