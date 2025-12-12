import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { UpdatePrompt } from "@/components/update-prompt"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SEMA/AP — AIA Eletrônico",
  description: "Calculadora de Multas Ambientais - Sistema de Auto de Infração Ambiental do Amapá",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AIA SEMA/AP",
  },
  icons: {
    icon: "/logo-sema-ap.png",
    apple: "/logo-sema-ap.png",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2a9d8f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/logo-sema-ap.png" />
      </head>
      <body className="font-sans antialiased touch-manipulation">
        {children}
        {/* O UpdatePrompt agora cuida do registro do PWA sozinho */}
        <UpdatePrompt />
      </body>
    </html>
  )
}
