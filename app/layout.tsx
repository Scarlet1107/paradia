// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Paradia - すべてがポジティブに包まれたSNS",
  description:
    "Paradiaは、市民が安心して前向きな思いを共有できる、秩序と調和のもとに運営される新時代のSNS",
  openGraph: {
    title: "Paradia - すべてがポジティブに包まれたSNS",
    description:
      "Paradiaは、市民が安心して前向きな思いを共有できる、秩序と調和のもとに運営される新時代のSNS",
    url: defaultUrl,
    siteName: "Paradia",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: `${defaultUrl}/open_graph.png`,
        width: 1200,
        height: 630,
        alt: "Paradiaのバナー画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paradia - すべてがポジティブに包まれたSNS",
    description:
      "Paradiaは、市民が安心して前向きな思いを共有できる、秩序と調和のもとに運営される新時代のSNS",
    images: ["/header.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/icons/192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="/icons/512x512.png"
          sizes="512x512"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.className} flex min-h-screen flex-col items-center antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
