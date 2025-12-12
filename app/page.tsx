"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { CalculadoraTab } from "@/components/calculadora-tab"
import { InfracoesTab } from "@/components/infracoes-tab"
import type { Infracao } from "@/lib/infracoes-data"

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
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight">SEMA/AP — AIA Eletrônico</h1>
          </div>
          <p className="text-xs opacity-90">Calculadora de Multas Ambientais v2.4</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {activeTab === "infracoes" && <InfracoesTab onSelectInfracao={handleSelectInfracao} />}
        {activeTab === "calculadora" && (
          <CalculadoraTab selectedInfracao={selectedInfracao} onClearSelection={() => setSelectedInfracao(null)} />
        )}
      </div>

      {/* Bottom Navigation - Swap tab order */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
