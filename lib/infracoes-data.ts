export interface Infracao {
  id?: string;
  resumo: string;
  descricao_completa: string;
  fundamento_legal: string;
  natureza_multa?: string;
  valor_minimo?: number;
  valor_maximo?: number;
  valor_por_unidade?: number | null;
  unidade_de_medida?: string | null;
  criterios_aplicacao?: string;
  observacoes?: string;
  observacao_1?: string;
  observacao_2?: string;
  observacao_3?: string;
  observacao_4?: string;
  _categoria?: string;
  _tipo_multa_computado?: "aberta" | "fechada";
  // Campos de compatibilidade
  label?: string;
  artigo?: string;
  descricao?: string;
  gravidade?: string;
  unidade?: string;
  [key: string]: any;
}

export interface InfracaoBloco {
  tipo_infracao: string;
  infracoes: Infracao[];
}

// Função auxiliar para detectar se a multa é aberta ou fechada com base nos dados
function detectTipoMulta(item: Infracao): "aberta" | "fechada" {
  try {
    const txt = `${item.descricao_completa || ""} ${item.resumo || ""} ${item.fundamento_legal || ""}`.replace(
      /\s+/g,
      " "
    );

    const hasRangeText = /R\$\s*\d{1,3}(\.\d{3})*,\d{2}\s*(?:a|até)\s*R\$\s*\d{1,3}(\.\d{3})*,\d{2}/i.test(txt);
    const vmin = (item.valor_minimo || "").toString().trim();
    const vmax = (item.valor_maximo || "").toString().trim();
    const hasIntervalFields = vmin && vmax && vmin !== vmax;
    const hasUnitFields = !!item.valor_por_unidade || !!item.unidade_de_medida;
    const natureField = (item.natureza_multa || "").toString().toLowerCase();

    if (hasRangeText || hasIntervalFields) return "aberta";
    if (hasUnitFields) return "fechada";
    if (natureField === "aberta" || natureField === "fechada") return natureField as "aberta" | "fechada";

    const unitHints = /(por\s+(quilo|kg|hectare|árvore|árvores|unidade|indivíduo|exemplar|m³|metro\s*cúbico|m2|m²|m3|litro|litros|peça|peças|fração))/i;
    if (unitHints.test(txt)) return "fechada";

    return "aberta";
  } catch {
    return "aberta";
  }
}

