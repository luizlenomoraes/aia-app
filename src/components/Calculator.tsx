import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../data/infractions';

// Updated labels with value ranges
const CATEGORY_LABELS = [
  "Pessoa Física - Baixa Renda (Hipossuficiente)",
  "PF/PJ - Renda/Receita até R$ 360.000,00/ano",
  "PF/PJ - Renda/Receita de R$ 360.000,01 a R$ 4.800.000,00/ano",
  "PF/PJ - Renda/Receita de R$ 4.800.000,01 a R$ 12.000.000,00/ano",
  "PF/PJ - Renda/Receita superior a R$ 12.000.000,00/ano"
];

const TETO_OPTIONS = [
  { value: '2000000', label: 'Até R$ 2.000.000,00' },
  { value: '10000000', label: 'De R$ 2.000.000,01 a R$ 10.000.000,00' },
  { value: '50000000', label: 'De R$ 10.000.000,01 a R$ 50.000.000,00' }
];

const REGRAS_PERCENTUAIS: any = {
  '2000000': { 
    A: [null, null, [0.1, 10], [0.2, 12], [0.3, 20]],
    B: [[0.1, 1], [1, 5], [4, 15], [7, 20], [10, 30]],
    C: [[1, 5.1], [5.1, 10], [16, 30], [21, 35], [31, 50]],
    D: [[5, 11], [11, 20], [31, 40], [36, 50], [51, 75]],
    E: [[11.1, 21], [21, 40], [41, 50], [51, 65], [76, 100]]
  },
  '10000000': {
    A: [null, null, [0.1, 7], [0.2, 10], [0.5, 15]],
    B: [[0.002, 0.5], [0.5, 1], [1, 10], [2, 15], [5, 25]],
    C: [[0.005, 1.1], [1.1, 2], [10.1, 20], [15.1, 30], [25.1, 50]],
    D: [[0.005, 2.1], [2.1, 3], [20.1, 30], [30.1, 45], [51, 75]],
    E: [[0.2, 3.1], [3.1, 5.5], [30.1, 40], [45.1, 60], [75.1, 100]]
  },
  '50000000': {
    A: [null, null, [0.01, 2], [0.02, 6], [0.05, 11]],
    B: [[0.002, 0.11], [0.11, 0.2], [1, 5], [2, 11], [5, 25]],
    C: [[0.001, 0.21], [0.21, 0.3], [5.1, 8], [11.1, 15], [25.1, 45]],
    D: [[0.03, 0.31], [0.31, 0.5], [8.1, 11], [15.1, 21], [45.1, 70]],
    E: [[0.1, 0.51], [0.51, 0.8], [11.1, 12], [21.1, 30], [70.1, 100]]
  }
};

const AGRAVANTES_LIST = [
  "Reincidência", "Vantagem pecuniária", "Coação de outrem", "Dano grave à saúde/ambiente",
  "Dano à propriedade alheia", "Em unidade de conservação", "Área urbana", "Período de defeso",
  "Domingos/feriados", "À noite", "Seca/inundações", "Espaço protegido", "Métodos cruéis",
  "Fraude/abuso de confiança", "Abuso de licença", "Interesse de PJ com verba pública",
  "Espécies ameaçadas", "Facilitada por funcionário público"
];

const ATENUANTES_LIST = [
  "Baixo grau de escolaridade", "Vulnerabilidade econômica", "Arrependimento eficaz",
  "Comunicação imediata de perigo", "Colaboração com fiscalização"
];

const SANCOES_LIST = [
  "Advertência", 
  "Multa Simples", 
  "Multa Diária", 
  "Apreensão", 
  "Embargo de Obra ou Atividade",
  "Suspensão de Atividades", 
  "Demolição de Obra", 
  "Destruição/Inutilização de Produto"
];

