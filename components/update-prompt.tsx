"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function UpdatePrompt() {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Quando o SW encontra uma atualização
      window.addEventListener("sw-update-found", (event: any) => {
        const newWorker = event.detail
        setWaitingWorker(newWorker)
        setShowReload(true)
      })
      
      // Verifica se já tem um worker esperando ao carregar
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          setWaitingWorker(reg.waiting)
          setShowReload(true)
        }
      })
    }
  }, [])

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    }
    window.location.reload()
  }

  if (!showReload) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center justify-between gap-4">
        <div className="text-sm font-medium">
          Nova versão disponível!
        </div>
        <Button 
          onClick={reloadPage} 
          variant="secondary" 
          size="sm" 
          className="gap-2 whitespace-nowrap"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>
    </div>
  )
}
