"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { CalculadoraTab } from "@/components/calculadora-tab"
import { InfracoesTab } from "@/components/infracoes-tab"
import type { Infracao } from "@/lib/infracoes-data"
import Image from "next/image"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"infracoes" | "calculadora">("infracoes")
  const [selectedInfracao, setSelectedInfracao] = useState<Infracao | null>(null)

  const handleSelectInfracao = (infracao: Infracao) => {
    setSelectedInfracao(infracao)
    setActiveTab("calculadora")
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Image src="/logo-sema-ap.png" alt="SEMA-AP" width={40} height={40} className="rounded-lg" />
            <h1 className="text-lg font-bold tracking-tight">SEMA/AP — AIA Eletrônico</h1>
          </div>
          <p className="text-xs opacity-90">Calculadora de Multas Ambientais</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {activeTab === "infracoes" && <InfracoesTab onSelectInfracao={handleSelectInfracao} />}
        {activeTab === "calculadora" && (
          <CalculadoraTab selectedInfracao={selectedInfracao} onClearSelection={() => setSelectedInfracao(null)} />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
