export interface Infracao {
  id: string;
  label: string;
  artigo: string;
  descricao: string;
  gravidade?: string;
  valor_minimo?: number;
  valor_maximo?: number;
  unidade?: string;
  observacao?: string;
  // Campos de compatibilidade para evitar erro de tipo
  resumo?: string;
  descricao_completa?: string;
  fundamento_legal?: string;
  natureza_multa?: string;
  criterios_aplicacao?: string;
  _categoria?: string;
  _tipo_multa_computado?: "aberta" | "fechada";
  [key: string]: any;
}

export const infracoesData: Infracao[] = [
  // --- ARTIGO 40 (CORRIGIDO) ---
  {
    id: "40-0",
    label: "Art. 40 (Caput) - Causar dano às Unidades de Conservação",
    artigo: "Art. 40",
    descricao: "Causar dano direto ou indireto às Unidades de Conservação...",
    gravidade: "Variavel",
    valor_minimo: 200,
    valor_maximo: 100000,
    unidade: "por hectare",
    observacao: "Multa de R$ 200,00 a R$ 100.000,00.",
    _tipo_multa_computado: "aberta"
  },
  {
    id: "40-1",
    label: "Art. 40, I - Dano em UC de Proteção Integral",
    artigo: "Art. 40, I",
    descricao: "Causar dano direto ou indireto... I - Unidade de Conservação de Proteção Integral.",
    gravidade: "Variavel",
    valor_minimo: 400,
    valor_maximo: 200000,
    unidade: "por hectare",
    observacao: "O valor da multa será aumentado ao dobro.",
    _tipo_multa_computado: "aberta"
  },
  {
    id: "40-2",
    label: "Art. 40, II - Dano em UC de Uso Sustentável",
    artigo: "Art. 40, II",
    descricao: "Causar dano direto ou indireto... II - Unidade de Conservação de Uso Sustentável.",
    gravidade: "Variavel",
    valor_minimo: 200,
    valor_maximo: 100000,
    unidade: "por hectare",
    observacao: "Aplica-se o valor padrão do caput.",
    _tipo_multa_computado: "aberta"
  },
  
  // --- ARTIGO 82 (CORRIGIDO) ---
  {
    id: "82-0",
    label: "Art. 82 (Caput) - Elaborar estudo falso/enganoso",
    artigo: "Art. 82",
    descricao: "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso.",
    gravidade: "Gravíssima",
    valor_minimo: 1500,
    valor_maximo: 1000000,
    unidade: "valor fixo",
    observacao: "Multa de R$ 1.500,00 a R$ 1.000.000,00.",
    _tipo_multa_computado: "aberta"
  },
  {
    id: "82-1",
    label: "Art. 82, I - Deixar de cumprir cronograma",
    artigo: "Art. 82, I",
    descricao: "Elaborar ou apresentar informação falsa... I - deixar de cumprir cronograma de obras.",
    gravidade: "Grave",
    valor_minimo: 1500,
    valor_maximo: 1000000,
    unidade: "valor fixo",
    observacao: "",
    _tipo_multa_computado: "aberta"
  },
  {
    id: "82-2",
    label: "Art. 82, II - Não atender às condicionantes",
    artigo: "Art. 82, II",
    descricao: "Elaborar ou apresentar informação falsa... II - não atender às condicionantes da licença.",
    gravidade: "Grave",
    valor_minimo: 1500,
    valor_maximo: 1000000,
    unidade: "valor fixo",
    observacao: "",
    _tipo_multa_computado: "aberta"
  },

  // --- OUTROS ---
  {
    id: "24-0",
    label: "Art. 24 - Matar, perseguir, caçar",
    artigo: "Art. 24",
    descricao: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre.",
    gravidade: "Gravíssima",
    valor_minimo: 500,
    valor_maximo: 500,
    unidade: "por indivíduo",
    observacao: "R$ 500,00 por indivíduo",
    _tipo_multa_computado: "fechada",
    valor_por_unidade: 500
  },
  {
    id: "61-0",
    label: "Art. 61 - Poluição",
    artigo: "Art. 61",
    descricao: "Causar poluição de qualquer natureza em níveis tais que resultem danos à saúde humana.",
    gravidade: "Gravíssima",
    valor_minimo: 5000,
    valor_maximo: 50000000,
    unidade: "valor fixo",
    observacao: "",
    _tipo_multa_computado: "aberta"
  },
  {
    id: "66-0",
    label: "Art. 66 - Obra sem licença",
    artigo: "Art. 66",
    descricao: "Construir, reformar, ampliar, instalar ou fazer funcionar obras potencialmente poluidoras sem licença.",
    gravidade: "Grave",
    valor_minimo: 500,
    valor_maximo: 10000000,
    unidade: "valor fixo",
    observacao: "",
    _tipo_multa_computado: "aberta"
  }
];
