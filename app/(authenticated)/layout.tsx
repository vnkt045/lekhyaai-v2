import { POSLayout } from "@/components/layout/pos-layout";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <POSLayout>{children}</POSLayout>;
}
