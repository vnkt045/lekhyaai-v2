import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GSTIN lookup - first checks local DB, then external API
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { tenantId: true }
        });

        if (!user?.tenantId) {
            return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const gstin = searchParams.get("gstin");

        if (!gstin || gstin.length !== 15) {
            return NextResponse.json({ error: "Invalid GSTIN. Must be 15 characters." }, { status: 400 });
        }

        // State code mapping from first 2 digits of GSTIN
        const stateMap: Record<string, string> = {
            "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
            "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana",
            "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
            "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
            "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
            "16": "Tripura", "17": "Meghalaya", "18": "Assam",
            "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
            "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
            "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
            "28": "Andhra Pradesh (Old)", "29": "Karnataka", "30": "Goa",
            "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu",
            "34": "Puducherry", "35": "Andaman & Nicobar", "36": "Telangana",
            "37": "Andhra Pradesh", "38": "Ladakh"
        };

        // Step 1: Check if party exists in our database
        const existingParty = await prisma.ledger.findFirst({
            where: {
                tenantId: user.tenantId,
                gstin: gstin
            },
            include: {
                group: true
            }
        });

        if (existingParty) {
            const stateCode = gstin.substring(0, 2);
            return NextResponse.json({
                source: "database",
                gstin: gstin,
                legalName: existingParty.name,
                tradeName: existingParty.alias || existingParty.name,
                address: existingParty.address || "",
                state: existingParty.state || stateMap[stateCode] || "",
                stateCode: stateCode,
                pan: existingParty.pan || gstin.substring(2, 12),
                partyType: existingParty.group?.name || "Sundry Debtors",
                ledgerId: existingParty.id,
                existsInDB: true
            });
        }

        // Step 2: Derive details from GSTIN structure
        // GSTIN Format: 2-digit state + 10-digit PAN + 1-digit entity + 1-digit Z + 1-digit check
        const stateCode = gstin.substring(0, 2);
        const pan = gstin.substring(2, 12);
        const stateName = stateMap[stateCode] || "Unknown";

        // PAN 4th character tells entity type
        const entityTypeMap: Record<string, string> = {
            "C": "Company", "P": "Individual", "H": "HUF",
            "F": "Firm", "A": "AOP/BOI", "T": "Trust",
            "B": "BOI", "L": "Local Authority", "J": "Artificial Juridical Person",
            "G": "Government"
        };
        const entityType = entityTypeMap[pan.charAt(3)] || "Business";

        // Step 3: Try external API (GST Search Portal - free)
        let externalData = null;
        try {
            const apiResponse = await fetch(
                `https://sheet.best/api/sheets/gstin-search?gstin=${gstin}`,
                { signal: AbortSignal.timeout(3000) }
            );
            if (apiResponse.ok) {
                externalData = await apiResponse.json();
            }
        } catch {
            // External API failed, use derived data
        }

        return NextResponse.json({
            source: "derived",
            gstin: gstin,
            legalName: externalData?.legalName || "",
            tradeName: externalData?.tradeName || "",
            address: externalData?.address || "",
            state: stateName,
            stateCode: stateCode,
            pan: pan,
            entityType: entityType,
            existsInDB: false
        });

    } catch (error) {
        console.error("GSTIN lookup error:", error);
        return NextResponse.json({ error: "Failed to lookup GSTIN" }, { status: 500 });
    }
}
