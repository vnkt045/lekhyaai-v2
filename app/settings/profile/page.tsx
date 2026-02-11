
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tenant: true
        }
    });

    if (!user) {
        redirect("/login");
    }

    // Sanitize user object for client (remove password)
    const { password, ...safeUser } = user;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#001f3f] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#001f3f]">Profile & Settings</h2>
            </div>
            <ProfileClient user={safeUser} tenant={user.tenant} />
        </div>
    );
}
