import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            tenantId: string;
            role: string;
            tenant?: {
                id: string;
                companyName: string;
                gstin: string;
                email: string;
                phone: string;
                address?: string;
                state?: string;
            };
        } & DefaultSession["user"];
    }

    interface User {
        tenantId: string;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        tenantId: string;
        role: string;
        tenant?: {
            id: string;
            companyName: string;
            gstin: string;
            email: string;
            phone: string;
            address?: string;
            state?: string;
        };
    }
}
