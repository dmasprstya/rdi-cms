import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense, type ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rdibabel.id'),
  title: "Rosman Djohan Institute",
  description: "Solusi digital terpadu untuk manajemen sekolah. Kelola data siswa, nilai akademik, jadwal, dan analytics dengan sistem terintegrasi yang efisien dan user-friendly.",
  keywords: ["sistem sekolah", "manajemen sekolah", "platform pendidikan", "sistem akademik", "manajemen siswa", "sistem informasi sekolah"],
  authors: [{ name: "STS System Team" }],
  openGraph: {
    title: "Rosman Djohan Institute",
    description: "Solusi digital terpadu untuk manajemen sekolah. Kelola data siswa, nilai akademik, jadwal, dan analytics dengan sistem terintegrasi.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head></head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="sts-ui-theme">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
          <Toaster />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
