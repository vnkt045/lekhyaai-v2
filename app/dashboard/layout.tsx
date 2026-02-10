import { POSLayout } from "@/components/layout/pos-layout";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <POSLayout>{children}</POSLayout>;
}
