const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, '..', 'prisma');
const schemaPath = path.join(prismaDir, 'schema.prisma');
const postgresSchemaPath = path.join(prismaDir, 'schema.postgres.prisma');

console.log('🔄 Preparing Prisma Schema for Vercel Deployment...');

if (fs.existsSync(postgresSchemaPath)) {
    // Backup existing schema (optional, mostly for safety)
    if (fs.existsSync(schemaPath)) {
        fs.copyFileSync(schemaPath, path.join(prismaDir, 'schema.sqlite.backup'));
    }

    // Overwrite schema.prisma with schema.postgres.prisma
    fs.copyFileSync(postgresSchemaPath, schemaPath);
    console.log('✅ Successfully swapped to PostgreSQL schema.');
} else {
    console.error('❌ Error: prisma/schema.postgres.prisma not found!');
    process.exit(1);
}
