export interface Infraction {
  resumo: string;
  descricao_completa: string;
  fundamento_legal: string;
  natureza_multa: string;
  valor_minimo: number | null;
  valor_maximo: number | null;
  valor_por_unidade: number | null;
  unidade_de_medida: string | null;
  criterios_aplicacao: string;
  observacoes: string;
  duplicidade: boolean;
  tipos_relacionados: string[] | string;
  valor_fixo?: string;
  fixo?: string;
  // Computed fields
  _categoria?: string;
  _idx?: number;
  _tipo_multa_computado?: 'Aberta' | 'Fechada' | 'Fechada + Fechada' | 'Aberta + Fechada' | 'Aberta + Unidade';
}

export interface CalculationState {
  // Gravity
  voluntariedade: number; // 5 or 15
  meioAmbiente: number; // 5, 15, 30, 50, 70
  saudePublica: number; // 0, 5, 10, 15
  
  // Base Calc
  tipoInfracional: number; // 2M, 10M, 50M
  categoriaInfrator: number; // 0-4 index
  valorReferencia: number;
  percentualMaximo: number;
  
  // Modifiers
  agravantes: string[];
  atenuantes: { label: string; percent: number }[];
  
  // Closed/Specific Calcs
  quantidade: number;
  valorExcedente: number;
  
  // Final
  valorFinal: number;
  
  // Selected Sanctions
  sancoes: string[];
}

export interface OffenderData {
  nome: string;
  cpfcnpj: string;
  local: string;
  data: string;
  municipio: string;
  coord: string;
}
