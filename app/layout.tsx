import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UpdatePrompt } from "@/components/update-prompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIA Ambiental",
  description: "Aplicativo de Auto de Infração Ambiental - SEMA/AP",
  manifest: "/manifest.json",
    generator: 'v0.app'
};

export const viewport = {
  themeColor: "#2a9d8f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <UpdatePrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
