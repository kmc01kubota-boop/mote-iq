import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://mote-iq.com"),
  title: {
    default: "モテIQ診断｜モテ度を5因子で数値化する25問無料テスト",
    template: "%s｜モテIQ",
  },
  description:
    "清潔感・会話力・金の使い方・距離感・色気の5因子でモテ力を徹底分析。残酷なまでに客観的な恋愛偏差値が出る無料診断。",
  keywords: [
    "モテ度診断",
    "恋愛偏差値",
    "客観的評価",
    "婚活 診断",
    "モテる方法",
    "モテIQ",
  ],
  openGraph: {
    type: "website",
    siteName: "モテIQ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://mote-iq.com",
  },
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
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