export const Calculator = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
  const { selectedInfraction, calculation, setCalculation } = useApp();
  const [isClosed, setIsClosed] = useState(false);
  // Local state for formatted currency input
  const [displayValue, setDisplayValue] = useState('');
  // Local state for percentage string to allow decimals
  const [percentStr, setPercentStr] = useState('');

  useEffect(() => {
    if (selectedInfraction) {
      const type = selectedInfraction._tipo_multa_computado?.toLowerCase() || 'aberta';
      setIsClosed(type.includes('fechada'));
      setCalculation(prev => ({
        ...prev,
        valorFinal: 0,
        sancoes: [],
        quantidade: 0,
        agravantes: [],
        atenuantes: []
      }));
      setDisplayValue('');
      setPercentStr('');
    }
  }, [selectedInfraction]);

  const updateCalc = (key: string, val: any) => {
    setCalculation(prev => ({ ...prev, [key]: val }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setDisplayValue("");
      updateCalc('valorReferencia', 0);
      return;
    }
    const floatVal = parseFloat(value) / 100;
    setDisplayValue(floatVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    updateCalc('valorReferencia', floatVal);
  };

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPercentStr(val);
    const num = parseFloat(val);
    updateCalc('percentualMaximo', isNaN(num) ? 0 : num);
  };

  const getGravityLevel = () => {
    const total = calculation.voluntariedade + calculation.meioAmbiente + calculation.saudePublica;
    if (total <= 20) return 'A';
    if (total <= 40) return 'B';
    if (total <= 60) return 'C';
    if (total <= 80) return 'D';
    return 'E';
  };

  const getAllowedPercentageRange = () => {
    const level = getGravityLevel();
    const cap = calculation.tipoInfracional; 
    const cat = calculation.categoriaInfrator;
    
    if(cap > 0 && cat >= 0 && REGRAS_PERCENTUAIS[cap]?.[level]?.[cat]) {
       const range = REGRAS_PERCENTUAIS[cap][level][cat];
       if (!range) return "Valor fixo ou não aplicável";
       return `Faixa permitida: ${range[0]}% a ${range[1]}%`;
    }
    return null;
  };

  const calculateFinal = () => {
    let final = 0;
    if (isClosed) {
      const vu = selectedInfraction?.valor_por_unidade || 0;
      final = vu * calculation.quantidade;
    } else {
      // Aberta calc
      const ref = calculation.valorReferencia;
      
      let maxVal = 0;
      // Simple logic to get value based on percentage
      // In a real app, we would validate if percentage is within range
      if (ref > 0 && calculation.percentualMaximo > 0) {
         maxVal = ref * (calculation.percentualMaximo / 100);
      }
      
      const vMin = selectedInfraction?.valor_minimo || 0;
      const base = vMin + maxVal;
      
      const agravCount = calculation.agravantes.length;
      let atenTotal = 0;
      calculation.atenuantes.forEach(a => atenTotal += a.percent);
      
      const netPct = (agravCount * 10) - atenTotal;
      final = base * (1 + (netPct / 100));
    }
    
    updateCalc('valorFinal', final);
    onNext();
  };

  if (!selectedInfraction) return <div>Nenhuma infração selecionada</div>;

  return (
    <div className="p-4 pb-32 space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="border-l-4 border-yellow-500 pl-4 mb-6">
          <h2 className="font-bold text-green-900 text-lg leading-tight">{selectedInfraction.resumo}</h2>
          <div className="text-xs font-mono text-gray-500 mt-1">{selectedInfraction.fundamento_legal}</div>
        </div>
        
        {/* Sanctions */}
        <div className="mb-8">
          <label className="flex items-center text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            <i className="fas fa-gavel mr-2 text-yellow-600"></i> Sanções Aplicáveis
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SANCOES_LIST.map(s => (
              <label key={s} className={`flex items-center space-x-3 text-sm p-3 border rounded-lg transition-colors cursor-pointer ${calculation.sancoes.includes(s) ? 'bg-green-50 border-green-500 text-green-900 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                <input 
                  type="checkbox" 
                  checked={calculation.sancoes.includes(s)}
                  onChange={e => {
                    const newS = e.target.checked 
                      ? [...calculation.sancoes, s]
                      : calculation.sancoes.filter(x => x !== s);
                    updateCalc('sancoes', newS);
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>

        {isClosed ? (
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-4 flex items-center">
              <i className="fas fa-calculator mr-2"></i> Cálculo (Multa Fechada)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-yellow-800 mb-1 uppercase">Valor Unitário</label>
                <div className="bg-white p-3 rounded border border-yellow-300 font-mono font-bold text-lg text-gray-900">
                  {formatMoney(selectedInfraction.valor_por_unidade)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-yellow-800 mb-1 uppercase">Quantidade ({selectedInfraction.unidade_de_medida || 'unid'})</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-yellow-400 bg-white rounded-lg text-lg font-mono text-gray-900 focus:ring-2 focus:ring-yellow-500 outline-none" 
                  value={calculation.quantidade || ''}
                  onChange={e => updateCalc('quantidade', parseFloat(e.target.value))}
                  placeholder="Informe a quantidade"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4 flex justify-between items-center">
                <span>1. DOSIMETRIA DA PENA</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                  Nível {getGravityLevel()}
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Voluntariedade</label>
                  <select className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" onChange={e => updateCalc('voluntariedade', parseInt(e.target.value))}>
                    <option value="0">Selecionar...</option>
                    <option value="5">Culposa (+5)</option>
                    <option value="15">Dolosa (+15)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Consequência Ambiental</label>
                  <select className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" onChange={e => updateCalc('meioAmbiente', parseInt(e.target.value))}>
                    <option value="0">Selecionar...</option>
                    <option value="5">Potencial (+5)</option>
                    <option value="15">Reduzida (+15)</option>
                    <option value="30">Fraca (+30)</option>
                    <option value="50">Moderada (+50)</option>
                    <option value="70">Grave (+70)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Saúde Pública</label>
                  <select className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" onChange={e => updateCalc('saudePublica', parseInt(e.target.value))}>
                    <option value="0">Selecionar...</option>
                    <option value="0">Nenhuma (+0)</option>
                    <option value="5">Fraca (+5)</option>
                    <option value="10">Moderada (+10)</option>
                    <option value="15">Significativa (+15)</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4">2. BASE DE CÁLCULO</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Teto da Multa</label>
                    <select className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none" onChange={e => updateCalc('tipoInfracional', parseInt(e.target.value))}>
                    <option value="0">Selecionar faixa de valor...</option>
                    {TETO_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Capacidade Econômica</label>
                    <select className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none text-sm" onChange={e => updateCalc('categoriaInfrator', parseInt(e.target.value))}>
                    <option value="-1">Selecionar capacidade...</option>
                    {CATEGORY_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                    </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Valor Referência</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 bg-white rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-green-500 outline-none" 
                      placeholder="R$ 0,00"
                      value={displayValue}
                      onChange={handleCurrencyChange}
                    />
                    <p className="text-[10px] text-gray-500">Valor da obra, empreendimento ou benefício.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Percentual (%)</label>
                    <input 
                      type="number"
                      step="any"
                      className="w-full p-3 border border-gray-300 bg-white rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-green-500 outline-none" 
                      placeholder="0"
                      value={percentStr}
                      onChange={handlePercentChange}
                    />
                    {getAllowedPercentageRange() && (
                        <p className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded inline-block mt-1">
                            {getAllowedPercentageRange()}
                        </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4">3. CIRCUNSTÂNCIAS</h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="font-bold text-red-800 text-xs uppercase mb-3 border-b border-red-200 pb-1">Agravantes (+10% cada)</div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {AGRAVANTES_LIST.map(ag => (
                      <label key={ag} className="flex items-start space-x-3 text-sm text-gray-800 cursor-pointer hover:bg-red-100 p-2 rounded-lg transition-colors">
                        <input 
                            type="checkbox" 
                            className="mt-0.5 w-4 h-4 rounded border-gray-400 text-red-600 focus:ring-red-500 bg-white" 
                            onChange={e => {
                                const newAg = e.target.checked ? [...calculation.agravantes, ag] : calculation.agravantes.filter(x => x !== ag);
                                updateCalc('agravantes', newAg);
                            }} 
                        />
                        <span className="leading-tight">{ag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="font-bold text-green-800 text-xs uppercase mb-3 border-b border-green-200 pb-1">Atenuantes</div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {ATENUANTES_LIST.map((at, idx) => (
                      <div key={at} className="flex items-center justify-between py-1 px-2 hover:bg-green-100 rounded-lg transition-colors">
                        <label className="flex items-center space-x-3 cursor-pointer flex-1">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-400 text-green-600 focus:ring-green-500 bg-white" 
                            onChange={e => {
                                const newAt = e.target.checked 
                                ? [...calculation.atenuantes, { label: at, percent: 5 }] 
                                : calculation.atenuantes.filter(x => x.label !== at);
                                updateCalc('atenuantes', newAt);
                            }} 
                          />
                          <span className="text-sm text-gray-800 leading-tight">{at}</span>
                        </label>
                        {calculation.atenuantes.find(x => x.label === at) && (
                          <div className="flex items-center ml-2">
                            <input 
                              type="number" 
                              className="w-14 p-1 border border-green-300 rounded text-right text-sm font-bold text-green-800 bg-white focus:ring-1 focus:ring-green-500 outline-none" 
                              defaultValue={5}
                              min={1} max={10}
                              onChange={e => {
                                const val = parseFloat(e.target.value);
                                const newAt = calculation.atenuantes.map(x => x.label === at ? { ...x, percent: val } : x);
                                updateCalc('atenuantes', newAt);
                              }}
                            />
                            <span className="text-xs ml-1 text-green-800 font-bold">%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold active:bg-gray-100 transition-colors uppercase tracking-wide text-sm"
        >
          Voltar
        </button>
        <button 
          onClick={calculateFinal}
          className="flex-[2] py-3 px-4 rounded-xl bg-green-900 text-white font-bold shadow-lg shadow-green-900/30 active:scale-95 transition-all uppercase tracking-wide text-sm flex items-center justify-center hover:bg-green-800"
        >
          <i className="fas fa-file-contract mr-2"></i> Calcular
        </button>
      </div>
    </div>
  );
};
