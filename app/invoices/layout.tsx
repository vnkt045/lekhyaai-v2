import { POSLayout } from "@/components/layout/pos-layout";

export default function InvoicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <POSLayout>{children}</POSLayout>;
}
