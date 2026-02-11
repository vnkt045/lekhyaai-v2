
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchHSN } from "@/lib/hsn-data";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return Response.json([]);
    }

    try {
        // 1. Search Global Data
        const globalResults = searchHSN(query);

        // 2. Search Tenant Data
        const tenantResults = await prisma.hSNCode.findMany({
            where: {
                tenantId: session.user.tenantId,
                OR: [
                    { code: { contains: query } },
                    { description: { contains: query } }
                ]
            },
            take: 10
        });

        // 3. Merge Results (Tenant overrides Global if same code)
        const resultMap = new Map<string, any>();

        globalResults.forEach(item => resultMap.set(item.code, { ...item, type: "global" }));
        tenantResults.forEach(item => resultMap.set(item.code, { ...item, gstRate: Number(item.gstRate), type: "tenant" }));

        const results = Array.from(resultMap.values());

        return Response.json(results);
    } catch (error) {
        console.error("HSN Search Error:", error);
        return Response.json({ error: "Failed to search HSN" }, { status: 500 });
    }
}
