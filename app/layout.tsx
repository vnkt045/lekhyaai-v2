import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "LekhyaAI - GST Accounting & Compliance",
    description: "AI-powered GST accounting and compliance platform for Indian SMEs",
    keywords: ["GST", "Accounting", "India", "Invoice", "Compliance", "GSTR"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
