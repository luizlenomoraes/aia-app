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
    const txt = `${item.descricao_completa || ""} ${item.resumo || ""} ${item.fundamento_legal || ""}`.replace(
      /\s+/g,
      " ",
    )

    // 1) Padrão textual "R$ X a R$ Y" => intervalo => aberta
    const hasRangeText = /R\$\s*\d{1,3}(\.\d{3})*,\d{2}\s*(?:a|até)\s*R\$\s*\d{1,3}(\.\d{3})*,\d{2}/i.test(txt)

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
      /(por\s+(quilo|kg|hectare|árvore|árvores|unidade|indivíduo|exemplar|m³|metro\s*cúbico|m2|m²|m3|litro|litros|peça|peças|fração))/i
    if (unitHints.test(txt)) return "fechada"

    return "aberta"
  } catch {
    return "aberta"
  }
}

// Dados das infrações extraídos do HTML original
const rawData: InfracaoBloco[] = [
  {
    tipo_infracao: "ATIVIDADE SEM LICENÇA",
    infracoes: [
      {
        resumo: "ATIVIDADE SEM LICENÇA/DESCUMPRIMENTO DE CONDICIONANTES",
        descricao_completa:
          "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimentos, atividades, obras ou serviços utilizadores de recursos ambientais, considerados efetiva ou potencialmente poluidores, sem licença ou autorização dos órgãos ambientais competentes, em desacordo com a licença obtida ou contrariando as normas legais e regulamentos pertinentes",
        fundamento_legal: "Art. 82, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 500.0,
        valor_maximo: 10000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao:
          "Regra do sistema; aplicar parâmetros e multiplicadores definidos na Etapa 3 conforme Decreto nº 7.315/2025.",
        observacoes: "Agravantes: SE APLICA | Atenuantes: SE APLICA",
      },
      {
        resumo:
          "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimento em UC ou zona de amortecimento sem anuência",
        descricao_completa:
          "Construir, reformar, ampliar, instalar ou fazer funcionar estabelecimento, obra ou serviço sujeito a licenciamento ambiental localizado em unidade de conservação ou em sua zona de amortecimento, ou em áreas de proteção de mananciais legalmente estabelecidas, sem anuência do respectivo órgão gestor",
        fundamento_legal: "Art. 83, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 10000.0,
        valor_maximo: 10000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao:
          "Regra do sistema; aplicar parâmetros e multiplicadores definidos na Etapa 3 conforme Decreto nº 7.315/2025.",
        observacoes: "Agravantes: SE APLICA | Atenuantes: SE APLICA",
      },
    ],
  },
  {
    tipo_infracao: "FAUNA",
    infracoes: [
      {
        resumo: "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre",
        descricao_completa:
          "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, sem a devida permissão, licença ou autorização da autoridade competente, ou em desacordo com a obtida",
        fundamento_legal: "Art. 24, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 500.0,
        valor_maximo: 500.0,
        valor_por_unidade: 500.0,
        unidade_de_medida: "por indivíduo",
        criterios_aplicacao: "Multiplicar pelo número de espécimes",
        observacoes: "Agravantes: SE APLICA | Atenuantes: SE APLICA",
      },
      {
        resumo: "Matar, perseguir, caçar espécimes ameaçados de extinção",
        descricao_completa:
          "Matar, perseguir, caçar, apanhar, coletar, utilizar espécimes da fauna silvestre, nativos ou em rota migratória, ameaçados de extinção ou constantes de lista CITES, sem a devida permissão, licença ou autorização da autoridade competente",
        fundamento_legal: "Art. 24, §4º, I, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 5000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: 5000.0,
        unidade_de_medida: "por indivíduo",
        criterios_aplicacao: "Multiplicar pelo número de espécimes ameaçados",
        observacoes: "Espécies ameaçadas de extinção ou CITES",
      },
      {
        resumo: "Exercer pesca em período/local proibido ou com equipamentos proibidos",
        descricao_completa:
          "Exercer a pesca em período no qual esta seja proibida, em locais onde a pesca seja proibida ou sem autorização do órgão ambiental competente, ou utilizando equipamentos, apetrechos ou métodos não permitidos",
        fundamento_legal: "Art. 35, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 700.0,
        valor_maximo: 100000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Agravantes: SE APLICA | Atenuantes: SE APLICA",
      },
      {
        resumo: "Pescar mediante a utilização de explosivos ou substâncias tóxicas",
        descricao_completa:
          "Pescar mediante a utilização de explosivos ou substâncias que, em contato com a água, produzam efeito semelhante, ou substâncias tóxicas ou outro meio proibido pela autoridade competente",
        fundamento_legal: "Art. 35, §1º, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 100000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Inclui pesca com explosivos ou substâncias tóxicas",
      },
      {
        resumo: "Transportar, comercializar, beneficiar ou industrializar espécimes da fauna silvestre sem licença",
        descricao_completa:
          "Transportar, comercializar, beneficiar ou industrializar espécimes provenientes da coleta, apanha e pesca não autorizada, ou sem autorização, licença ou permissão da autoridade competente",
        fundamento_legal: "Art. 25, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 500.0,
        valor_maximo: 500.0,
        valor_por_unidade: 500.0,
        unidade_de_medida: "por indivíduo",
        criterios_aplicacao: "Multiplicar pelo número de espécimes",
        observacoes: "Transporte/comércio ilegal de fauna",
      },
      {
        resumo: "Introduzir espécime animal no país sem parecer técnico oficial favorável",
        descricao_completa:
          "Introduzir espécime animal no país sem parecer técnico oficial favorável e licença expedida pela autoridade competente",
        fundamento_legal: "Art. 31, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 2000.0,
        valor_maximo: 10000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Introdução ilegal de fauna exótica",
      },
      {
        resumo: "Praticar caça profissional",
        descricao_completa: "Praticar caça profissional no país",
        fundamento_legal: "Art. 27, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 50000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Caça profissional é proibida no país",
      },
      {
        resumo: "Manter em cativeiro espécimes da fauna silvestre sem autorização",
        descricao_completa:
          "Manter em cativeiro ou depósito espécimes da fauna silvestre, nativa ou em rota migratória, sem autorização, licença ou permissão da autoridade competente ou em desacordo com a obtida",
        fundamento_legal: "Art. 30, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 500.0,
        valor_maximo: 500.0,
        valor_por_unidade: 500.0,
        unidade_de_medida: "por indivíduo",
        criterios_aplicacao: "Multiplicar pelo número de espécimes",
        observacoes: "Manutenção ilegal de fauna em cativeiro",
      },
    ],
  },
  {
    tipo_infracao: "FLORA",
    infracoes: [
      {
        resumo: "Destruir ou danificar floresta ou vegetação nativa em APP",
        descricao_completa:
          "Destruir ou danificar floresta ou demais formas de vegetação nativa ou de espécies nativas plantadas, objeto de especial preservação, em área de preservação permanente",
        fundamento_legal: "Art. 43, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 5000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: 5000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área afetada em hectares",
        observacoes: "Danos em APP",
      },
      {
        resumo: "Cortar árvores em APP sem autorização",
        descricao_completa:
          "Cortar árvores em área de preservação permanente, sem autorização da autoridade competente",
        fundamento_legal: "Art. 44, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 5000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: 5000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área afetada em hectares",
        observacoes: "Corte ilegal em APP",
      },
      {
        resumo: "Extrair minerais em APP ou florestas de domínio público",
        descricao_completa:
          "Extrair de florestas de domínio público ou de preservação permanente pedra, areia, cal ou qualquer espécie de minerais",
        fundamento_legal: "Art. 45, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 5000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: 5000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área afetada em hectares",
        observacoes: "Extração mineral ilegal em APP",
      },
      {
        resumo: "Destruir ou danificar vegetação em UC",
        descricao_completa:
          "Destruir ou danificar florestas ou demais formas de vegetação natural ou utilizá-las com infringência das normas de proteção em área considerada de relevante interesse ambiental",
        fundamento_legal: "Art. 52, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 50000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Danos em UC",
      },
      {
        resumo: "Desmatar, a corte raso, floresta ou vegetação nativa sem autorização",
        descricao_completa:
          "Desmatar, a corte raso, floresta ou outras formas de vegetação nativa, sem autorização da autoridade competente",
        fundamento_legal: "Art. 51, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 2000.0,
        valor_maximo: 2000.0,
        valor_por_unidade: 2000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área desmatada em hectares",
        observacoes: "Desmatamento sem autorização",
      },
      {
        resumo: "Fazer uso de fogo em áreas agropastoris sem autorização",
        descricao_completa:
          "Fazer uso de fogo em áreas agropastoris sem autorização do órgão competente ou em desacordo com a obtida",
        fundamento_legal: "Art. 58, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa por hectare conforme gravidade",
        observacoes: "Uso de fogo sem autorização",
      },
      {
        resumo: "Provocar incêndio em mata ou floresta",
        descricao_completa: "Provocar incêndio em mata ou floresta",
        fundamento_legal: "Art. 59, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 5000.0,
        valor_maximo: 5000.0,
        valor_por_unidade: 5000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área queimada em hectares",
        observacoes: "Incêndio em floresta",
      },
      {
        resumo: "Fabricar, vender, transportar ou soltar balões",
        descricao_completa:
          "Fabricar, vender, transportar ou soltar balões que possam provocar incêndios nas florestas e demais formas de vegetação",
        fundamento_legal: "Art. 60, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 10000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar por unidade de balão",
        observacoes: "Fabricação/soltura de balões",
      },
      {
        resumo: "Comercializar motosserra ou utilizá-la sem licença ou registro",
        descricao_completa:
          "Comercializar motosserra ou utilizá-la em floresta ou outras formas de vegetação sem licença ou registro da autoridade ambiental competente",
        fundamento_legal: "Art. 65, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 500.0,
        valor_maximo: 2000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar por unidade de motosserra",
        observacoes: "Uso/comércio irregular de motosserra",
      },
      {
        resumo: "Receber ou adquirir produto de origem vegetal sem licença",
        descricao_completa:
          "Receber ou adquirir, para fins comerciais ou industriais, madeira, lenha, carvão e outros produtos de origem vegetal sem a exigência de licença do vendedor",
        fundamento_legal: "Art. 48, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 100.0,
        valor_maximo: 100.0,
        valor_por_unidade: 100.0,
        unidade_de_medida: "por m³",
        criterios_aplicacao: "Multiplicar pelo volume em m³",
        observacoes: "Recebimento de produto sem DOF",
      },
      {
        resumo: "Adquirir, intermediar, transportar ou comercializar produto de origem vegetal sem documentação",
        descricao_completa:
          "Adquirir, intermediar, transportar ou comercializar produto ou subproduto de origem vegetal sem comprovação de sua origem legal ou em desacordo com a documentação exigida",
        fundamento_legal: "Art. 47, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 300.0,
        valor_maximo: 300.0,
        valor_por_unidade: 300.0,
        unidade_de_medida: "por m³ ou fração",
        criterios_aplicacao: "Multiplicar pelo volume em m³",
        observacoes: "Transporte/comércio de produtos sem DOF",
      },
      {
        resumo: "Explorar área de reserva legal sem aprovação de manejo",
        descricao_completa:
          "Explorar economicamente a reserva legal mediante corte raso de vegetação nativa ou com desacordo ao Plano de Manejo Florestal Sustentável aprovado",
        fundamento_legal: "Art. 53, Decreto nº 7.315/2025",
        natureza_multa: "FECHADA",
        valor_minimo: 1000.0,
        valor_maximo: 1000.0,
        valor_por_unidade: 1000.0,
        unidade_de_medida: "por hectare ou fração",
        criterios_aplicacao: "Multiplicar pela área afetada em hectares",
        observacoes: "Exploração irregular de reserva legal",
      },
    ],
  },
  {
    tipo_infracao: "POLUIÇÃO",
    infracoes: [
      {
        resumo: "Causar poluição de qualquer natureza",
        descricao_completa:
          "Causar poluição de qualquer natureza em níveis tais que resultem ou possam resultar em danos à saúde humana, ou que provoquem a mortandade de animais ou a destruição significativa da biodiversidade",
        fundamento_legal: "Art. 61, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 50000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Agravantes: SE APLICA | Atenuantes: SE APLICA",
      },
      {
        resumo: "Lançar resíduos sólidos, líquidos ou gasosos em desacordo com normas",
        descricao_completa:
          "Lançar resíduos sólidos, líquidos ou gasosos ou detritos, óleos ou substâncias oleosas em desacordo com as exigências estabelecidas em leis ou atos normativos",
        fundamento_legal: "Art. 62, I, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 50000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Lançamento irregular de resíduos",
      },
      {
        resumo: "Causar poluição atmosférica com emissão de substâncias",
        descricao_completa:
          "Causar poluição atmosférica que provoque a retirada, ainda que momentânea, dos habitantes das áreas afetadas, ou que provoque, de forma recorrente, significativo desconforto respiratório ou olfativo",
        fundamento_legal: "Art. 62, II, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 5000.0,
        valor_maximo: 50000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Poluição atmosférica",
      },
      {
        resumo: "Executar serviço de baixo potencial poluidor sem registro no CTF",
        descricao_completa:
          "Executar ou desenvolver atividade ou serviço de baixo potencial de degradação ambiental sem registro no Cadastro Técnico Federal de Atividades Potencialmente Poluidoras ou Utilizadoras de Recursos Ambientais",
        fundamento_legal: "Art. 76, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 500.0,
        valor_maximo: 2000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com o porte",
        observacoes: "Falta de registro no CTF",
      },
      {
        resumo: "Operar estabelecimentos que gerem ou manipulem resíduos perigosos sem licença",
        descricao_completa:
          "Construir, reformar, ampliar, instalar ou fazer funcionar, em qualquer parte do território nacional, estabelecimentos, obras ou serviços relevantes que se destinem a produzir, estocar, embalar, transportar, comercializar ou utilizar resíduos perigosos sem licença ou autorização dos órgãos ambientais competentes",
        fundamento_legal: "Art. 71, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 500.0,
        valor_maximo: 2000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Operação com resíduos perigosos sem licença",
      },
    ],
  },
  {
    tipo_infracao: "RECURSOS HÍDRICOS",
    infracoes: [
      {
        resumo: "Derivar ou utilizar recursos hídricos sem outorga",
        descricao_completa:
          "Derivar ou utilizar recursos hídricos para qualquer finalidade sem a respectiva outorga de direito de uso",
        fundamento_legal: "Art. 68, I, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 10000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Uso de recursos hídricos sem outorga",
      },
      {
        resumo: "Obstar ou dificultar ação fiscalizadora em recursos hídricos",
        descricao_completa: "Obstar ou dificultar a ação fiscalizadora dos órgãos competentes",
        fundamento_legal: "Art. 68, II, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 50000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Obstrução de fiscalização",
      },
      {
        resumo: "Perfurar poços ou operar captação de água subterrânea sem autorização",
        descricao_completa: "Perfurar poços para extração de água subterrânea ou operá-los sem a devida autorização",
        fundamento_legal: "Art. 69, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 500.0,
        valor_maximo: 50000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Poço sem autorização",
      },
    ],
  },
  {
    tipo_infracao: "ORDENAMENTO URBANO E PATRIMÔNIO CULTURAL",
    infracoes: [
      {
        resumo: "Destruir, inutilizar ou deteriorar bem especialmente protegido",
        descricao_completa:
          "Destruir, inutilizar ou deteriorar bem especialmente protegido por lei, ato administrativo ou decisão judicial",
        fundamento_legal: "Art. 72, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 10000.0,
        valor_maximo: 500000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Destruição de patrimônio cultural",
      },
      {
        resumo: "Alterar aspecto ou estrutura de edificação ou local especialmente protegido",
        descricao_completa:
          "Alterar o aspecto ou a estrutura de edificação ou local especialmente protegido por lei, ato administrativo ou decisão judicial, sem autorização da autoridade competente ou em desacordo com a concedida",
        fundamento_legal: "Art. 73, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 10000.0,
        valor_maximo: 200000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Alteração em patrimônio cultural",
      },
      {
        resumo: "Promover construção em solo não edificável",
        descricao_completa:
          "Promover construção em solo não edificável, ou no seu entorno, assim considerado em razão de seu valor paisagístico, ecológico, artístico, turístico, histórico, cultural, religioso, arqueológico, etnográfico ou monumental, sem autorização da autoridade competente ou em desacordo com a concedida",
        fundamento_legal: "Art. 74, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 10000.0,
        valor_maximo: 100000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Construção em solo não edificável",
      },
      {
        resumo: "Pichar ou por outro meio conspurcar edificação ou monumento urbano",
        descricao_completa: "Pichar, grafitar ou por outro meio conspurcar edificação ou monumento urbano",
        fundamento_legal: "Art. 75, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 50000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Pichação ou grafite ilegal",
      },
    ],
  },
  {
    tipo_infracao: "UNIDADES DE CONSERVAÇÃO",
    infracoes: [
      {
        resumo: "Causar dano à UC ou sua zona de amortecimento",
        descricao_completa:
          "Causar dano direto ou indireto às Unidades de Conservação e às áreas de que trata o art. 27 do Decreto nº 99.274, de 6 de junho de 1990, independentemente de sua localização",
        fundamento_legal: "Art. 91, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 200.0,
        valor_maximo: 50000000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Danos a unidades de conservação",
      },
      {
        resumo: "Adentrar UC portando instrumentos de caça, pesca ou extração vegetal",
        descricao_completa:
          "Adentrar Unidades de Conservação conduzindo substâncias ou instrumentos próprios para caça, pesca ou para exploração de produtos ou subprodutos florestais e minerais, sem licença da autoridade competente, quando esta for exigível",
        fundamento_legal: "Art. 92, Decreto nº 7.315/2025",
        natureza_multa: "ABERTA",
        valor_minimo: 1000.0,
        valor_maximo: 10000.0,
        valor_por_unidade: null,
        unidade_de_medida: null,
        criterios_aplicacao: "Aplicar faixa de acordo com a gravidade",
        observacoes: "Entrada em UC com instrumentos proibidos",
      },
    ],
  },
]

// Normalizar dados com tipo computado
export const infracoesData: InfracaoBloco[] = rawData.map((bloco) => ({
  ...bloco,
  infracoes: bloco.infracoes.map((inf) => ({
    ...inf,
    _categoria: bloco.tipo_infracao,
    _tipo_multa_computado: detectTipoMulta(inf),
  })),
}))
