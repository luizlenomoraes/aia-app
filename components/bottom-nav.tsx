"use client"

import { Calculator, Search } from "lucide-react"

interface BottomNavProps {
  activeTab: "infracoes" | "calculadora"
  onTabChange: (tab: "infracoes" | "calculadora") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => onTabChange("infracoes")}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
            activeTab === "infracoes" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs font-medium">Infrações</span>
        </button>
        <button
          onClick={() => onTabChange("calculadora")}
          className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
            activeTab === "calculadora" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span className="text-xs font-medium">Calculadora</span>
        </button>
      </div>
    </nav>
  )
}
