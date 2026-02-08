import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "モテIQ｜大人の魅力を数値化する25問診断",
  description:
    "5つの因子であなたのモテ力を徹底分析。清潔感・会話力・金の使い方・距離感・色気。25問で見えてくる、大人の男の現在地。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-[100dvh] flex flex-col bg-bg-primary text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
