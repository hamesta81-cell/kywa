import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QRCodeWidget from "@/components/QRCodeWidget";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KYWA 안전문화 확산 통합 플랫폼",
  description: "청소년활동 안전홍보단, 공모전, 캠페인이 하나로 통합된 대국민 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <NextAuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <QRCodeWidget />
        </NextAuthProvider>
      </body>
    </html>
  );
}
