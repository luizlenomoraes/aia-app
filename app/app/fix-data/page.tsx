"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Download, FileCode, Upload, Search } from "lucide-react"

export default function FixDataPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [stats, setStats] = useState({ categories: 0, items: 0 })
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus("processing")
    setMessage("Lendo arquivo...")

    try {
      const text = await file.text()
      let bestData: any[] = []
      let maxCount = 0

      // ESTRATÉGIA 1: Procurar JSON direto (EMBEDDED_DATA = [...])
      const regexJson = /EMBEDDED_DATA\s*=\s*(\[[\s\S]*?\])\s*;/
      const matchJson = text.match(regexJson)
      
      if (matchJson && matchJson[1]) {
        try {
          const cleanJson = matchJson[1].replace(/,\s*]/, "]") 
          const data = JSON.parse(cleanJson)
          const count = countInfracoes(data)
          console.log(`Estratégia 1 (JSON direto): ${count} infrações`)
          
          if (count > maxCount) {
            maxCount = count
            bestData = data
          }
        } catch (e) {
          console.warn("Falha ao parsear JSON direto", e)
        }
      }

      // ESTRATÉGIA 2: Procurar Base64 (atob) - DEEP SCAN
      const regexB64 = /atob\s*\(\s*'([^']+)'\s*\)/g
      let matchB64
      while ((matchB64 = regexB64.exec(text)) !== null) {
        try {
          const b64 = matchB64[1]
          // Ignora strings muito curtas que não sejam dados
          if (b64.length < 1000) continue;

          const binaryString = atob(b64)
          let jsonString
          try {
             jsonString = decodeURIComponent(escape(binaryString))
          } catch {
             const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0))
             const decoder = new TextDecoder('latin1')
             jsonString = decoder.decode(bytes)
          }

          const data = JSON.parse(jsonString)
          if (Array.isArray(data)) {
            const count = countInfracoes(data)
            console.log(`Estratégia 2 (Base64): ${count} infrações`)
            
            // Prioriza o maior conjunto de dados encontrado
            if (count > maxCount) {
              maxCount = count
              bestData = data
            }
          }
        } catch (e) {
          // Ignora erros de parse em strings que não são JSON
        }
      }

      if (maxCount === 0) {
        throw new Error("Nenhuma infração válida encontrada no arquivo. Verifique se é o HTML correto.")
      }

      // PÓS-PROCESSAMENTO: Correção de Incisos
      bestData.forEach((cat: any) => {
        if (Array.isArray(cat.infracoes)) {
          cat.infracoes.forEach((inf: any) => {
            const incisoRegex = /^([IVX]+)\s*-\s*/i
            let inciso = null
            
            const matchResumo = (inf.resumo || '').match(incisoRegex)
            if (matchResumo) inciso = matchResumo[1]
            
            if (!inciso) {
              const matchDesc = (inf.descricao_completa || '').match(incisoRegex)
              if (matchDesc) inciso = matchDesc[1]
            }

            if (inciso && inf.fundamento_legal) {
              if (!inf.fundamento_legal.includes(inciso)) {
                 const base = inf.fundamento_legal.trim()
                 if (base.endsWith(',')) {
                    inf.fundamento_legal = `${base} ${inciso}`
                 } else {
                    inf.fundamento_legal = `${base}, ${inciso}`
                 }
              }
            }
          })
        }
      })

      setStats({ categories: bestData.length, items: maxCount })

      // Geração do Arquivo TS
      const tsContent = `
export interface Infracao {
  resumo: string
  descricao_completa: string
  fundamento_legal: string
  natureza_multa?: string
  valor_minimo?: number
  valor_maximo?: number
  valor_por_unidade?: number | null
  unidade_de_medida?: string | null
  criterios_aplicacao?: string
  observacoes?: string
  _categoria?: string
  _tipo_multa_computado?: "aberta" | "fechada"
}

interface InfracaoBloco {
  tipo_infracao: string
  infracoes: Infracao[]
}

function detectTipoMulta(item: Infracao): "aberta" | "fechada" {
  try {
    const txt = \`\${item.descricao_completa || ""} \${item.resumo || ""} \${item.fundamento_legal || ""}\`.replace(
      /\\s+/g,
      " ",
    )

    const hasRangeText = /R\\$\\s*\\d{1,3}(\\.\\d{3})*,\\d{2}\\s*(?:a|até)\\s*R\\$\\s*\\d{1,3}(\\.\\d{3})*,\\d{2}/i.test(txt)
    const vmin = (item.valor_minimo || "").toString().trim()
    const vmax = (item.valor_maximo || "").toString().trim()
    const hasIntervalFields = vmin && vmax && vmin !== vmax
    const hasUnitFields = !!item.valor_por_unidade || !!item.unidade_de_medida
    const natureField = (item.natureza_multa || "").toString().toLowerCase()

    if (hasRangeText || hasIntervalFields) return "aberta"
    if (hasUnitFields) return "fechada"
    if (natureField === "aberta" || natureField === "fechada") return natureField as "aberta" | "fechada"

    const unitHints =
      /(por\\s+(quilo|kg|hectare|árvore|árvores|unidade|indivíduo|exemplar|m³|metro\\s*cúbico|m2|m²|m3|litro|litros|peça|peças|fração))/i
    if (unitHints.test(txt)) return "fechada"

    return "aberta"
  } catch {
    return "aberta"
  }
}

const rawData: InfracaoBloco[] = ${JSON.stringify(bestData, null, 2)}

export const infracoesData: InfracaoBloco[] = rawData.map((bloco) => ({
  ...bloco,
  infracoes: bloco.infracoes.map((inf) => ({
    ...inf,
    _categoria: bloco.tipo_infracao,
    _tipo_multa_computado: detectTipoMulta(inf),
  })),
}))
`

      const blob = new Blob([tsContent], { type: "text/typescript" })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      
      setStatus("success")
      setMessage(`Sucesso! ${maxCount} infrações encontradas e corrigidas.`)

    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setMessage(err.message || "Erro desconhecido.")
    }
  }

  const countInfracoes = (data: any[]) => {
    let total = 0
    data.forEach((cat) => {
      if (Array.isArray(cat.infracoes)) total += cat.infracoes.length
    })
    return total
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            Extrator de Dados (v3 - Deep Scan)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-900">
            <p className="font-bold mb-2">Instruções:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Faça o upload do arquivo <strong>AIA_APP_UNIFICADO_v3.html</strong>.</li>
              <li>O sistema buscará todas as infrações (incluindo as ocultas).</li>
              <li>Baixe o arquivo <strong>infracoes-data.ts</strong>.</li>
              <li>Substitua o arquivo na pasta <code>lib/</code>.</li>
            </ol>
          </div>

          <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-100 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".html,.htm" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
            />
            <Upload className="w-10 h-10 text-gray-400" />
            <div className="text-center">
              <span className="text-primary font-medium">Clique para selecionar</span>
              <p className="text-xs text-gray-500 mt-1">AIA_APP_UNIFICADO_v3.html</p>
            </div>
          </div>

          {status === "processing" && (
            <div className="text-center py-2 text-gray-600 animate-pulse">Analisando código fonte...</div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 bg-green-100 text-green-900 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">{stats.items} Infrações!</p>
                  <p className="text-xs text-green-700">Extração profunda concluída com sucesso.</p>
                </div>
              </div>

              {downloadUrl && (
                <a 
                  href={downloadUrl} 
                  download="infracoes-data.ts"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Baixar Dados Corrigidos
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
