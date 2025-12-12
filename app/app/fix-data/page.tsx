"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Download, FileCode, Upload } from "lucide-react"

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
      
      // 1. Encontrar o Base64
      const regex = /atob\('([^']+)'\)/
      const match = text.match(regex)

      if (!match || !match[1]) {
        throw new Error("Não foi possível encontrar o código Base64 no arquivo HTML.")
      }

      setMessage("Decodificando dados...")
      
      // 2. Decodificar
      const binaryString = atob(match[1])
      const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0))
      const decoder = new TextDecoder('latin1')
      let jsonString = decoder.decode(bytes)
      
      try {
        jsonString = decodeURIComponent(escape(window.atob(match[1])))
      } catch (e) {
        // Fallback
      }

      const data = JSON.parse(jsonString)

      if (!Array.isArray(data)) throw new Error("O JSON extraído não é um array válido.")

      // 3. Processar Incisos e Limpar
      let totalItems = 0
      data.forEach((cat: any) => {
        if (Array.isArray(cat.infracoes)) {
            totalItems += cat.infracoes.length;
            cat.infracoes.forEach((inf: any) => {
                // Lógica de extração de incisos
                const incisoRegex = /^([IVX]+)\s*-\s*/i;
                let inciso = null;
                const matchResumo = (inf.resumo || '').match(incisoRegex);
                if (matchResumo) inciso = matchResumo[1];
                
                if (!inciso) {
                    const matchDesc = (inf.descricao_completa || '').match(incisoRegex);
                    if (matchDesc) inciso = matchDesc[1];
                }

                if (inciso && inf.fundamento_legal && !inf.fundamento_legal.includes(inciso)) {
                    const base = inf.fundamento_legal.trim();
                    if (!base.endsWith(',')) {
                        inf.fundamento_legal = `${base}, ${inciso}`;
                    } else {
                        inf.fundamento_legal = `${base} ${inciso}`;
                    }
                }
            });
        }
      })

      setStats({ categories: data.length, items: totalItems })

      // 4. Gerar o conteúdo do arquivo TypeScript
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

// Função para detectar tipo de multa
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

// Dados das infrações extraídos automaticamente
const rawData: InfracaoBloco[] = ${JSON.stringify(data, null, 2)}

// Normalizar dados com tipo computado
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
      setMessage("Sucesso! O arquivo foi gerado e está pronto para download.")

    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setMessage(err.message || "Erro desconhecido ao processar o arquivo.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-6 h-6" />
            Ferramenta de Correção de Dados (v2)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Como usar:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Faça upload do arquivo <strong>AIA_APP_UNIFICADO_v3.html</strong>.</li>
              <li>O sistema extrairá as 102 infrações e corrigirá os incisos.</li>
              <li>Baixe o arquivo gerado (<strong>infracoes-data.ts</strong>).</li>
              <li>Substitua o arquivo original na pasta <code>lib/</code>.</li>
            </ol>
          </div>

          <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-10 hover:bg-gray-50 transition">
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="text-center">
              <label htmlFor="file-upload" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition">
                Selecionar Arquivo HTML
              </label>
              <input id="file-upload" type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-green-100 text-green-800 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-bold">Dados extraídos com sucesso!</p>
                  <p className="text-sm">Encontradas {stats.items} infrações em {stats.categories} categorias.</p>
                </div>
              </div>

              {downloadUrl && (
                <a 
                  href={downloadUrl} 
                  download="infracoes-data.ts"
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Baixar Arquivo Corrigido
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
