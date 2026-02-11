
import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const worker = await createWorker('eng', 1, {
            logger: m => console.log(m)
        });
        const ret = await worker.recognize(buffer);
        await worker.terminate();

        const text = ret.data.text;

        // Simple Heuristics Extraction
        const dateMatch = text.match(/\b\d{2}[/-]\d{2}[/-]\d{4}\b/);
        const amountMatch = text.match(/Total\s*[:\-\s]*[\$₹]?\s*([\d,]+\.?\d*)/i) || text.match(/Amount\s*[:\-\s]*[\$₹]?\s*([\d,]+\.?\d*)/i);
        const invoiceNoMatch = text.match(/Invoice\s*No\.?\s*[:\-]?\s*([A-Z0-9-]+)/i);

        const extractedData = {
            date: dateMatch ? dateMatch[0] : null,
            amount: amountMatch ? amountMatch[1].replace(/,/g, '') : null,
            invoiceNo: invoiceNoMatch ? invoiceNoMatch[1] : null,
            rawText: text.substring(0, 500) // Preview
        };

        return NextResponse.json(extractedData);

    } catch (error: any) {
        console.error("OCR Error:", error);
        console.error("Error details:", error.message);
        return NextResponse.json({ error: "Failed to process image: " + error.message }, { status: 500 });
    }
}
