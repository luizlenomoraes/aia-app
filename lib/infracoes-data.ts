export interface Infracao {
  id: string;
  label: string;
  artigo: string;
  descricao: string;
  gravidade?: string;
  multa_min?: number;
  multa_max?: number;
  unidade?: string;
  observacao?: string;
}

export const infracoes: Infracao[] = [
  // --- INÍCIO DAS CORREÇÕES DO ART 40 (ADICIONADOS) ---
  {
    id: "40-0",
    label: "Art. 40 (Caput) - Causar dano direto ou indireto às Unidades de Conservação",
    artigo: "Art. 40",
    descricao: "Causar dano direto ou indireto às Unidades de Conservação e às áreas de que trata o art. 27 do Decreto nº 99.274, de 6 de junho de 1990, independentemente de sua localização.",
    gravidade: "Variavel",
    multa_min: 200,
    multa_max: 100000,
    unidade: "por hectare ou fração",
    observacao: "A multa será de R$ 200,00 (duzentos reais) a R$ 100.000,00 (cem mil reais) por hectare ou fração."
  },
  {
    id: "40-1",
    label: "Art. 40, Inciso I - Dano em Unidade de Conservação de Proteção Integral",
    artigo: "Art. 40, I",
    descricao: "Causar dano direto ou indireto às Unidades de Conservação... I - Unidade de Conservação de Proteção Integral.",
    gravidade: "Variavel",
    multa_min: 400,
    multa_max: 200000,
    unidade: "por hectare ou fração",
    observacao: "O valor da multa de que trata o caput será aumentado ao dobro."
  },
  {
    id: "40-2",
    label: "Art. 40, Inciso II - Dano em Unidade de Conservação de Uso Sustentável",
    artigo: "Art. 40, II",
    descricao: "Causar dano direto ou indireto às Unidades de Conservação... II - Unidade de Conservação de Uso Sustentável.",
    gravidade: "Variavel",
    multa_min: 200,
    multa_max: 100000,
    unidade: "por hectare ou fração",
    observacao: "Aplica-se o valor padrão do caput."
  },
  {
    id: "40a-0",
    label: "Art. 40-A - Inserir ou deixar animais exóticos em UC",
    artigo: "Art. 40-A",
    descricao: "Inserir ou deixar animais domésticos ou exóticos no interior de Unidade de Conservação de Proteção Integral, sem autorização do órgão gestor ou em desacordo com a concedida.",
    gravidade: "Variavel",
    multa_min: 1000,
    multa_max: 5000,
    unidade: "por animal",
    observacao: "Multa por unidade (animal)."
  },
  // --- FIM DAS ADIÇÕES DO ART 40 ---

  {
    id: "24-0",
    label: "Art. 24 - Matar, perseguir, caçar",
    artigo: "Art. 24",
    descricao: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, sem a devida permissão, licença ou autorização da autoridade competente, ou em desacordo com a obtida.",
    gravidade: "Gravíssima",
    multa_min: 500,
    multa_max: 500,
    unidade: "por indivíduo",
    observacao: "R$ 500,00 por indivíduo"
  },
  {
    id: "24-II",
    label: "Art. 24, II - Espécie em extinção",
    artigo: "Art. 24, II",
    descricao: "As multas serão aplicadas em dobro se a infração for praticada: II - em detrimento de espécie constante de listas oficiais de fauna brasileira ameaçada de extinção...",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 5000,
    unidade: "por indivíduo",
    observacao: "R$ 5.000,00 por indivíduo (Lista CITES/IBAMA)"
  },
  {
    id: "25-0",
    label: "Art. 25 - Impedir a procriação da fauna",
    artigo: "Art. 25",
    descricao: "Praticar ato de abuso, maus-tratos, ferir ou mutilar animais silvestres, domésticos ou domesticados, nativos ou exóticos.",
    gravidade: "Grave",
    multa_min: 500,
    multa_max: 3000,
    unidade: "por indivíduo",
    observacao: ""
  },
  {
    id: "43-0",
    label: "Art. 43 - Destruir ou danificar florestas nativas",
    artigo: "Art. 43",
    descricao: "Destruir ou danificar florestas ou demais formas de vegetação natural ou utilizá-las com infringência das normas de proteção em área considerada de preservação permanente, sem autorização do órgão competente...",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 50000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "44-0",
    label: "Art. 44 - Cortar árvores em APP",
    artigo: "Art. 44",
    descricao: "Cortar árvores em área considerada de preservação permanente ou cuja espécie seja especialmente protegida, sem permissão da autoridade competente.",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 20000,
    unidade: "por hectare ou fração",
    observacao: "Ou R$ 500,00 por árvore, metro cúbico ou fração."
  },
  {
    id: "47-0",
    label: "Art. 47 - Impedir a regeneração natural",
    artigo: "Art. 47",
    descricao: "Impedir ou dificultar a regeneração natural de florestas e demais formas de vegetação.",
    gravidade: "Grave",
    multa_min: 5000,
    multa_max: 5000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "48-0",
    label: "Art. 48 - Destruir vegetação local de especial preservação",
    artigo: "Art. 48",
    descricao: "Destruir ou danificar florestas ou qualquer tipo de vegetação nativa ou de espécies plantadas, objeto de especial preservação, sem autorização ou licença da autoridade ambiental competente.",
    gravidade: "Média",
    multa_min: 10000,
    multa_max: 25000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "49-0",
    label: "Art. 49 - Destruir vegetação reserva legal",
    artigo: "Art. 49",
    descricao: "Destruir ou danificar florestas ou demais formas de vegetação natural, em estágio avançado ou médio de regeneração, do Bioma Mata Atlântica, ou utilizá-las com infringência das normas de proteção.",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 50000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "50-0",
    label: "Art. 50 - Destruir ou danificar florestas nativas",
    artigo: "Art. 50",
    descricao: "Destruir ou danificar florestas ou demais formas de vegetação natural, em estágio avançado ou médio de regeneração, do Bioma Mata Atlântica, ou utilizá-las com infringência das normas de proteção.",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 50000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "51-0",
    label: "Art. 51 - Desmatar a corte raso",
    artigo: "Art. 51",
    descricao: "Desmatar, a corte raso, florestas ou demais formas de vegetação nativa, sem autorização da autoridade competente.",
    gravidade: "Gravíssima",
    multa_min: 1000,
    multa_max: 1000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "52-0",
    label: "Art. 52 - Executar manejo florestal sem autorização",
    artigo: "Art. 52",
    descricao: "Executar manejo florestal sem autorização prévia do órgão ambiental competente, ou em desacordo com a concedida.",
    gravidade: "Média",
    multa_min: 1000,
    multa_max: 1000,
    unidade: "por hectare ou fração",
    observacao: ""
  },
  {
    id: "61-0",
    label: "Art. 61 - Causar poluição",
    artigo: "Art. 61",
    descricao: "Causar poluição de qualquer natureza em níveis tais que resultem ou possam resultar em danos à saúde humana, ou que provoquem a mortandade de animais ou a destruição significativa da biodiversidade.",
    gravidade: "Gravíssima",
    multa_min: 5000,
    multa_max: 50000000,
    unidade: "valor fixo",
    observacao: "Multa de R$ 5.000,00 a R$ 50.000.000,00."
  },
  {
    id: "62-0",
    label: "Art. 62 - Inobservância a padrões de emissão",
    artigo: "Art. 62",
    descricao: "Inobservância aos padrões, parâmetros e critérios de qualidade do ar, da água e do solo.",
    gravidade: "Média",
    multa_min: 1000,
    multa_max: 50000,
    unidade: "por dia",
    observacao: ""
  },
  {
    id: "66-0",
    label: "Art. 66 - Construir/instalar obra poluidora sem licença",
    artigo: "Art. 66",
    descricao: "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimentos, atividades, obras ou serviços utilizadores de recursos ambientais, considerados efetiva ou potencialmente poluidores, sem licença ou autorização...",
    gravidade: "Grave",
    multa_min: 500,
    multa_max: 10000000,
    unidade: "valor fixo",
    observacao: "Multa de R$ 500,00 a R$ 10.000.000,00."
  },
  // --- CORREÇÃO DOS ARTIGOS 82 PARA EXIBIR LABELS DISTINTOS ---
  {
    id: "82-0",
    label: "Art. 82 (Caput) - Elaborar plano, projeto ou estudo falso/enganoso",
    artigo: "Art. 82",
    descricao: "Elaborar ou apresentar informação, estudo, laudo ou relatório ambiental total ou parcialmente falso, enganoso ou omisso, seja nos sistemas oficiais de controle, seja no licenciamento, na concessão florestal ou em qualquer outro procedimento administrativo ambiental.",
    gravidade: "Gravíssima",
    multa_min: 1500,
    multa_max: 1000000,
    unidade: "valor fixo",
    observacao: "Multa de R$ 1.500,00 a R$ 1.000.000,00."
  },
  {
    id: "82-1",
    label: "Art. 82, Inciso I - Deixar de cumprir cronograma",
    artigo: "Art. 82, I",
    descricao: "Elaborar ou apresentar informação falsa... I - deixar de cumprir cronograma de obras ou serviços.",
    gravidade: "Grave",
    multa_min: 1500,
    multa_max: 1000000,
    unidade: "valor fixo",
    observacao: ""
  },
  {
    id: "82-2",
    label: "Art. 82, Inciso II - Não atender às condicionantes",
    artigo: "Art. 82, II",
    descricao: "Elaborar ou apresentar informação falsa... II - não atender às condicionantes estabelecidas na licença ou autorização ambiental.",
    gravidade: "Grave",
    multa_min: 1500,
    multa_max: 1000000,
    unidade: "valor fixo",
    observacao: ""
  }
];
