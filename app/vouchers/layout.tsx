import { POSLayout } from "@/components/layout/pos-layout";

export default function VouchersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <POSLayout>{children}</POSLayout>;
}
