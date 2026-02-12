const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedHSN() {
    console.log('📦 Starting HSN Code seed...');

    try {
        const dataPath = path.join(__dirname, 'hsn-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const hsnCodes = JSON.parse(rawData);

        console.log(`🔍 Found ${hsnCodes.length} HSN codes to import.`);

        for (const hsn of hsnCodes) {
            // Find existing record manually to avoid upsert null issues
            const existing = await prisma.hSNCode.findFirst({
                where: {
                    code: hsn.code,
                    tenantId: null
                }
            });

            // Calculate level
            const level = hsn.code.length;

            if (existing) {
                // Update
                process.stdout.write('.');
                await prisma.hSNCode.update({
                    where: { id: existing.id },
                    data: { ...hsn, level }
                });
            } else {
                // Create
                process.stdout.write('+');
                await prisma.hSNCode.create({
                    data: {
                        ...hsn,
                        level,
                        tenantId: null,
                        isGlobal: true
                    }
                });
            }
        }

        console.log('\n✅ HSN Codes seeded successfully!');
    } catch (error) {
        console.error('\n❌ Error seeding HSN codes:', error);
        throw error;
    }
}

if (require.main === module) {
    seedHSN()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = seedHSN;