// Seus dados brutos originais (102 itens)
const rawData: InfracaoBloco[] = [
  {
    "tipo_infracao": "FAUNA",
    "infracoes": [
      {
        "resumo": "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória,",
        "descricao_completa": "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, sem a devida permissão, licença ou autorização da autoridade competente, ou em desacordo com a obtida. Multa de: I - R$ 500,00 (quinhentos reais) por indivíduo de espécie não constante de listas oficiais de risco ou ameaça de extinção;",
        "fundamento_legal": "Art. 40, I",
        "natureza_multa": "FECHADA",
        "valor_minimo": 500,
        "valor_maximo": 500,
        "valor_por_unidade": 500,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacao_1": "§ 1º Incorre nas mesmas multas: I - quem impede a procriação da fauna...",
        "observacoes": "§ 1º Incorre nas mesmas multas: I - quem impede a procriação da fauna... (texto completo omitido para brevidade, mantido no processamento)",
        "valor_fixo": "R$ 500,00 por indivíduo"
      },
      {
        "resumo": "Matar, perseguir, caçar... (Espécie Ameaçada)",
        "descricao_completa": "Matar, perseguir, caçar... II - R$ 5.000,00 (cinco mil reais), por indivíduo de espécie constante de listas oficiais de fauna brasileira ameaçada de extinção...",
        "fundamento_legal": "Art. 40, II",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": 5000,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "Multa de R$ 5.000,00 por indivíduo em lista de extinção.",
        "valor_fixo": "R$ 5.000,00 por indivíduo"
      },
      {
        "resumo": "Introduzir espécime animal silvestre, nativo ou exótico, no Estado (Geral)",
        "descricao_completa": "Introduzir espécime animal silvestre, nativo ou exótico, no Estado, sem parecer técnico oficial favorável...",
        "fundamento_legal": "Art. 41, I",
        "natureza_multa": "FECHADA",
        "valor_minimo": 2000,
        "valor_maximo": null,
        "valor_por_unidade": 200,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 2.000,00 + R$ 200,00 por indivíduo.",
        "valor_fixo": "R$ 2.000,00 + acrescimo"
      },
      {
        "resumo": "Introduzir espécime animal silvestre (Ameaçada)",
        "descricao_completa": "Introduzir espécime animal silvestre... espécie constante de listas oficiais...",
        "fundamento_legal": "Art. 41, II",
        "natureza_multa": "FECHADA",
        "valor_minimo": 2000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 2.000,00 + R$ 5.000,00 por indivíduo ameaçado.",
        "valor_fixo": "R$ 2.000,00 + acrescimo"
      },
      {
        "resumo": "Exportar peles e couros de anfíbios e répteis em bruto (Geral)",
        "descricao_completa": "Exportar peles e couros de anfíbios e répteis em bruto, sem autorização...",
        "fundamento_legal": "Art. 42, I",
        "natureza_multa": "FECHADA",
        "valor_minimo": 2000,
        "valor_maximo": null,
        "valor_por_unidade": 200,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 2.000,00 + R$ 200,00 por unidade.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Exportar peles e couros (Ameaçada)",
        "descricao_completa": "Exportar peles e couros... espécie constante de listas oficiais...",
        "fundamento_legal": "Art. 42, II",
        "natureza_multa": "FECHADA",
        "valor_minimo": 2000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 2.000,00 + R$ 5.000,00 por unidade.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Praticar caça profissional (Geral)",
        "descricao_completa": "Praticar caça profissional...",
        "fundamento_legal": "Art. 43, I",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 500,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 + R$ 500,00 por indivíduo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Praticar caça profissional (Ameaçada)",
        "descricao_completa": "Praticar caça profissional... espécie ameaçada...",
        "fundamento_legal": "Art. 43, II",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 10000,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 + R$ 10.000,00 por indivíduo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Comercializar produtos de caça",
        "descricao_completa": "Comercializar produtos, instrumentos e objetos que impliquem a caça...",
        "fundamento_legal": "Art. 44",
        "natureza_multa": "FECHADA",
        "valor_minimo": 1000,
        "valor_maximo": null,
        "valor_por_unidade": 200,
        "unidade_de_medida": "por unidade excedente",
        "criterios_aplicacao": "",
        "observacoes": "R$ 1.000,00 + R$ 200,00 por unidade.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Praticar ato de abuso, maus-tratos, ferir ou mutilar animais",
        "descricao_completa": "Praticar ato de abuso, maus-tratos, ferir ou mutilar animais silvestres, domésticos ou domesticados, nativos ou exóticos",
        "fundamento_legal": "Art. 45",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 3000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por indivíduo",
        "criterios_aplicacao": "",
        "observacoes": "Multa de R$ 500,00 a R$ 3.000,00 por indivíduo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Zoológico/Criadouro sem registro",
        "descricao_completa": "Deixarem, o jardim zoológico e os criadouros autorizados, de ter o livro de registro do acervo faunístico ou mantê-lo de forma irregular",
        "fundamento_legal": "Art. 46",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 5000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Comerciante sem declaração de estoque",
        "descricao_completa": "Deixar, o comerciante, de apresentar declaração de estoque e valores oriundos de comércio de animais silvestres",
        "fundamento_legal": "Art. 47",
        "natureza_multa": "ABERTA",
        "valor_minimo": 200,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Explorar imagem de animal em situação irregular",
        "descricao_completa": "Explorar ou fazer uso comercial de imagem de animal silvestre mantido irregularmente em cativeiro ou em situação de abuso ou maus-tratos",
        "fundamento_legal": "Art. 48",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 500000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Degradação em viveiros/açudes públicos",
        "descricao_completa": "Causar degradação em viveiros, açudes ou estação de aquicultura de domínio público",
        "fundamento_legal": "Art. 49",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 500000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Pesca proibida",
        "descricao_completa": "Pescar em período ou local no qual a pesca seja proibida",
        "fundamento_legal": "Art. 50",
        "natureza_multa": "ABERTA",
        "valor_minimo": 700,
        "valor_maximo": 100000,
        "valor_por_unidade": 20,
        "unidade_de_medida": "acréscimo por kg",
        "criterios_aplicacao": "",
        "observacoes": "Acréscimo de R$ 20,00 por quilo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Pesca com explosivos/tóxicos",
        "descricao_completa": "Pescar mediante a utilização de explosivos ou substâncias tóxicas",
        "fundamento_legal": "Art. 51",
        "natureza_multa": "ABERTA",
        "valor_minimo": 700,
        "valor_maximo": 100000,
        "valor_por_unidade": 20,
        "unidade_de_medida": "acréscimo por kg",
        "criterios_aplicacao": "",
        "observacoes": "Acréscimo de R$ 20,00 por quilo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Pesca sem cadastro/licença",
        "descricao_completa": "Exercer a pesca sem prévio cadastro, inscrição, autorização, licença, permissão ou registro",
        "fundamento_legal": "Art. 52",
        "natureza_multa": "ABERTA",
        "valor_minimo": 300,
        "valor_maximo": 10000,
        "valor_por_unidade": 20,
        "unidade_de_medida": "acréscimo por kg",
        "criterios_aplicacao": "",
        "observacoes": "Acréscimo de R$ 20,00 por quilo.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Embarcação pesqueira sem mapa",
        "descricao_completa": "Deixarem, os comandantes de embarcações destinadas à pesca, de preencher e entregar mapas",
        "fundamento_legal": "Art. 54",
        "natureza_multa": "FECHADA",
        "valor_minimo": 1000,
        "valor_maximo": 1000,
        "valor_por_unidade": null,
        "unidade_de_medida": "valor fixo",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "1000"
      }
    ]
  },
  {
    "tipo_infracao": "FLORA",
    "infracoes": [
      {
        "resumo": "Destruir/danificar vegetação em APP",
        "descricao_completa": "Destruir ou danificar florestas ou demais formas de vegetação natural ou utilizá-las com infringência das normas de proteção em área de APP",
        "fundamento_legal": "Art. 56",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "Por hectare ou fração.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Corte seletivo em APP ou espécies protegidas",
        "descricao_completa": "Realizar o corte seletivo de árvores em área considerada de preservação permanente ou cuja espécie seja especialmente protegida",
        "fundamento_legal": "Art. 57",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 20000,
        "valor_por_unidade": 500,
        "unidade_de_medida": "por hectare ou árvore/m3",
        "criterios_aplicacao": "",
        "observacoes": "Ou R$ 500,00 por árvore/m³.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Extração mineral em floresta pública/APP",
        "descricao_completa": "Extrair de florestas de domínio público ou áreas de preservação permanente, sem prévia autorização, pedra, areia, cal ou qualquer espécie de minerais",
        "fundamento_legal": "Art. 58",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "Por hectare ou fração.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Produção de carvão vegetal sem licença",
        "descricao_completa": "Transformar madeira oriunda de floresta ou demais formas de vegetação nativa em carvão",
        "fundamento_legal": "Art. 59",
        "natureza_multa": "FECHADA",
        "valor_minimo": 500,
        "valor_maximo": null,
        "valor_por_unidade": 500,
        "unidade_de_medida": "por mdc",
        "criterios_aplicacao": "",
        "observacoes": "R$ 500,00 por metro de carvão (mdc).",
        "valor_fixo": "500"
      },
      {
        "resumo": "Adquirir madeira/carvão sem licença/DOF",
        "descricao_completa": "Receber ou adquirir, para fins comerciais ou industriais, madeira serrada ou em tora, lenha, carvão... sem licença",
        "fundamento_legal": "Art. 60",
        "natureza_multa": "FECHADA",
        "valor_minimo": 300,
        "valor_maximo": null,
        "valor_por_unidade": 300,
        "unidade_de_medida": "por unidade/m3",
        "criterios_aplicacao": "",
        "observacoes": "R$ 300,00 por unidade ou m³.",
        "valor_fixo": "300"
      },
      {
        "resumo": "Vender/Transportar madeira sem licença/DOF",
        "descricao_completa": "Vender, expor à venda, ter em depósito, transportar ou guardar madeira, lenha, carvão... sem licença válida",
        "fundamento_legal": "Art. 60 § 1º",
        "natureza_multa": "FECHADA",
        "valor_minimo": 300,
        "valor_maximo": null,
        "valor_por_unidade": 300,
        "unidade_de_medida": "por unidade/m3",
        "criterios_aplicacao": "",
        "observacoes": "R$ 300,00 por unidade ou m³.",
        "valor_fixo": "300"
      },
      {
        "resumo": "Impedir regeneração natural",
        "descricao_completa": "Impedir ou dificultar a regeneração natural de florestas ou demais formas de vegetação nativa",
        "fundamento_legal": "Art. 61",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 por hectare ou fração.",
        "valor_fixo": "5000"
      },
      {
        "resumo": "Destruir vegetação de especial preservação",
        "descricao_completa": "Destruir ou danificar florestas ou qualquer tipo de vegetação nativa, objeto de especial preservação",
        "fundamento_legal": "Art. 62",
        "natureza_multa": "FECHADA",
        "valor_minimo": 6000,
        "valor_maximo": null,
        "valor_por_unidade": 6000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 6.000,00 por hectare ou fração.",
        "valor_fixo": "6000"
      },
      {
        "resumo": "Destruir vegetação plantada especial",
        "descricao_completa": "Destruir ou danificar florestas ou qualquer tipo de vegetação nativa ou de espécies nativas plantadas, objeto de especial preservação",
        "fundamento_legal": "Art. 63",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 por hectare ou fração.",
        "valor_fixo": "5000"
      },
      {
        "resumo": "Destruir vegetação em Reserva Legal",
        "descricao_completa": "Destruir, desmatar, danificar ou explorar floresta... em área de reserva legal",
        "fundamento_legal": "Art. 64",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 por hectare ou fração.",
        "valor_fixo": "5000"
      },
      {
        "resumo": "Manejo florestal sem autorização",
        "descricao_completa": "Executar manejo florestal sem autorização prévia",
        "fundamento_legal": "Art. 65",
        "natureza_multa": "FECHADA",
        "valor_minimo": 1000,
        "valor_maximo": null,
        "valor_por_unidade": 1000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 1.000,00 por hectare ou fração.",
        "valor_fixo": "1000"
      },
      {
        "resumo": "Desmatamento a corte raso",
        "descricao_completa": "Desmatar, a corte raso, florestas ou demais formações nativas, fora da reserva legal",
        "fundamento_legal": "Art. 66",
        "natureza_multa": "FECHADA",
        "valor_minimo": 1000,
        "valor_maximo": null,
        "valor_por_unidade": 1000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 1.000,00 por hectare ou fração.",
        "valor_fixo": "1000"
      },
      {
        "resumo": "Explorar floresta fora de reserva legal",
        "descricao_completa": "Explorar ou danificar floresta... localizada fora de área de reserva legal averbada",
        "fundamento_legal": "Art. 67",
        "natureza_multa": "FECHADA",
        "valor_minimo": 300,
        "valor_maximo": null,
        "valor_por_unidade": 300,
        "unidade_de_medida": "por hectare/unidade",
        "criterios_aplicacao": "",
        "observacoes": "R$ 300,00 por hectare, unidade ou m³.",
        "valor_fixo": "300"
      },
      {
        "resumo": "Deixar de averbar a reserva legal",
        "descricao_completa": "Deixar de averbar a reserva legal (CAR)",
        "fundamento_legal": "Art. 69",
        "natureza_multa": "ABERTA",
        "valor_minimo": 50,
        "valor_maximo": 500,
        "valor_por_unidade": null,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "Diária. Por hectare.",
        "valor_fixo": "-"
      },
      {
        "resumo": "Danificar plantas ornamentais (público/alheio)",
        "descricao_completa": "Destruir, danificar, lesar ou maltratar... plantas de ornamentação de logradouros públicos ou em propriedade privada alheia",
        "fundamento_legal": "Art. 70",
        "natureza_multa": "ABERTA",
        "valor_minimo": 100,
        "valor_maximo": 1000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por unidade/m2",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Motosserra sem licença",
        "descricao_completa": "Comercializar, portar ou utilizar em floresta... motosserra sem licença",
        "fundamento_legal": "Art. 71",
        "natureza_multa": "FECHADA",
        "valor_minimo": 1000,
        "valor_maximo": null,
        "valor_por_unidade": 1000,
        "unidade_de_medida": "por unidade",
        "criterios_aplicacao": "",
        "observacoes": "R$ 1.000,00 por unidade.",
        "valor_fixo": "1000"
      },
      {
        "resumo": "Uso de fogo em áreas agropastoris",
        "descricao_completa": "Fazer uso de fogo em áreas agropastoris sem autorização",
        "fundamento_legal": "Art. 72",
        "natureza_multa": "FECHADA",
        "valor_minimo": 3000,
        "valor_maximo": null,
        "valor_por_unidade": 3000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 3.000,00 por hectare ou fração.",
        "valor_fixo": "3000"
      },
      {
        "resumo": "Incêndio em floresta nativa",
        "descricao_completa": "Provocar incêndio em floresta ou qualquer forma de vegetação nativa",
        "fundamento_legal": "Art. 73",
        "natureza_multa": "FECHADA",
        "valor_minimo": 10000,
        "valor_maximo": null,
        "valor_por_unidade": 10000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 10.000,00 por hectare ou fração.",
        "valor_fixo": "10000"
      },
      {
        "resumo": "Incêndio em floresta cultivada",
        "descricao_completa": "Provocar incêndio em floresta cultivada",
        "fundamento_legal": "Art. 74",
        "natureza_multa": "FECHADA",
        "valor_minimo": 5000,
        "valor_maximo": null,
        "valor_por_unidade": 5000,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "R$ 5.000,00 por hectare ou fração.",
        "valor_fixo": "5000"
      },
      {
        "resumo": "Não prevenir incêndios (Imóvel Rural)",
        "descricao_completa": "Deixar de implementar... ações de prevenção e de combate aos incêndios florestais",
        "fundamento_legal": "Art. 75",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 10000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Balões",
        "descricao_completa": "Fabricar, vender, transportar ou soltar balões que possam provocar incêndios",
        "fundamento_legal": "Art. 76",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por unidade",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "FAUNA/FLORA",
    "infracoes": [
      {
        "resumo": "Produto de área embargada",
        "descricao_completa": "Adquirir, intermediar, transportar ou comercializar produto... produzido sobre área objeto de embargo",
        "fundamento_legal": "Art. 68",
        "natureza_multa": "FECHADA",
        "valor_minimo": 500,
        "valor_maximo": null,
        "valor_por_unidade": 500,
        "unidade_de_medida": "por kg ou unidade",
        "criterios_aplicacao": "",
        "observacoes": "R$ 500,00 por kg ou unidade.",
        "valor_fixo": "500"
      }
    ]
  },
  {
    "tipo_infracao": "POLUIÇÃO E OUTRAS INFRAÇÕES",
    "infracoes": [
      {
        "resumo": "Causar poluição (Geral)",
        "descricao_completa": "Causar poluição de qualquer natureza em níveis tais que resultem ou possam resultar em danos à saúde humana ou que provoquem a mortandade de animais...",
        "fundamento_legal": "Art. 78",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluição: Área imprópria para ocupação",
        "descricao_completa": "causar poluição tornando uma área, urbana ou rural, imprópria para ocupação humana",
        "fundamento_legal": "Art. 79, I",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluição Atmosférica",
        "descricao_completa": "causar poluição atmosférica que provoque a retirada, ainda que momentânea, dos habitantes...",
        "fundamento_legal": "Art. 79, II",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluição Hídrica (Abastecimento)",
        "descricao_completa": "causar poluição hídrica que torne necessária a interrupção do abastecimento público de água",
        "fundamento_legal": "Art. 79, III",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluição Sonora",
        "descricao_completa": "causar poluição sonora... acima dos padrões ambientais estabelecidos",
        "fundamento_legal": "Art. 79, IV",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluição em Praias",
        "descricao_completa": "dificultar ou impedir o uso público das praias pelo lançamento de substâncias...",
        "fundamento_legal": "Art. 79, V",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Lançamento de resíduos/óleo irregular",
        "descricao_completa": "lançar resíduos sólidos, líquidos ou gasosos ou detritos, óleos... em desacordo com as exigências",
        "fundamento_legal": "Art. 79, VI",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Destinação inadequada de produtos/embalagens",
        "descricao_completa": "deixar, aquele que tem obrigação, de dar destinação ambientalmente adequada a produtos...",
        "fundamento_legal": "Art. 79, VII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Falta de precaução/contenção de risco",
        "descricao_completa": "deixar de adotar... medidas de precaução ou contenção em caso de risco ou de dano ambiental",
        "fundamento_legal": "Art. 79, VIII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Perecimento de biodiversidade por efluentes",
        "descricao_completa": "Provocar pela emissão de efluentes... o perecimento de espécimes da biodiversidade",
        "fundamento_legal": "Art. 79, IX",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Lançar resíduos em recursos hídricos",
        "descricao_completa": "lançar resíduos sólidos ou rejeitos em praias, no rio ou quaisquer recursos hídricos",
        "fundamento_legal": "Art. 79, X",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Lixo a céu aberto",
        "descricao_completa": "lançar resíduos sólidos ou rejeitos in natura a céu aberto",
        "fundamento_legal": "Art. 79, XI",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Depósito ilegal de resíduos",
        "descricao_completa": "Depositar resíduos sólidos ou rejeitos a céu aberto ou em recipientes... não licenciados",
        "fundamento_legal": "Art. 79, XII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Logística Reversa (Descumprimento)",
        "descricao_completa": "descumprir obrigação prevista no sistema de logística reversa",
        "fundamento_legal": "Art. 79, XIII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Falta de segregação de resíduos",
        "descricao_completa": "deixar de segregar resíduos sólidos na forma estabelecida para a coleta seletiva",
        "fundamento_legal": "Art. 79, XIV",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Recuperação energética irregular",
        "descricao_completa": "Destinar resíduos sólidos urbanos à recuperação energética em desacordo com a PNRS",
        "fundamento_legal": "Art. 79, XV",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Falta de informação (Logística Reversa)",
        "descricao_completa": "deixar de manter atualizadas e disponíveis informações... sobre logística reversa",
        "fundamento_legal": "Art. 79, XVI",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Falta de informação (Plano de Gerenciamento)",
        "descricao_completa": "não manter atualizadas... informações... sobre plano de gerenciamento de resíduos sólidos",
        "fundamento_legal": "Art. 79, XVII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Resíduos Perigosos (Irregularidade)",
        "descricao_completa": "deixar de atender às regras sobre registro, gerenciamento e informação de resíduos perigosos",
        "fundamento_legal": "Art. 79, XVIII",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "MINERAÇÃO",
    "infracoes": [
      {
        "resumo": "Mineração sem licença/autorização",
        "descricao_completa": "Executar pesquisa, lavra ou extração de minerais sem a competente autorização... ou em desacordo",
        "fundamento_legal": "Art. 80",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "Por hectare ou fração.",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "PRODUTOS/SUBSTÂNCIAS PERIGOSAS",
    "infracoes": [
      {
        "resumo": "Produtos perigosos/tóxicos (Produção/Uso irregular)",
        "descricao_completa": "Produzir, processar... produto ou substância tóxica, perigosa ou nociva... em desacordo com as exigências",
        "fundamento_legal": "Art. 81",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 2000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "ATIVIDADE SEM LICENÇA",
    "infracoes": [
      {
        "resumo": "Instalar/Funcionar obra poluidora sem licença (Geral)",
        "descricao_completa": "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimentos... sem licença ou autorização",
        "fundamento_legal": "Art. 82",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Obra em UC/Manancial sem anuência",
        "descricao_completa": "Construir, reformar... em unidade de conservação ou em sua zona de amortecimento... sem anuência",
        "fundamento_legal": "Art. 82, I",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Descumprimento de condicionantes",
        "descricao_completa": "deixa de atender as condicionantes estabelecidas na licença ambiental",
        "fundamento_legal": "Art. 82, II",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "DISCEMINAÇÃO DE DOENÇA/PRAGA/ESPÉCIES DANOSAS",
    "infracoes": [
      {
        "resumo": "Disseminar doença/praga/espécies",
        "descricao_completa": "Disseminar doença ou praga ou espécies que possam causar dano à fauna, à flora ou aos ecossistemas",
        "fundamento_legal": "Art. 83",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 5000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "VEÍCULOS - CONDUÇÃO EM DESACORDO",
    "infracoes": [
      {
        "resumo": "Veículo em desacordo com limites ambientais",
        "descricao_completa": "Conduzir, permitir ou autorizar a condução de veículo automotor em desacordo com os limites e exigências ambientais",
        "fundamento_legal": "Art. 84",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Alterar veículo/motor (Poluição)",
        "descricao_completa": "Alterar ou promover a conversão de qualquer item em veículos... que provoque alterações nos limites... ambientais",
        "fundamento_legal": "Art. 85",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por veículo",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "DAS INFRAÇÕES CONTRA O ORDENAMENTO URBANO E O PATRIMÔNIO CULTURAL",
    "infracoes": [
      {
        "resumo": "Destruir bem protegido (lei/ato/decisão)",
        "descricao_completa": "Destruir, inutilizar ou deteriorar bem especialmente protegido por lei, ato administrativo ou decisão judicial",
        "fundamento_legal": "Art. 86, I",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 500000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Destruir arquivo/museu/biblioteca protegido",
        "descricao_completa": "Destruir, inutilizar ou deteriorar arquivo, registro, museu, biblioteca, pinacoteca, instalação científica ou similar protegido",
        "fundamento_legal": "Art. 86, II",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 500000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Alterar local protegido (Paisagístico/Histórico)",
        "descricao_completa": "Alterar o aspecto ou estrutura de edificação ou local especialmente protegido por lei... sem autorização",
        "fundamento_legal": "Art. 87",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 200000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Construção em solo não edificável",
        "descricao_completa": "Promover construção em solo não edificável, ou no seu entorno... sem autorização",
        "fundamento_legal": "Art. 88",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 100000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Pichar/Grafitar edificação/monumento",
        "descricao_completa": "Pichar, grafitar ou por outro meio conspurcar edificação alheia ou monumento urbano",
        "fundamento_legal": "Art. 89",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "DAS INFRAÇÕES ADMINISTRATIVAS CONTRA A ADMINISTRAÇÃO AMBIENTAL",
    "infracoes": [
      {
        "resumo": "Obstar fiscalização",
        "descricao_completa": "Obstar ou dificultar a ação do Poder Público no exercício de atividades de fiscalização ambiental",
        "fundamento_legal": "Art. 90",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 100000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Obstar georreferenciamento",
        "descricao_completa": "Obstar ou dificultar a ação do órgão ambiental... na coleta de dados para a execução de georreferenciamento",
        "fundamento_legal": "Art. 91",
        "natureza_multa": "ABERTA",
        "valor_minimo": 100,
        "valor_maximo": 300,
        "valor_por_unidade": null,
        "unidade_de_medida": "por hectare",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Descumprir embargo",
        "descricao_completa": "Descumprir embargo de obra ou atividade e suas respectivas áreas",
        "fundamento_legal": "Art. 92",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 10000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Deixar de atender exigências legais/notificação",
        "descricao_completa": "Deixar de atender a exigências legais ou regulamentares quando devidamente notificado",
        "fundamento_legal": "Art. 93",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Não apresentar relatórios/informações",
        "descricao_completa": "Deixar de apresentar relatórios ou informações ambientais nos prazos exigidos",
        "fundamento_legal": "Art. 94",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Informação/Estudo falso ou enganoso",
        "descricao_completa": "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso, enganoso ou omisso",
        "fundamento_legal": "Art. 95",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1500,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Não cumprir compensação ambiental",
        "descricao_completa": "Deixar de cumprir compensação ambiental determinada por lei",
        "fundamento_legal": "Art. 96",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Produto sem licença (Comércio/Transporte/Uso)",
        "descricao_completa": "Comprar, vender, intermediar, utilizar, produzir, armazenar, transportar... produto, substância ou espécie... sem licença",
        "fundamento_legal": "Art. 97",
        "natureza_multa": "ABERTA",
        "valor_minimo": 100,
        "valor_maximo": 1000,
        "valor_por_unidade": null,
        "unidade_de_medida": "por kg/hectare/unidade",
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Deixar de reparar/compensar dano",
        "descricao_completa": "Deixar de reparar, compensar ou indenizar dano ambiental, na forma e no prazo exigidos",
        "fundamento_legal": "Art. 98",
        "natureza_multa": "ABERTA",
        "valor_minimo": 10000,
        "valor_maximo": 50000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "DAS INFRAÇÕES COMETIDAS EXCLUSIVAMENTE EM UNIDADES DE CONSERVAÇÃO",
    "infracoes": [
      {
        "resumo": "Introduzir espécies alóctones em UC",
        "descricao_completa": "Introduzir em unidade de conservação do Estado espécies alóctones",
        "fundamento_legal": "Art. 99",
        "natureza_multa": "ABERTA",
        "valor_minimo": 2000,
        "valor_maximo": 100000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Violar limitações em áreas de estudo para UC",
        "descricao_completa": "Violar as limitações administrativas provisórias impostas... nas áreas delimitadas para... criação de unidade de conservação",
        "fundamento_legal": "Art. 100",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1500,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Pesquisa em UC sem autorização",
        "descricao_completa": "Realizar pesquisa científica... em unidade de conservação estadual sem a devida autorização",
        "fundamento_legal": "Art. 101",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Uso comercial de imagem de UC sem autorização",
        "descricao_completa": "Explorar ou fazer uso comercial de imagem de unidade de conservação sem autorização",
        "fundamento_legal": "Art. 102",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 2000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "OGM em APA ou Zona de Amortecimento",
        "descricao_completa": "Realizar liberação planejada ou cultivo de organismos geneticamente modificados em áreas de proteção ambiental...",
        "fundamento_legal": "Art. 103",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1500,
        "valor_maximo": 1000000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Atividade em desacordo com Plano de Manejo",
        "descricao_completa": "Realizar quaisquer atividades ou adotar conduta em desacordo com os objetivos da unidade de conservação, o seu plano de manejo...",
        "fundamento_legal": "Art. 104",
        "natureza_multa": "ABERTA",
        "valor_minimo": 500,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Causar dano à UC",
        "descricao_completa": "Causar dano à unidade de conservação",
        "fundamento_legal": "Art. 105",
        "natureza_multa": "ABERTA",
        "valor_minimo": 200,
        "valor_maximo": 100000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Penetrar em UC com instrumentos proibidos",
        "descricao_completa": "Penetrar em unidade de conservação conduzindo substâncias ou instrumentos próprios para caça, pesca...",
        "fundamento_legal": "Art. 106",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Penetrar em UC vedada",
        "descricao_completa": "penetrar em unidade de conservação cuja visitação pública ou permanência sejam vedadas",
        "fundamento_legal": "Art. 106 P. Único",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  },
  {
    "tipo_infracao": "DAS INFRAÇÕES COMETIDAS CONTRA AS NORMAS DE GESTÃO E UTILIZAÇÃO DE RECURSOS HÍDRICOS",
    "infracoes": [
      {
        "resumo": "Uso de recursos hídricos sem outorga",
        "descricao_completa": "Derivar ou utilizar recursos hídricos para qualquer finalidade, sem a respectiva outorga de direito de uso",
        "fundamento_legal": "Art. 108",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Obra hídrica sem autorização",
        "descricao_completa": "Iniciar a implantação ou implantar empreendimento relacionado com a derivação ou a utilização de recursos hídricos... sem autorização",
        "fundamento_legal": "Art. 109",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Uso hídrico em desacordo com outorga",
        "descricao_completa": "Utilizar-se dos recursos hídricos ou executar obras... em desacordo com as condições estabelecidas na outorga",
        "fundamento_legal": "Art. 110",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poço sem autorização",
        "descricao_completa": "Perfurar poços para extração de água subterrânea ou operá-los sem a devida autorização",
        "fundamento_legal": "Art. 111",
        "natureza_multa": "ABERTA",
        "valor_minimo": 2000,
        "valor_maximo": 20000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Fraude na medição de água",
        "descricao_completa": "Fraudar as medições dos volumes de água utilizados ou declarar valores diferentes dos medidos",
        "fundamento_legal": "Art. 112",
        "natureza_multa": "ABERTA",
        "valor_minimo": 2000,
        "valor_maximo": 20000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Infringir normas hídricas (Geral)",
        "descricao_completa": "Infringir normas estabelecidas em Lei, Decretos e regulamentos administrativos... sobre recursos hídricos",
        "fundamento_legal": "Art. 113",
        "natureza_multa": "ABERTA",
        "valor_minimo": 2000,
        "valor_maximo": 20000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Obstar fiscalização hídrica",
        "descricao_completa": "Obstar ou dificultar a ação fiscalizadora das autoridades competentes (recursos hídricos)",
        "fundamento_legal": "Art. 114",
        "natureza_multa": "ABERTA",
        "valor_minimo": 2000,
        "valor_maximo": 20000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Uso após término da outorga",
        "descricao_completa": "Continuar a utilizar o recurso hídrico após o término do prazo estabelecido na outorga",
        "fundamento_legal": "Art. 115",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Poluir recursos hídricos",
        "descricao_completa": "Poluir ou degradar recursos hídricos, acima dos limites estabelecidos",
        "fundamento_legal": "Art. 116",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Degradar vegetação adjacente a recursos hídricos",
        "descricao_completa": "Degradar ou impedir a regeneração de florestas e demais formas de vegetação permanente, adjacentes aos recursos hídricos",
        "fundamento_legal": "Art. 117",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Prejudicar terceiros/vazão mínima",
        "descricao_completa": "Utilizar recurso hídrico de maneira prejudicial a direito de terceiros e à vazão mínima remanescente",
        "fundamento_legal": "Art. 118",
        "natureza_multa": "ABERTA",
        "valor_minimo": 1000,
        "valor_maximo": 10000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      },
      {
        "resumo": "Descumprir determinações (Água)",
        "descricao_completa": "Descumprir determinações normativas ou atos emanados das autoridades competentes visando a aplicação deste Decreto (Hídricos)",
        "fundamento_legal": "Art. 119",
        "natureza_multa": "ABERTA",
        "valor_minimo": 5000,
        "valor_maximo": 50000,
        "valor_por_unidade": null,
        "unidade_de_medida": null,
        "criterios_aplicacao": "",
        "observacoes": "",
        "valor_fixo": "-"
      }
    ]
  }
];

// Exportação final processada para o formato que a aplicação espera
export const infracoesData: InfracaoBloco[] = rawData.map((bloco) => ({
  ...bloco,
  infracoes: bloco.infracoes.map((inf, idx) => {
    // Gerar ID estável baseado na categoria e índice se não houver um
    const idGerado = `${bloco.tipo_infracao.substring(0, 3)}-${inf.fundamento_legal.replace(/[^a-zA-Z0-9]/g, '')}-${idx}`.toLowerCase();
    
    return {
      ...inf,
      id: inf.id || idGerado,
      // Garante que campos obrigatórios na nova interface existam
      label: inf.resumo, 
      artigo: inf.fundamento_legal,
      descricao: inf.descricao_completa,
      gravidade: "Variavel", // Default seguro
      unidade: inf.unidade_de_medida || "valor fixo",
      _categoria: bloco.tipo_infracao,
      _tipo_multa_computado: detectTipoMulta(inf),
    };
  }),
}));
