import axios from 'axios';

// Configuration
const GST_API_BASE_URL = process.env.GST_API_BASE_URL || 'https://api.masterindia.com';
const GST_API_KEY = process.env.GST_API_KEY;

export interface GSTINDetails {
    gstin: string;
    legalName: string;
    tradeName: string;
    status: 'Active' | 'Cancelled' | 'Suspended';
    registrationDate: string;
    address: string;
    state: string;
    pincode: string;
    businessType: string;
    taxpayerType: string;
    lastUpdated: string;
}

export class GSTAPIService {

    /**
     * Verify GSTIN and fetch business details
     */
    static async verifyGSTIN(gstin: string): Promise<GSTINDetails | null> {
        try {
            // Validate GSTIN format
            if (!this.isValidGSTIN(gstin)) {
                throw new Error('Invalid GSTIN format');
            }

            // If no API key, return mock data or throw error dependent on env
            if (!GST_API_KEY) {
                console.warn('GST_API_KEY not found. Using partial/mock data validation.');
                // For development without API key, we can return null or basic derived info if we want to support that pattern.
                // But for "Integration", let's be strict unless it's a known test GSTIN.
                if (process.env.NODE_ENV === 'development') {
                    return this.getMockGSTINDetails(gstin);
                }
                return null;
            }

            // Call API
            // Note: This endpoint path depends on the specific provider (MasterIndia in this example)
            const response = await axios.get(
                `${GST_API_BASE_URL}/gst/v1/returns/gstin/${gstin}`,
                {
                    headers: {
                        'Authorization': `Bearer ${GST_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 seconds
                }
            );

            // Parse response - Standardize based on provider response structure
            const data = response.data;

            // Adaptation for MasterIndia response structure (example)
            return {
                gstin: data.gstin,
                legalName: data.legalName,
                tradeName: data.tradeName || data.legalName,
                status: data.status,
                registrationDate: data.registrationDate,
                address: data.principalPlaceOfBusiness?.address || '',
                state: data.principalPlaceOfBusiness?.state || '',
                pincode: data.principalPlaceOfBusiness?.pincode || '',
                businessType: data.constitutionOfBusiness,
                taxpayerType: data.taxpayerType,
                lastUpdated: data.lastUpdatedDate
            };

        } catch (error: any) {
            console.error('GSTIN verification failed:', error.message);

            // Handle specific errors
            if (error.response?.status === 404) {
                throw new Error('GSTIN not found');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            return null;
        }
    }

    /**
     * Validate GSTIN format
     * Format: 22AAAAA0000A1Z5 (15 characters)
     */
    static isValidGSTIN(gstin: string): boolean {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex.test(gstin);
    }

    private static getMockGSTINDetails(gstin: string): GSTINDetails {
        // Basic derivation for dev testing without API key
        return {
            gstin,
            legalName: "Test Company Pvt Ltd",
            tradeName: "Test Company",
            status: "Active",
            registrationDate: "2024-01-01",
            address: "123 Test Street, Tech Park",
            state: "Maharashtra",
            pincode: "400001",
            businessType: "Private Limited",
            taxpayerType: "Regular",
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Fetch HSN code details with GST rate
     */
    static async getHSNDetails(hsnCode: string): Promise<any> {
        if (!GST_API_KEY) return null;
        try {
            const response = await axios.get(
                `${GST_API_BASE_URL}/gst/v1/hsn/${hsnCode}`,
                {
                    headers: {
                        'Authorization': `Bearer ${GST_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                code: response.data.hsnCode,
                description: response.data.description,
                gstRate: response.data.gstRate,
                cessRate: response.data.cessRate || 0,
                category: response.data.category
            };

        } catch (error) {
            console.error('HSN lookup failed:', error);
            return null;
        }
    }
}
