import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactRound, Settings, ReceiptText } from "lucide-react";
import ActiveLink from "@/components/ui/ActiveLink";

export const metadata: Metadata = {
  title: "Cool Site",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-full ">
      <header className="bg-muted py-6 px-4 md:px-6">
        <div className="container flex items-center gap-4">
          <div className="grid gap-1">
            <h1 className="text-xl font-bold">Cody Newman</h1>
            <p className="text-sm text-muted-foreground">
              Software Engineer at Acme Inc.
            </p>
          </div>
        </div>
      </header>
      <div className="container flex-1 py-8">
        <div className="grid grid-cols-[200px_1fr] gap-8">
          <nav className="space-y-1">
            <ActiveLink
              href="/profile"
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ContactRound />
              Overview
            </ActiveLink>
            <ActiveLink
              href="/profile/settings"
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              prefetch={false}
            >
              <Settings />
              Settings
            </ActiveLink>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              prefetch={false}
            >
              <ReceiptText />
              Billing
            </Link>
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}
