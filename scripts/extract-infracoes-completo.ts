import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HTML_PATH = path.join(__dirname, "../AIA_APP_UNIFICADO_v3.html")
const OUTPUT_PATH = path.join(__dirname, "../lib/infracoes-data.ts")

console.log("🔍 Lendo arquivo HTML base...")

try {
  const htmlContent = fs.readFileSync(HTML_PATH, "utf-8")

  // 1. Extrair o Base64 usando Regex (procura por atob('STRING'))
  const regex = /atob$$'([^']+)'$$/
  const match = htmlContent.match(regex)

  if (!match || !match[1]) {
    throw new Error("❌ Não foi possível encontrar a string Base64 dentro de atob() no arquivo HTML.")
  }

  const base64String = match[1]
  console.log(`✅ Base64 encontrado! Tamanho: ${base64String.length} caracteres.`)

  // 2. Decodificar Base64
  const buffer = Buffer.from(base64String, "base64")

  let data
  try {
    // Tentativa 1: UTF-8 direto
    data = JSON.parse(buffer.toString("utf-8"))
  } catch (e) {
    // Tentativa 2: Latin1 com escape/decodeURIComponent
    try {
      const raw = buffer.toString("utf-8")
      data = JSON.parse(decodeURIComponent(escape(raw)))
    } catch (e2) {
      // Fallback final: usar o dado que extraímos como string latin1
      data = JSON.parse(buffer.toString("latin1"))
    }
  }

  // 3. Validar dados
  if (!Array.isArray(data)) {
    throw new Error("❌ O JSON decodificado não é um array.")
  }

  // Contar totais
  let totalInfracoes = 0
  data.forEach((cat) => {
    if (cat.infracoes) totalInfracoes += cat.infracoes.length
  })

  console.log(`✅ Dados decodificados com sucesso!`)
  console.log(`   - Categorias: ${data.length}`)
  console.log(`   - Total de Infrações: ${totalInfracoes}`)

  if (totalInfracoes < 50) {
    console.warn("⚠️ AVISO: O número de infrações parece baixo (menos de 50). Verifique se o HTML base está completo.")
  }

  // 4. Gerar o conteúdo do arquivo TypeScript
  const tsContent = `export interface Infracao {
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

    // 1) Padrão textual "R$ X a R$ Y" => intervalo => aberta
    const hasRangeText = /R\\$\\s*\\d{1,3}(\\.\\d{3})*,\\d{2}\\s*(?:a|até)\\s*R\\$\\s*\\d{1,3}(\\.\\d{3})*,\\d{2}/i.test(txt)

    // 2) Intervalos por campos: valor_minimo/valor_maximo diferentes e presentes => aberta
    const vmin = (item.valor_minimo || "").toString().trim()
    const vmax = (item.valor_maximo || "").toString().trim()
    const hasIntervalFields = vmin && vmax && vmin !== vmax

    // 3) Multa fechada geralmente tem valor_por_unidade e/ou unidade_de_medida definidos
    const hasUnitFields = !!item.valor_por_unidade || !!item.unidade_de_medida

    // 4) Campo natureza_multa se existir, usamos apenas como fallback
    const natureField = (item.natureza_multa || "").toString().toLowerCase()

    // Regras de decisão
    if (hasRangeText || hasIntervalFields) return "aberta"
    if (hasUnitFields) return "fechada"
    if (natureField === "aberta" || natureField === "fechada") return natureField as "aberta" | "fechada"

    // Heurística adicional
    const unitHints =
      /(por\\s+(quilo|kg|hectare|árvore|árvores|unidade|indivíduo|exemplar|m³|metro\\s*cúbico|m2|m²|m3|litro|litros|peça|peças|fração))/i
    if (unitHints.test(txt)) return "fechada"

    return "aberta"
  } catch {
    return "aberta"
  }
}

// Dados das infrações extraídos automaticamente do HTML base
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

  // 5. Salvar arquivo
  fs.writeFileSync(OUTPUT_PATH, tsContent, "utf-8")
  console.log(`🎉 Arquivo gerado com sucesso em: ${OUTPUT_PATH}`)
  console.log(`📊 Total de ${totalInfracoes} infrações processadas!`)
} catch (error) {
  console.error("\n❌ ERRO FATAL:", error.message)
  console.error("Verifique se o arquivo AIA_APP_UNIFICADO_v3.html está na raiz do projeto.\n")
  process.exit(1)
}
