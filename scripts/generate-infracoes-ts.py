import base64
import json

base64_data = """W3sidGlwb19pbmZyYWNhbyI6IkFUSVZJREFERSBTRU0gTElDRU7Dh0EiLCJpbmZyYWNvZXMiOlt7InJlc3VtbyI6IkFUSVZJREFERSBTRU0gTElDRU7Dh0EvREVTQ1VNUFJJTUVOVE8gREUgQ09ORElDSU9OQU5URVMiLCJkZXNjcmljYW9fY29tcGxldGEiOiJDb25zdHJ1aXIsIHJlZm9ybWFyLCBhbXBsaWFyLCBpbnN0YWxhciBvdSBmYXplciBmdW5jaW9uYXIgZXN0YWJlbGVjaW1lbnRvcywgYXRpdmlkYWRlcywgb2JyYXMgb3Ugc2VydmnDp29zIHV0aWxpemFkb3JlcyBkZSByZWN1cnNvcyBhbWJpZW50YWlzLCBjb25zaWRlcmFkb3MgZWZldGl2YSBvdSBwb3RlbmNpYWxtZW50ZSBwb2x1aWRvcmVzLCBzZW0gbGljZW7Dp2Egb3UgYXV0b3JpemHDp8OjbyBkb3Mgw7NyZ8Ojb3MgYW1iaWVudGFpcyBjb21wZXRlbnRlcywgZW0gZGVzYWNvcmRvIGNvbSBhIGxpY2Vuw6dhIG9idGlkYSBvdSBjb250cmFyaWFuZG8gYXMgbm9ybWFzIGxlZ2FpcyBlIHJlZ3VsYW1lbnRvcyBwZXJ0aW5lbnRlcyIsImZ1bmRhbWVudG9fbGVnYWwiOiJBcnQuIDgyLCBEZWNyZXRvIG7CuiA3LjMxNS8yMDI1IiwibmF0dXJlemFfbXVsdGEiOiJBQkVSVEEiLCJ2YWxvcl9taW5pbW8iOjUwMC4wLCJ2YWxvcl9tYXhpbW8iOjEwMDAwMDAwLjAsInZhbG9yX3Bvcl91bmlkYWRlIjpudWxsLCJ1bmlkYWRlX2RlX21lZGlkYSI6bnVsbCwiY3JpdGVyaW9zX2FwbGljYWNhbyI6IlJlZ3JhIGRvIHNpc3RlbWE7IGFwbGljYXIgcGFyw6JtZXRyb3MgZSBtdWx0aXBsaWNhZG9yZXMgZGVmaW5pZG9zIG5hIEV0YXBhIDMgY29uZm9ybWUgRGVjcmV0byBuwrogNy4zMTUvMjAyNS4iLCJvYnNlcnZhY29lcyI6IkFncmF2YW50ZXM6IFNFIEFQTENDQSB8IEF0ZW51YW50ZXM6IFNFIEFQTENDQSJ9LHsicmVzdW1vIjoiQ29uc3RydWlyLCByZWZvcm1hciwgYW1wbGlhciwgaW5zdGFsYXIgb3UgZmF6ZXIgZnVuY2lvbmFyIGVzdGFiZWxlY2ltZW50bywgb2JyYSBvdSBzZXJ2acOnbyBzdWplaXRvIGEgbGljZW5jaWFtZW50byBhbWJpZW50YWwgbG9jYWxpemFkbyBlbSB1bmlkYWRlIGRlIGNvbnNlcnZhw6fDo28gb3UgZW0gc3VhIHpvbmEgZGUgYW1vcnRlY2ltZW50bywgb3UgZW0gw6FyZWFzIGRlIHByb3Rlw6fDo28gZGUgbWFuYW5jaWFpcyBsZWdhbG1lbnRlIGVzdGFiZWxlY2lkYXMsIHNlbSBhbnXDqm5jaWEgZG8gcmVzcGVjdGl2byDDs3Jnw6NvIGdlc3RvciIsImRlc2NyaWNhb19jb21wbGV0YSI6ImNvbnN0csOzaSwgcmVmb3JtYSwgYW1wbGlhLCBpbnN0YWxhIG91IGZheiBmdW5jaW9uYXIgZXN0YWJlbGVjaW1lbnRvLCBvYnJhIG91IHNlcnZpw6dvIHN1amVpdG8gYSBsaWNlbmNpYW1lbnRvIGFtYmllbnRhbCBsb2NhbGl6YWRvIGVtIHVuaWRhZGUgZGUgY29uc2VydmHDp8OjbyBvdSBlbSBzdWEgem9uYSBkZSBhbW9ydGVjaW1lbnRvLCBvdSBlbSDDoXJlYXMgZGUgcHJvdGXDp8OjbyBkZSBtYW5hbmNpYWlzIGxlZ2FsbWVudGUgZXN0YWJlbGVjaWRhcywgc2VtIGFudcOqbmNpYSBkbyByZXNwZWN0aXZvIMOzcmfDo28gZ2VzdG9yIiwiZnVuZGFtZW50b19sZWdhbCI6IkFydC4gODIsIERlY3JldG8gbsK6IDcuMzE1LzIwMjUiLCJuYXR1cmV6YV9tdWx0YSI6IkFCRVJUQSIsInZhbG9yX21pbmltbyI6NTAwLjAsInZhbG9yX21heGltbyI6MTAwMDAwMDAuMCwidmFsb3JfcG9yX3VuaWRhZGUiOm51bGwsInVuaWRhZGVfZGVfbWVkaWRhIjpudWxsLCJjcml0ZXJpb3NfYXBsaWNhY2FvIjoiUmVncmEgZG8gc2lzdGVtYTsgYXBsaWNhciBwYXLDom1ldHJvcyBlIG11bHRpcGxpY2Fkb3JlcyBkZWZpbmlkb3MgbmEgRXRhcGEgMyBjb25mb3JtZSBEZWNyZXRvIG7CuiA3LjMxNS8yMDI1LiIsIm9ic2VydmFjb2VzIjoiQWdyYXZhbnRlczogU0UgQVBMSUNBIHwgQXRlbnVhbnRlczogU0UgQVBMSUNBIn1dLCJub21lX2FydGlnbyI6IkFydC4gODIifSx7InRpcG9faW5mcmFjYW8iOiJGQVVOQSIsImluZnJhY29lcyI6W3sicmVzdW1vIjoiTUFUQVIvUEVSU0VHVUlSL0NBw4dBUi9BUEFOSEFSL0RFVEVSIEZBVU5BIiwiZGVzY3JpY2FvX2NvbXBsZXRhIjoiTWF0YXIsIHBlcnNlZ3VpciwgY2HDp2FyLCBhcGFuaGFyLCBhcHJlZW5kZXIsIGRldGVyLCBjb2xldGFyLCBjb21lcmNpYWxpemFyIG91IHV0aWxpemFyIGVzcMOpY2llcyBkYSBmYXVuYSBzaWx2ZXN0cmUsIG5hdGl2YSBvdSBlbSByb3RhIG1pZ3JhdMOzcmlhLCBzZW0gYSBkZXZpZGEgcGVybWlzc8OjbywgbGljZW7Dp2Egb3UgYXV0b3JpemHDp8OjbyBkYSBhdXRvcmlkYWRlIGNvbXBldGVudGUiLCJmdW5kYW1lbnRvX2xlZ2FsIjoiQXJ0LiA4MywgRGVjcmV0byBuxLIgNy4zMTUvMjAyNSIsIm5hdHVyZXphX211bHRhIjoiRkVDSEFEQSIsInZhbG9yX21pbmltbyI6bnVsbCwidmFsb3JfbWF4aW1vIjpudWxsLCJ2YWxvcl9wb3JfdW5pZGFkZSI6NTAwLjAsInVuaWRhZGVfZGVfbWVkaWRhIjoicG9yIGluZGl2w61kdW8iLCJjcml0ZXJpb3NfYXBsaWNhY2FvIjoiUiQgNTAwLDAwIHBvciBpbmRpdsOtZHVvIiw ib2JzZXJ2YWNvZXMiOiJBZ3JhdmFudGVzOiBTRSBBUExJQ0EgfCBBdGVudWFudGVzOiBTRSBBUExJQ0EifSx7InJlc3VtbyI6Ik1PRFBJQ0FSLCBEQU5JRklDQVIvREVTVFJVSVIgTklOSE9TL09WT1MvQ1JJQVRET1VST1MgRkFVTkEiLCJkZXNjcmljYW9fY29tcGxldGEiOiJNb2RpZmljYXIsIGRhbmlmaWNhciwgZGVzdHJ1aXIgb3UgbWFuaXB1bGFyIG5pbmhvIiwgb3ZvcyBvdSBjcmlhZG91cm9zIGRlIGVzcMOpY2llcyBkYSBmYXVuYSBzaWx2ZXN0cmUgbmF0aXZhIG91IGVtIHJvdGEgbWlncmF0w7NyaWEsIHNlbSBsaWNlbsOnYSwgYXV0b3JpemHDp8OjbyBvdSBlbSBkZXNhY29yZG8gY29tIGVzdGEsIGUgY29udHJhcmlhbmRvIGFzIG5vcm1hcyBsZWdhaXMgZSByZWd1bGFtZW50b3MgcGVydGluZW50ZXMiLCJmdW5kYW1lbnRvX2xlZ2FsIjoiQXJ0LiA4NCwgRGVjcmV0byBuxLIgNy4zMTUvMjAyNSIsIm5hdHVyZXphX211bHRhIjoiRkVDSEFEQSIsInZhbG9yX21pbmltbyI6bnVsbCwidmFsb3JfbWF4aW1vIjpudWxsLCJ2YWxvcl9wb3JfdW5pZGFkZSI6NTAwLjAsInVuaWRhZGVfZGVfbWVkaWRhIjoicG9yIGluZGl2w61kdW8iLCJjcml0ZXJpb3NfYXBsaWNhY2FvIjoiUiQgNTAwLDAwIHBvciBpbmRpdsOtZHVvIiwib2JzZXJ2YWNvZXMiOiJBZ3JhdmFudGVzOiBTRSBBUExJQ0EgfCBBdGVudWFudGVzOiBTRSBBUExJQ0EifSx7InJlc3VtbyI6Ik1BVEFSL1BFUlNFR1VJUi9DQUNDQVJBL0FQQU5IQVIvREVURVIgRkFVTkEgRU0gUEVSSUdPL1ZVTEVSw4FWRUlTL1JBUkFTIiwiZGVzY3JpY2FvX2NvbXBsZXRhIjoiTWF0YXIsIHBlcnNlZ3VpciwgY2HDp2FyLCBhcGFuaGFyLCBkZXRlciBvdSB1dGlsaXphciBlc3DDqWNpZXMgZGEgZmF1bmEgc2lsdmVzdHJlIGNsYXNzaWZpY2FkYXMgY29tbyBlbSBwZXJpZ28gZGUgZXh0aW7Dp8Ojbywgb3UgdnVsbmVyw6F2ZWlzIG91IHJhcmFzIiwiZnVuZGFtZW50b19sZWdhbCI6IkFydC4gODUsIERlY3JldG8gbsK6IDcuMzE1LzIwMjUiLCJuYXR1cmV6YV9tdWx0YSI6IkZFQ0hBREEiLCJ2YWxvcl9taW5pbW8iOm51bGwsInZhbG9yX21heGltbyI6bnVsbCwidmFsb3JfcG9yX3VuaWRhZGUiOjUwMDAuMCwidW5pZGFkZV9kZV9tZWRpZGEiOiJwb3IgaW5kaXbDrWR1byIsImNyaXRlcmlvc19hcGxpY2FjYW8iOiJSJCA1LjAwMCwwMCBwb3IgaW5kaXbDrWR1byIsIm9ic2VydmFjb2VzIjoiQWdyYXZhbnRlczogU0UgQVBMSUNBIHwgQXRlbnVhbnRlczogU0UgQVBMSUNBIn0seyJyZXN1bW8iOiJQZXNjYXIgbWVkaWFudGUgYSB1dGlsaXphw6fDo28gZGUgZXhwbG9zaXZvcyBvdSBzdWJzdMOibmNpYXMgdMOzeGljYXMiLCJkZXNjcmljYW9fY29tcGxldGEiOiJQZXNjYXIgbWVkaWFudGUgYSB1dGlsaXphw6fDo28gZGUgZXhwbG9zaXZvcyBvdSBzdWJzdMOibmNpYXMgdMOzeGljYXMiLCJmdW5kYW1lbnRvX2xlZ2FsIjoiQXJ0LiA4NiwgRGVjcmV0byBuxLIgNy4zMTUvMjAyNSIsIm5hdHVyZXphX211bHRhIjoiQUJFUlRBIiwidmFsb3JfbWluaW1vIjo1MDAwLjAsInZhbG9yX21heGltbyI6MTAwMDAwLjAsInZhbG9yX3Bvcl91bmlkYWRlIjpudWxsLCJ1bmlkYWRlX2RlX21lZGlkYSI6bnVsbCwiY3JpdGVyaW9zX2FwbGljYWNhbyI6IlJlZ3JhIGRvIHNpc3RlbWE7IGFwbGljYXIgcGFyw6JtZXRyb3MgZSBtdWx0aXBsaWNhZG9yZXMgZGVmaW5pZG9zIG5hIEV0YXBhIDMgY29uZm9ybWUgRGVjcmV0byBuxLIgNy4zMTUvMjAyNS4iLCJvYnNlcnZhY29lcyI6IkFncmF2YW50ZXM6IFNFIEFQTENDQSB8IEF0ZW51YW50ZXM6IFNFIEFQTENDQSJ9XSwibm9tZV9hcnRpZ28iOiJBcnQuIDgzIGEgODYifV0="""

