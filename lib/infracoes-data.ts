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
  _categoria?: string;
  _tipo_multa_computado?: "aberta" | "fechada";
  // Campos de compatibilidade para evitar erros de tipagem na calculadora
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

export const infracoesData: InfracaoBloco[] = [
  {
    tipo_infracao: "FAUNA",
    infracoes: [
      {
        id: "24-0",
        resumo: "Art. 24 - Matar, perseguir, caçar",
        label: "Art. 24 - Matar, perseguir, caçar",
        descricao_completa: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, sem a devida permissão, licença ou autorização da autoridade competente.",
        descricao: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória.",
        fundamento_legal: "Art. 24",
        artigo: "Art. 24",
        natureza_multa: "FECHADA",
        valor_por_unidade: 500,
        valor_minimo: 500,
        valor_maximo: 500,
        unidade_de_medida: "por indivíduo",
        unidade: "por indivíduo",
        observacoes: "R$ 500,00 por indivíduo",
        gravidade: "Gravíssima",
        _tipo_multa_computado: "fechada"
      },
      {
        id: "40-0",
        resumo: "Art. 40 (Caput) - Causar dano direto ou indireto às UCs",
        label: "Art. 40 (Caput) - Causar dano direto ou indireto às UCs",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação e às áreas de que trata o art. 27 do Decreto nº 99.274, de 6 de junho de 1990, independentemente de sua localização.",
        descricao: "Causar dano direto ou indireto às Unidades de Conservação.",
        fundamento_legal: "Art. 40",
        artigo: "Art. 40",
        natureza_multa: "ABERTA",
        valor_minimo: 200,
        valor_maximo: 100000,
        unidade_de_medida: "por hectare",
        unidade: "por hectare",
        observacoes: "Multa de R$ 200,00 a R$ 100.000,00.",
        gravidade: "Variavel",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "40-1",
        resumo: "Art. 40, I - Dano em UC de Proteção Integral",
        label: "Art. 40, I - Dano em UC de Proteção Integral",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação... I - Unidade de Conservação de Proteção Integral.",
        descricao: "Causar dano direto ou indireto em Unidade de Conservação de Proteção Integral.",
        fundamento_legal: "Art. 40, I",
        artigo: "Art. 40, I",
        natureza_multa: "ABERTA",
        valor_minimo: 400,
        valor_maximo: 200000,
        unidade_de_medida: "por hectare",
        unidade: "por hectare",
        observacoes: "O valor da multa será aumentado ao dobro.",
        gravidade: "Variavel",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "40-2",
        resumo: "Art. 40, II - Dano em UC de Uso Sustentável",
        label: "Art. 40, II - Dano em UC de Uso Sustentável",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação... II - Unidade de Conservação de Uso Sustentável.",
        descricao: "Causar dano direto ou indireto em Unidade de Conservação de Uso Sustentável.",
        fundamento_legal: "Art. 40, II",
        artigo: "Art. 40, II",
        natureza_multa: "ABERTA",
        valor_minimo: 200,
        valor_maximo: 100000,
        unidade_de_medida: "por hectare",
        unidade: "por hectare",
        observacoes: "Aplica-se o valor padrão do caput.",
        gravidade: "Variavel",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "40a",
        resumo: "Art. 40-A - Inserir animais exóticos em UC",
        label: "Art. 40-A - Inserir animais exóticos em UC",
        descricao_completa: "Inserir ou deixar animais domésticos ou exóticos no interior de Unidade de Conservação de Proteção Integral, sem autorização do órgão gestor.",
        descricao: "Inserir ou deixar animais domésticos ou exóticos no interior de Unidade de Conservação de Proteção Integral.",
        fundamento_legal: "Art. 40-A",
        artigo: "Art. 40-A",
        natureza_multa: "ABERTA",
        valor_minimo: 1000,
        valor_maximo: 5000,
        unidade_de_medida: "por animal",
        unidade: "por animal",
        observacoes: "",
        gravidade: "Média",
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao: "ATIVIDADE SEM LICENÇA",
    infracoes: [
      {
        id: "66-0",
        resumo: "Art. 66 - Obra sem licença",
        label: "Art. 66 - Obra sem licença",
        descricao_completa: "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimentos, atividades, obras ou serviços utilizadores de recursos ambientais, considerados efetiva ou potencialmente poluidores, sem licença.",
        descricao: "Construir, reformar, ampliar, instalar ou fazer funcionar obras ou serviços potencialmente poluidores, sem licença.",
        fundamento_legal: "Art. 66",
        artigo: "Art. 66",
        natureza_multa: "ABERTA",
        valor_minimo: 500,
        valor_maximo: 10000000,
        unidade_de_medida: "valor fixo",
        unidade: "valor fixo",
        observacoes: "",
        gravidade: "Grave",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "82-0",
        resumo: "Art. 82 (Caput) - Elaborar plano/estudo falso",
        label: "Art. 82 (Caput) - Elaborar plano/estudo falso",
        descricao_completa: "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso, enganoso ou omisso, seja nos sistemas oficiais de controle, seja no licenciamento.",
        descricao: "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso, enganoso ou omisso.",
        fundamento_legal: "Art. 82",
        artigo: "Art. 82",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        unidade_de_medida: "valor fixo",
        unidade: "valor fixo",
        observacoes: "Multa de R$ 1.500,00 a R$ 1.000.000,00.",
        gravidade: "Gravíssima",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "82-1",
        resumo: "Art. 82, I - Deixar de cumprir cronograma",
        label: "Art. 82, I - Deixar de cumprir cronograma",
        descricao_completa: "Elaborar ou apresentar informação falsa... I - deixar de cumprir cronograma de obras ou serviços.",
        descricao: "Elaborar ou apresentar informação falsa... I - deixar de cumprir cronograma de obras ou serviços.",
        fundamento_legal: "Art. 82, I",
        artigo: "Art. 82, I",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        unidade_de_medida: "valor fixo",
        unidade: "valor fixo",
        observacoes: "",
        gravidade: "Grave",
        _tipo_multa_computado: "aberta"
      },
      {
        id: "82-2",
        resumo: "Art. 82, II - Não atender às condicionantes",
        label: "Art. 82, II - Não atender às condicionantes",
        descricao_completa: "Elaborar ou apresentar informação falsa... II - não atender às condicionantes estabelecidas na licença ou autorização ambiental.",
        descricao: "Elaborar ou apresentar informação falsa... II - não atender às condicionantes estabelecidas na licença.",
        fundamento_legal: "Art. 82, II",
        artigo: "Art. 82, II",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        unidade_de_medida: "valor fixo",
        unidade: "valor fixo",
        observacoes: "",
        gravidade: "Grave",
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao: "POLUIÇÃO",
    infracoes: [
      {
        id: "61-0",
        resumo: "Art. 61 - Poluição",
        label: "Art. 61 - Poluição",
        descricao_completa: "Causar poluição de qualquer natureza em níveis tais que resultem ou possam resultar em danos à saúde humana, ou que provoquem a mortandade de animais.",
        descricao: "Causar poluição de qualquer natureza em níveis tais que resultem danos à saúde humana.",
        fundamento_legal: "Art. 61",
        artigo: "Art. 61",
        natureza_multa: "ABERTA",
        valor_minimo: 5000,
        valor_maximo: 50000000,
        unidade_de_medida: "valor fixo",
        unidade: "valor fixo",
        observacoes: "",
        gravidade: "Gravíssima",
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao: "FLORA",
    infracoes: [
      {
        id: "48-0",
        resumo: "Art. 48 - Impedir regeneração",
        label: "Art. 48 - Impedir regeneração",
        descricao_completa: "Impedir ou dificultar a regeneração natural de florestas e demais formas de vegetação.",
        descricao: "Impedir ou dificultar a regeneração natural de florestas e demais formas de vegetação.",
        fundamento_legal: "Art. 48",
        artigo: "Art. 48",
        natureza_multa: "FECHADA",
        valor_por_unidade: 5000,
        valor_minimo: 5000,
        valor_maximo: 5000,
        unidade_de_medida: "por hectare",
        unidade: "por hectare",
        observacoes: "R$ 5.000,00 por hectare",
        gravidade: "Grave",
        _tipo_multa_computado: "fechada"
      }
    ]
  }
];
