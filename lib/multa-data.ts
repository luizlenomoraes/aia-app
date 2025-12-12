export const regrasPercentuais = {
  "2000000": {
    // Até 2 milhões
    A: [null, null, [0.1, 10], [0.2, 12], [0.3, 20]],
    B: [
      [0.1, 1],
      [1, 5],
      [4, 15],
      [7, 20],
      [10, 30],
    ],
    C: [
      [1, 5.1],
      [5.1, 10],
      [16, 30],
      [21, 35],
      [31, 50],
    ],
    D: [
      [5, 11],
      [11, 20],
      [31, 40],
      [36, 50],
      [51, 75],
    ],
    E: [
      [11.1, 21],
      [21, 40],
      [41, 50],
      [51, 65],
      [76, 100],
    ],
  },
  "10000000": {
    // 2M a 10M
    A: [null, null, [0.1, 7], [0.2, 10], [0.5, 15]],
    B: [
      [0.002, 0.5],
      [0.5, 1],
      [1, 10],
      [2, 15],
      [5, 25],
    ],
    C: [
      [0.005, 1.1],
      [1.1, 2],
      [10.1, 20],
      [15.1, 30],
      [25.1, 50],
    ],
    D: [
      [0.005, 2.1],
      [2.1, 3],
      [20.1, 30],
      [30.1, 45],
      [51, 75],
    ],
    E: [
      [0.2, 3.1],
      [3.1, 5.5],
      [30.1, 40],
      [45.1, 60],
      [75.1, 100],
    ],
  },
  "50000000": {
    // 10M a 50M
    A: [null, null, [0.01, 2], [0.02, 6], [0.05, 11]],
    B: [
      [0.002, 0.11],
      [0.11, 0.2],
      [1, 5],
      [2, 11],
      [5, 25],
    ],
    C: [
      [0.001, 0.21],
      [0.21, 0.3],
      [5.1, 8],
      [11.1, 15],
      [25.1, 45],
    ],
    D: [
      [0.03, 0.31],
      [0.31, 0.5],
      [8.1, 11],
      [15.1, 21],
      [45.1, 70],
    ],
    E: [
      [0.1, 0.51],
      [0.51, 0.8],
      [11.1, 12],
      [21.1, 30],
      [70.1, 100],
    ],
  },
} as const

export const categoriasLabels = [
  "Pessoa física de baixa renda",
  "Pessoa física ou jurídica até R$ 360.000,00/ano",
  "Entre R$ 360.000,01 e R$ 4.800.000,00/ano",
  "Entre R$ 4.800.000,01 e R$ 12.000.000,00/ano",
  "Acima de R$ 12.000.000,01/ano",
]

export const agravantesOptions = [
  { id: "ag1", label: "Reincidência em infrações ou crimes ambientais" },
  { id: "ag2", label: "Para obter vantagem pecuniária" },
  { id: "ag3", label: "Coagindo outrem para a execução da infração" },
  { id: "ag4", label: "Afetando ou expondo a perigo, de maneira grave, a saúde pública ou o meio ambiente" },
  { id: "ag5", label: "Concorrendo para danos à propriedade alheia" },
  { id: "ag6", label: "Atuando em unidades de conservação ou áreas de uso especial" },
  { id: "ag7", label: "Atuando em áreas urbanas ou assentamentos humanos" },
  { id: "ag8", label: "Em período de defeso à fauna" },
  { id: "ag9", label: "Em domingos ou feriados" },
  { id: "ag10", label: "À noite" },
  { id: "ag11", label: "Em épocas de seca ou inundações" },
  { id: "ag12", label: "No interior do espaço territorial especialmente protegido" },
  { id: "ag13", label: "Com o emprego de métodos cruéis para abate ou captura de animais" },
  { id: "ag14", label: "Mediante fraude ou abuso de confiança" },
  { id: "ag15", label: "Mediante abuso do direito de licença, permissão ou autorização ambiental" },
  {
    id: "ag16",
    label:
      "No interesse de pessoa jurídica mantida, total ou parcialmente, por verbas públicas ou beneficiada por incentivos fiscais",
  },
  { id: "ag17", label: "Atingindo espécies ameaçadas, listadas em relatórios oficiais das autoridades competentes" },
  { id: "ag18", label: "Facilitada por funcionário público no exercício de suas funções" },
]

export const atenuantesOptions = [
  { id: "at1", label: "Baixo grau de escolaridade ou compreensão" },
  { id: "at2", label: "Vulnerabilidade econômica e social" },
  { id: "at3", label: "Arrependimento eficaz (reparação do dano)" },
  { id: "at4", label: "Comunicação imediata do perigo ambiental" },
  { id: "at5", label: "Colaboração com a fiscalização" },
]
