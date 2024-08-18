import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header/Header";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  // title: {
  //   default: siteConfig.name,
  //   template: `%s - ${siteConfig.name}`,
  // },
  title: "Cool Site",
  // metadataBase: new URL(siteConfig.url),
  // description: siteConfig.description,
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased w-full",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <Header />
          <main className="min-w-full flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
