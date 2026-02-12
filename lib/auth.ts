import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

                if (parsed.success) {
                    const { email, password } = parsed.data;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.tenantId = (user as any).tenantId;
                token.role = (user as any).role;
                token.permissions = (user as any).permissions; // Include permissions

                // Fetch tenant data to include in session
                const tenant = await prisma.tenant.findUnique({
                    where: { id: (user as any).tenantId },
                    select: {
                        id: true,
                        companyName: true,
                        gstin: true,
                        email: true,
                        phone: true,
                    },
                });
                token.tenant = tenant;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as any).tenantId = token.tenantId as string;
                (session.user as any).role = token.role as string;
                (session.user as any).permissions = token.permissions; // Include permissions
                (session.user as any).tenant = token.tenant;
            }
            return session;
        },
    },
});
