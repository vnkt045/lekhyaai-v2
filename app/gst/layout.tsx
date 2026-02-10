import { POSLayout } from "@/components/layout/pos-layout";

export default function GSTLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <POSLayout>{children}</POSLayout>;
}
