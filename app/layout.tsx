import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Substituindo Geist por Inter para compatibilidade com Next.js 14
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIA Ambiental",
  description: "Aplicativo de Auto de Infração Ambiental - SEMA/AP",
  manifest: "/manifest.json",
    generator: 'v0.app'
};

// Configuração correta de viewport para PWA
export const viewport = {
  themeColor: "#2a9d8f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
