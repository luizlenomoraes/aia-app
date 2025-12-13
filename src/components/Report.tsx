import React from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../data/infractions';

export const Report = ({ onBack }: { onBack: () => void }) => {
  const { selectedInfraction, calculation, reportImages, setReportImages } = useApp();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setReportImages([...reportImages, ...newImages]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getBaseValueDisplay = () => {
    if (calculation.quantidade > 0 && selectedInfraction?.valor_por_unidade) {
      return `${calculation.quantidade} x ${formatMoney(selectedInfraction.valor_por_unidade)}`;
    }
    
    if (calculation.valorReferencia > 0 && calculation.percentualMaximo > 0) {
      const valorBaseCalculado = calculation.valorReferencia * (calculation.percentualMaximo / 100);
      const vMin = selectedInfraction?.valor_minimo || 0;
      return `${formatMoney(vMin)} (Mínimo) + ${formatMoney(valorBaseCalculado)} (Ref)`;
    }
    
    return 'Valor calculado conforme parâmetros';
  };

  return (
    <div className="p-4 pb-24 space-y-6 bg-gray-100 min-h-screen">
      {/* Paper Layout */}
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto print:shadow-none print:p-0 print:max-w-none">
        
        {/* Official Header */}
        <div className="flex flex-col items-center mb-8 border-b-2 border-yellow-500 pb-6">
          <div className="w-16 h-16 mb-3 flex items-center justify-center">
             <img src="/logo.png" alt="Brasão SEMA-AP" className="w-full h-full object-contain" onError={(e) => {
               e.currentTarget.style.display = 'none';
             }} />
          </div>
          <h1 className="text-xl font-bold text-green-900 uppercase tracking-wide text-center">Governo do Estado do Amapá</h1>
          <h2 className="text-lg font-semibold text-gray-700 text-center">Secretaria de Estado do Meio Ambiente</h2>
          <div className="mt-2 px-4 py-1 bg-green-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">
            Relatório de Fiscalização
          </div>
          <p className="text-xs text-gray-400 mt-2">Gerado em: {new Date().toLocaleString()}</p>
        </div>

        {/* Report Content */}
        <div className="space-y-8 font-serif text-sm text-gray-800">
          
          {/* Section 1: Infraction */}
          <section>
            <h4 className="font-sans font-bold text-green-900 border-b border-green-200 mb-3 uppercase text-xs tracking-wider">1. Detalhamento da Infração</h4>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="mb-3">
                  <span className="block font-bold text-gray-900 uppercase text-xs mb-1">Resumo da Infração</span>
                  <p className="text-gray-800 font-medium">{selectedInfraction?.resumo}</p>
                </div>
                <div className="mb-3">
                  <span className="block font-bold text-gray-900 uppercase text-xs mb-1">Fundamento Legal</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded inline-block">{selectedInfraction?.fundamento_legal}</span>
                </div>
                <div>
                  <span className="block font-bold text-gray-900 uppercase text-xs mb-1">Descrição Completa</span>
                  <p className="text-gray-600 italic border-l-2 border-gray-300 pl-3 text-xs leading-relaxed text-justify">
                    "{selectedInfraction?.descricao_completa}"
                  </p>
                </div>
            </div>
          </section>

          {/* Section 2: Calculation Memory */}
          <section>
            <h4 className="font-sans font-bold text-green-900 border-b border-green-200 mb-3 uppercase text-xs tracking-wider">2. Memória de Cálculo</h4>
            <div className="overflow-hidden border rounded-lg border-gray-200">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-700">Base de Cálculo</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {getBaseValueDisplay()}
                    </td>
                  </tr>
                  
                  {/* Agravantes Detail */}
                  <tr>
                    <td className="py-3 px-4 align-top">
                      <div className="font-semibold text-gray-700">Agravantes</div>
                      <div className="text-xs text-gray-500 mt-1">Acrescimo de 10% por item</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {calculation.agravantes.length > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-red-600 font-bold mb-1">+{calculation.agravantes.length * 10}%</span>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {calculation.agravantes.map(ag => (
                              <li key={ag} className="list-none">{ag}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>

                  {/* Atenuantes Detail */}
                  <tr>
                    <td className="py-3 px-4 align-top">
                      <div className="font-semibold text-gray-700">Atenuantes</div>
                      <div className="text-xs text-gray-500 mt-1">Redução conforme item</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {calculation.atenuantes.length > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="text-green-600 font-bold mb-1">
                            -{calculation.atenuantes.reduce((acc, curr) => acc + curr.percent, 0)}%
                          </span>
                          <ul className="text-xs text-gray-600">
                            {calculation.atenuantes.map((at, idx) => (
                              <li key={idx}>{at.label} ({at.percent}%)</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>

                  {/* Final Value */}
                  <tr className="bg-green-50 border-t-2 border-green-200">
                    <td className="py-4 px-4 font-bold text-green-900 text-lg uppercase">Valor Final da Multa</td>
                    <td className="py-4 px-4 text-right font-bold text-green-900 text-xl">
                      {formatMoney(calculation.valorFinal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Sanctions */}
          <section>
            <h4 className="font-sans font-bold text-green-900 border-b border-green-200 mb-3 uppercase text-xs tracking-wider">3. Sanções Administrativas Sugeridas</h4>
            <div className="flex flex-wrap gap-2">
              {calculation.sancoes.length > 0 ? calculation.sancoes.map(s => (
                <span key={s} className="bg-white text-gray-800 px-3 py-1 rounded border border-gray-300 font-medium text-xs uppercase shadow-sm">
                    {s}
                </span>
              )) : <span className="text-gray-400 italic">Nenhuma sanção adicional selecionada.</span>}
            </div>
          </section>

          {/* Section 4: Photos */}
          <section className="break-inside-avoid">
            <h4 className="font-sans font-bold text-green-900 border-b border-green-200 mb-3 uppercase text-xs tracking-wider">4. Registro Fotográfico</h4>
            
            {reportImages.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 print:hidden">
                    <i className="fas fa-image text-3xl mb-2"></i>
                    <p>Nenhuma foto anexada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                {reportImages.map((img, i) => (
                    <div key={i} className="aspect-video bg-gray-100 rounded border border-gray-200 overflow-hidden relative break-inside-avoid">
                        <img src={img} alt={`Evidência ${i+1}`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-2 py-1 w-full">
                            Evidência #{i+1}
                        </div>
                    </div>
                ))}
                </div>
            )}
            
            {/* Upload Button (Screen Only) */}
            <div className="mt-4 print:hidden text-center">
              <label className="bg-white border-2 border-blue-100 hover:border-blue-300 text-blue-600 font-bold py-3 px-6 rounded-lg inline-flex items-center cursor-pointer transition-all shadow-sm">
                <i className="fas fa-camera mr-2"></i> Anexar Fotos
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </section>

          {/* Signature Area (Print Only) */}
          <section className="hidden print:block mt-16 pt-8 break-inside-avoid">
             <div className="grid grid-cols-2 gap-12">
                 <div className="text-center">
                     <div className="border-t border-black mb-2"></div>
                     <p className="font-bold uppercase text-xs">Agente de Fiscalização</p>
                     <p className="text-[10px] text-gray-500">Matrícula</p>
                 </div>
                 <div className="text-center">
                     <div className="border-t border-black mb-2"></div>
                     <p className="font-bold uppercase text-xs">Responsável / Ciente</p>
                     <p className="text-[10px] text-gray-500">Assinatura</p>
                 </div>
             </div>
          </section>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 flex gap-3 z-50 print:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors uppercase text-sm tracking-wide"
        >
          Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="flex-[2] py-3 px-4 rounded-xl bg-green-900 text-white font-bold shadow-lg shadow-green-900/30 hover:bg-green-800 transition-all active:scale-95 flex items-center justify-center uppercase text-sm tracking-wide"
        >
          <i className="fas fa-print mr-2"></i> Imprimir / PDF
        </button>
      </div>
    </div>
  );
};