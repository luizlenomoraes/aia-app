"use client"

import type React from "react"
import { useEffect } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { UpdatePrompt } from "@/components/update-prompt"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Registra o SW
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("SW registrado:", registration.scope)

        // Verifica se há atualização enquanto o app está aberto
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // Dispara evento personalizado para o componente UpdatePrompt
                window.dispatchEvent(new CustomEvent("sw-update-found", { detail: newWorker }))
              }
            })
          }
        })
      }).catch(err => console.log("Erro SW:", err))

      // Verifica atualizações periodicamente (a cada hora) se o app ficar aberto
      setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => reg?.update())
      }, 60 * 60 * 1000)
    }
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo-sema-ap.png" />
        <meta name="theme-color" content="#2a9d8f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>SEMA/AP — AIA Eletrônico</title>
        <meta
          name="description"
          content="Calculadora de Multas Ambientais - Sistema de Auto de Infração Ambiental do Amapá"
        />
      </head>
      <body className="font-sans antialiased touch-manipulation">
        {children}
        <UpdatePrompt />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
