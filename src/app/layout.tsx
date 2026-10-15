import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { DemoProvider } from "@/lib/demo-context";
import { AppShell } from "@/components/layout/app-shell";
import { BRAND } from "@/lib/mock-data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} · ${BRAND.tagline}`,
  description:
    "Beginner yoga classes for men in village halls across Surrey, Hampshire and south-east London. Concept demo by AccellionX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${jakarta.variable} font-sans`}>
        <DemoProvider>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" richColors closeButton />
        </DemoProvider>
      </body>
    </html>
  );
}
