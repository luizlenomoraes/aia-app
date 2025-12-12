"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function UpdatePrompt() {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    // Verifica se está no navegador e se tem suporte a SW
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      
      // 1. Registrar o Service Worker AQUI (movido do layout.tsx)
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.log("SW registrado com escopo:", registration.scope)

        // Se já houver um worker esperando (atualização baixada em background)
        if (registration.waiting) {
          setWaitingWorker(registration.waiting)
          setShowReload(true)
        }

        // Monitorar novas atualizações encontradas durante o uso
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              // Se o novo worker foi instalado mas ainda não é o controlador (tem um antigo ativo)
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setShowReload(true)
              }
            })
          }
        })
      }).catch(err => console.error("Erro ao registrar SW:", err))

      // 2. Verificar atualizações periodicamente (a cada hora)
      const interval = setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => reg?.update())
      }, 60 * 60 * 1000)

      // 3. Recarregar a página automaticamente quando o novo SW assumir o controle
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          window.location.reload()
          refreshing = true
        }
      })

      return () => clearInterval(interval)
    }
  }, [])

  const reloadPage = () => {
    if (waitingWorker) {
      // Manda o worker esperando assumir o controle imediatamente
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    } else {
      window.location.reload()
    }
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
