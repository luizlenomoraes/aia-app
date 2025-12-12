import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTML_PATH = path.join(__dirname, '../AIA_APP_UNIFICADO_v3.html');
const OUTPUT_PATH = path.join(__dirname, '../lib/infracoes-data.ts');

console.log('🔍 Lendo arquivo HTML base...');

try {
  const htmlContent = fs.readFileSync(HTML_PATH, 'utf-8');
  let dataFinal = null;
  let countFinal = 0;

  // --- ESTRATÉGIA 1: Buscar window.EMBEDDED_DATA (JSON Puro) ---
  console.log('👉 Tentando extrair de window.EMBEDDED_DATA (JSON Raw)...');
  const regexRaw = /window\.EMBEDDED_DATA\s*=\s*(\[[\s\S]*?\])\s*(?:;|var|const|let|<)/;
  const matchRaw = htmlContent.match(regexRaw);

  if (matchRaw && matchRaw[1]) {
    try {
      const jsonRaw = JSON.parse(matchRaw[1]);
      let count = 0;
      if (Array.isArray(jsonRaw)) {
        jsonRaw.forEach(cat => { if (cat.infracoes) count += cat.infracoes.length; });
        console.log(`   ✅ Encontrado JSON Raw com ${count} infrações.`);
        
        if (count > countFinal) {
          dataFinal = jsonRaw;
          countFinal = count;
        }
      }
    } catch (e) {
      console.warn('   ⚠️ Falha ao parsear JSON Raw:', e.message);
    }
  }

  // --- ESTRATÉGIA 2: Buscar atob(...) (Base64) ---
  console.log('👉 Tentando extrair de atob(...) (Base64)...');
  const regexB64 = /atob\('([^']+)'\)/;
  const matchB64 = htmlContent.match(regexB64);

  if (matchB64 && matchB64[1]) {
    try {
      const base64String = matchB64[1];
      const buffer = Buffer.from(base64String, 'base64');
      
      let jsonB64;
      try {
        jsonB64 = JSON.parse(buffer.toString('utf-8'));
      } catch (e) {
        try {
           jsonB64 = JSON.parse(decodeURIComponent(escape(buffer.toString('utf-8'))));
        } catch (e2) {
           jsonB64 = JSON.parse(buffer.toString('latin1'));
        }
      }

      let count = 0;
      if (Array.isArray(jsonB64)) {
        jsonB64.forEach(cat => { if (cat.infracoes) count += cat.infracoes.length; });
        console.log(`   ✅ Encontrado Base64 com ${count} infrações.`);

        if (count >= countFinal) { // Prioriza Base64 se empate ou maior
          console.log(`   🌟 Base64 é a fonte escolhida.`);
          dataFinal = jsonB64;
          countFinal = count;
        }
      }
    } catch (e) {
       console.warn('   ⚠️ Falha ao processar Base64:', e.message);
    }
  }

  if (!dataFinal || countFinal === 0) {
    throw new Error('❌ Nenhuma infração válida foi encontrada.');
  }

  console.log(`\n🏆 VENCEDOR: Fonte com ${countFinal} infrações.`);

  // --- PÓS-PROCESSAMENTO PARA CORRIGIR INCISOS ---
  // O objetivo é garantir que "Art. 40" vire "Art. 40, I" se o resumo começar com "I -"
  console.log('🛠️  Refinando dados (extração de incisos)...');
  
  dataFinal.forEach(cat => {
    if (cat.infracoes) {
      cat.infracoes.forEach(inf => {
        // Tenta encontrar padrões de incisos romanos no início do resumo ou descrição
        // Ex: "I - Matar...", "II - Caçar..."
        const incisoRegex = /^([IVX]+)\s*-\s*/i;
        
        let inciso = null;
        const matchResumo = (inf.resumo || '').match(incisoRegex);
        if (matchResumo) inciso = matchResumo[1];
        
        if (!inciso) {
             const matchDesc = (inf.descricao_completa || '').match(incisoRegex);
             if (matchDesc) inciso = matchDesc[1];
        }

        // Se encontrou inciso e o fundamento não o tem, adiciona
        if (inciso && inf.fundamento_legal && !inf.fundamento_legal.includes(inciso)) {
            // Verifica se já não tem vírgula no final
            const base = inf.fundamento_legal.trim();
            if (!base.endsWith(',')) {
                inf.fundamento_legal = `${base}, ${inciso}`;
            } else {
                inf.fundamento_legal = `${base} ${inciso}`;
            }
        }
        
        // Limpeza extra: remover quebras de linha estranhas
        if (inf.resumo) inf.resumo = inf.resumo.replace(/\s+/g, ' ').trim();
        if (inf.descricao_completa) inf.descricao_completa = inf.descricao_completa.replace(/\s+/g, ' ').trim();
      });
    }
  });


  // Gerar o conteúdo do arquivo TypeScript
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
    // Se min e max existem e são diferentes, é aberta
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

const rawData: InfracaoBloco[] = ${JSON.stringify(dataFinal, null, 2)}

export const infracoesData: InfracaoBloco[] = rawData.map((bloco) => ({
  ...bloco,
  infracoes: bloco.infracoes.map((inf) => ({
    ...inf,
    _categoria: bloco.tipo_infracao,
    _tipo_multa_computado: detectTipoMulta(inf),
  })),
}))
`;

  fs.writeFileSync(OUTPUT_PATH, tsContent, 'utf-8');
  console.log(`🎉 Arquivo gerado com sucesso em: ${OUTPUT_PATH}`);

} catch (error) {
  console.error('\n❌ ERRO:', error.message);
}
