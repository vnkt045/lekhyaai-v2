import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format number as Indian currency (₹)
 */
export function formatCurrency(amount: number | string): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format number in Indian numbering system (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
    return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Validate GSTIN format
 */
export function validateGSTIN(gstin: string): boolean {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
}

/**
 * Validate PAN format
 */
export function validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
}

/**
 * Extract state code from GSTIN
 */
export function getStateFromGSTIN(gstin: string): string {
    if (!validateGSTIN(gstin)) return "";
    return gstin.substring(0, 2);
}

/**
 * Determine supply type based on state codes
 */
export function getSupplyType(sellerState: string, buyerState: string): "Intrastate" | "Interstate" {
    return sellerState === buyerState ? "Intrastate" : "Interstate";
}

/**
 * Calculate GST amounts
 */
export function calculateGST(
    amount: number,
    gstRate: number,
    supplyType: "Intrastate" | "Interstate"
): {
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
} {
    const gstAmount = (amount * gstRate) / 100;

    if (supplyType === "Intrastate") {
        return {
            cgst: gstAmount / 2,
            sgst: gstAmount / 2,
            igst: 0,
            total: amount + gstAmount,
        };
    } else {
        return {
            cgst: 0,
            sgst: 0,
            igst: gstAmount,
            total: amount + gstAmount,
        };
    }
}

/**
 * Round to 2 decimal places
 */
export function roundTo2Decimals(num: number): number {
    return Math.round(num * 100) / 100;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

/**
 * Get financial year from date
 */
export function getFinancialYear(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed

    if (month >= 4) {
        return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
        return `${year - 1}-${year.toString().slice(-2)}`;
    }
}

/**
 * Get GST period (month-year format)
 */
export function getGSTPeriod(date: Date = new Date()): string {
    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
    }).format(date);
}