try:
    decoded = base64.b64decode(base64_data).decode('utf-8')
    data = json.loads(decoded)
    
    print(f"Dados decodificados com sucesso!")
    print(f"Total de categorias: {len(data)}")
    
    # Conta total de infrações
    total = 0
    for cat in data:
        total += len(cat.get('infracoes', []))
    
    print(f"Total de infrações: {total}")
    
    # Gera o arquivo TypeScript
    ts_content = '''export interface Infracao {
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
  nome_artigo?: string
}

// Função para detectar tipo de multa
function detectTipoMulta(item: Infracao): "aberta" | "fechada" {
  try {
    const txt = `${item.descricao_completa || ""} ${item.resumo || ""} ${item.fundamento_legal || ""}`.replace(
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

const rawData: InfracaoBloco[] = '''
    
    # Adiciona os dados JSON
    ts_content += json.dumps(data, ensure_ascii=False, indent=2)
    
    # Finaliza o arquivo
    ts_content += '''

// Normalizar dados com tipo computado
export const infracoesData: InfracaoBloco[] = rawData.map((bloco) => ({
  ...bloco,
  infracoes: bloco.infracoes.map((inf) => ({
    ...inf,
    _categoria: bloco.tipo_infracao,
    _tipo_multa_computado: detectTipoMulta(inf),
  })),
}))
'''
    
    # Salva o arquivo
    with open('lib/infracoes-data.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Arquivo lib/infracoes-data.ts atualizado com sucesso!")
    print(f"Total de infrações no arquivo: {total}")
    
except Exception as e:
    print(f"Erro: {e}")
    import traceback
    traceback.print_exc()
