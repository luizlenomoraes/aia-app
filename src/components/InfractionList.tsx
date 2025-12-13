import React, { useState, useEffect } from 'react';
import { getNormalizedData, formatMoney } from '../data/infractions';
import { useApp } from '../context/AppContext';
import { Infraction } from '../types';

export const InfractionList = ({ onSelect }: { onSelect: () => void }) => {
  const { setSelectedInfraction } = useApp();
  const [data, setData] = useState<Infraction[]>([]);
  const [filtered, setFiltered] = useState<Infraction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const d = getNormalizedData();
    setData(d);
    setFiltered(d);
  }, []);

  useEffect(() => {
    let res = data;
    if (categoryFilter) {
      res = res.filter(i => i._categoria === categoryFilter);
    }
    if (typeFilter) {
      res = res.filter(i => (i._tipo_multa_computado || '').toLowerCase() === typeFilter.toLowerCase());
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      res = res.filter(i => 
        (i.resumo || '').toLowerCase().includes(lower) || 
        (i.descricao_completa || '').toLowerCase().includes(lower) ||
        (i.fundamento_legal || '').toLowerCase().includes(lower)
      );
    }
    setFiltered(res);
  }, [searchTerm, categoryFilter, typeFilter, data]);

  const categories = Array.from(new Set(data.map(i => i._categoria))).sort();

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Search Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-10 ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-green-900 flex items-center">
            <i className="fas fa-search text-yellow-600 mr-2 text-sm bg-yellow-100 p-2 rounded-full"></i> 
            Catálogo de Infrações
          </h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
            {filtered.length} itens
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar por infração, artigo ou palavra-chave..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-400"></i>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <select 
              className="flex-1 min-w-[160px] py-2 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 focus:border-green-500 outline-none"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas Categorias</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              className="flex-1 min-w-[130px] py-2 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 focus:border-green-500 outline-none"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">Todos Tipos</option>
              <option value="aberta">Multa Aberta</option>
              <option value="fechada">Multa Fechada</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              setSelectedInfraction(item);
              onSelect();
            }}
            className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden transition-all active:scale-[0.98] hover:shadow-md cursor-pointer"
          >
            {/* Left Border Indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item._tipo_multa_computado === 'Fechada' ? 'bg-yellow-500' : 'bg-green-600'}`}></div>

            <div className="pl-3">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                  item._tipo_multa_computado === 'Fechada' 
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {item._tipo_multa_computado || 'Aberta'}
                </span>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {item.fundamento_legal}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 group-hover:text-green-800 transition-colors">
                {item.resumo}
              </h3>
              
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
                {item.valor_minimo && (
                  <div className="flex items-center">
                    <i className="fas fa-tag mr-1 text-gray-300"></i>
                    <span>{formatMoney(item.valor_minimo)} {item.valor_maximo ? ` a ${formatMoney(item.valor_maximo)}` : ''}</span>
                  </div>
                )}
                {item.valor_por_unidade && (
                  <div className="flex items-center text-yellow-700 font-medium">
                    <i className="fas fa-coins mr-1"></i>
                    <span>{formatMoney(item.valor_por_unidade)} / {item.unidade_de_medida || 'unid'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-search text-gray-400 text-xl"></i>
            </div>
            <p className="text-gray-500 font-medium">Nenhuma infração encontrada.</p>
            <p className="text-xs text-gray-400">Tente buscar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  );
};