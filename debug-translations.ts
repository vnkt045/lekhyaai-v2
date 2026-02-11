
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const bad = await prisma.translation.findMany({
        where: {
            translatedText: {
                contains: 'ITC'
            }
        }
    });
    console.log(JSON.stringify(bad, null, 2));
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
