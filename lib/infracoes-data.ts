export interface Infracao {
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
        resumo: "Art. 24 - Matar, perseguir, caçar",
        descricao_completa: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, sem a devida permissão, licença ou autorização da autoridade competente.",
        fundamento_legal: "Art. 24",
        natureza_multa: "FECHADA",
        valor_por_unidade: 500,
        unidade_de_medida: "por indivíduo",
        observacoes: "R$ 500,00 por indivíduo",
        _tipo_multa_computado: "fechada"
      },
      // --- CORREÇÃO ARTIGO 40 (INCISOS) ---
      {
        resumo: "Art. 40 (Caput) - Causar dano direto ou indireto às UCs",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação e às áreas de que trata o art. 27 do Decreto nº 99.274, de 6 de junho de 1990.",
        fundamento_legal: "Art. 40",
        natureza_multa: "ABERTA",
        valor_minimo: 200,
        valor_maximo: 100000,
        unidade_de_medida: "por hectare",
        observacoes: "Multa de R$ 200,00 a R$ 100.000,00.",
        _tipo_multa_computado: "aberta"
      },
      {
        resumo: "Art. 40, I - Dano em UC de Proteção Integral",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação... I - Unidade de Conservação de Proteção Integral.",
        fundamento_legal: "Art. 40, I",
        natureza_multa: "ABERTA",
        valor_minimo: 400,
        valor_maximo: 200000,
        unidade_de_medida: "por hectare",
        observacoes: "O valor da multa será aumentado ao dobro.",
        _tipo_multa_computado: "aberta"
      },
      {
        resumo: "Art. 40, II - Dano em UC de Uso Sustentável",
        descricao_completa: "Causar dano direto ou indireto às Unidades de Conservação... II - Unidade de Conservação de Uso Sustentável.",
        fundamento_legal: "Art. 40, II",
        natureza_multa: "ABERTA",
        valor_minimo: 200,
        valor_maximo: 100000,
        unidade_de_medida: "por hectare",
        observacoes: "Aplica-se o valor padrão do caput.",
        _tipo_multa_computado: "aberta"
      },
      {
        resumo: "Art. 40-A - Inserir animais exóticos em UC",
        descricao_completa: "Inserir ou deixar animais domésticos ou exóticos no interior de Unidade de Conservação de Proteção Integral.",
        fundamento_legal: "Art. 40-A",
        natureza_multa: "ABERTA",
        valor_minimo: 1000,
        valor_maximo: 5000,
        unidade_de_medida: "por animal",
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao": "ATIVIDADE SEM LICENÇA",
    infracoes: [
      {
        resumo: "Art. 66 - Obra sem licença",
        descricao_completa: "Construir, reformar, ampliar, instalar ou fazer funcionar obras ou serviços potencialmente poluidores, sem licença.",
        fundamento_legal: "Art. 66",
        natureza_multa: "ABERTA",
        valor_minimo: 500,
        valor_maximo: 10000000,
        _tipo_multa_computado: "aberta"
      },
      // --- CORREÇÃO ARTIGO 82 (INCISOS) ---
      {
        resumo: "Art. 82 (Caput) - Elaborar plano/estudo falso",
        descricao_completa: "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso, enganoso ou omisso.",
        fundamento_legal: "Art. 82",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        observacoes: "Multa de R$ 1.500,00 a R$ 1.000.000,00.",
        _tipo_multa_computado: "aberta"
      },
      {
        resumo: "Art. 82, I - Deixar de cumprir cronograma",
        descricao_completa: "Elaborar ou apresentar informação falsa... I - deixar de cumprir cronograma de obras ou serviços.",
        fundamento_legal: "Art. 82, I",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        _tipo_multa_computado: "aberta"
      },
      {
        resumo: "Art. 82, II - Não atender às condicionantes",
        descricao_completa: "Elaborar ou apresentar informação falsa... II - não atender às condicionantes estabelecidas na licença.",
        fundamento_legal: "Art. 82, II",
        natureza_multa: "ABERTA",
        valor_minimo: 1500,
        valor_maximo: 1000000,
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao": "POLUIÇÃO",
    infracoes: [
      {
        resumo: "Art. 61 - Poluição",
        descricao_completa: "Causar poluição de qualquer natureza em níveis tais que resultem ou possam resultar em danos à saúde humana.",
        fundamento_legal: "Art. 61",
        natureza_multa: "ABERTA",
        valor_minimo: 5000,
        valor_maximo: 50000000,
        _tipo_multa_computado: "aberta"
      }
    ]
  },
  {
    tipo_infracao": "FLORA",
    infracoes: [
      {
        resumo: "Art. 48 - Impedir regeneração",
        descricao_completa: "Impedir ou dificultar a regeneração natural de florestas e demais formas de vegetação.",
        fundamento_legal: "Art. 48",
        natureza_multa: "FECHADA",
        valor_por_unidade: 5000,
        unidade_de_medida: "por hectare",
        observacoes: "R$ 5.000,00 por hectare",
        _tipo_multa_computado: "fechada"
      }
    ]
  }
];
