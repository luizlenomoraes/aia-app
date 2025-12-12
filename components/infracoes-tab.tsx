"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, X, ChevronRight, Scale, AlertCircle, CheckCircle, FileText } from "lucide-react"
import { infracoesData, type Infracao } from "@/lib/infracoes-data"
import { formatCurrency } from "@/lib/utils"

interface InfracoesTabProps {
  onSelectInfracao: (infracao: Infracao) => void
}

// CORREÇÃO: Função que preserva os incisos (I, II, etc) e remove apenas o Decreto
function formatFundamento(texto: string | undefined): string {
  if (!texto) return "Artigo";
  // Pega tudo antes da primeira vírgula seguida de "Decreto" ou apenas o texto se não tiver decreto
  return texto.split(/,\s*Decreto/i)[0].trim();
}

export function InfracoesTab({ onSelectInfracao }: InfracoesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInfracao, setSelectedInfracao] = useState<Infracao | null>(null)
  
  // Achata a lista para busca global
  const allInfracoes = useMemo(() => {
    return infracoesData.flatMap(bloco => bloco.infracoes);
  }, []);

  const filteredInfracoes = useMemo(() => {
    if (!searchQuery) return allInfracoes;
    
    const lowerQuery = searchQuery.toLowerCase();
    return allInfracoes.filter(inf => 
      (inf.resumo || "").toLowerCase().includes(lowerQuery) ||
      (inf.descricao_completa || "").toLowerCase().includes(lowerQuery) ||
      (inf.fundamento_legal || "").toLowerCase().includes(lowerQuery) ||
      (inf.artigo || "").toLowerCase().includes(lowerQuery)
    );
  }, [allInfracoes, searchQuery]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Barra de Busca */}
      <div className="relative z-10">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <Input
          type="search"
          placeholder="Buscar infração (ex: fauna, pesca, art 40)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-primary/30 focus-visible:ring-primary bg-white shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary p-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wide">
          {filteredInfracoes.length} Infrações encontradas
        </span>
      </div>

      {/* Lista de Resultados */}
      <ScrollArea className="flex-1 -mx-4 px-4 h-[calc(100vh-220px)]">
        <div className="space-y-3 pb-24 pt-1">
          {filteredInfracoes.length === 0 ? (
            <div className="text-center py-12 opacity-60 flex flex-col items-center">
              <div className="bg-muted p-4 rounded-full mb-3">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p>Nenhuma infração encontrada</p>
            </div>
          ) : (
            filteredInfracoes.map((inf, idx) => {
              // Garante que o fundamento legal seja exibido corretamente (Art + Inciso)
              const displayArtigo = formatFundamento(inf.fundamento_legal || inf.artigo);
              const isAberta = inf._tipo_multa_computado === 'aberta';

              return (
                <Card 
                  key={idx} 
                  onClick={() => setSelectedInfracao(inf)}
                  className="group cursor-pointer border-l-[6px] border-l-primary hover:shadow-md transition-all active:scale-[0.98] overflow-hidden bg-white mb-3 border-y-0 border-r-0 shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 space-y-2">
                        {/* Cabeçalho do Card: Artigo + Tipo */}
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-bold text-sm bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                            {displayArtigo}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            isAberta ? 'bg-[#1f5a33] text-white' : 'bg-[#4a3622] text-white'
                          }`}>
                            {isAberta ? 'Multa Aberta' : 'Multa Fechada'}
                          </span>
                        </div>
                        
                        {/* Resumo da Infração */}
                        <h3 className="text-sm font-medium text-foreground leading-snug">
                          {inf.resumo}
                        </h3>
                        
                        {/* Categoria */}
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                          {inf._categoria}
                        </p>
                      </div>
                      
                      <div className="h-full flex items-center justify-center">
                        <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Detalhes (Sheet) */}
      <Sheet open={!!selectedInfracao} onOpenChange={() => setSelectedInfracao(null)}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] px-0 pb-0 flex flex-col bg-[#f5f7f4]">
          <SheetHeader className="px-6 pt-6 pb-4 text-left border-b bg-white rounded-t-[20px]">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-white hover:bg-primary/90 text-sm py-1 px-3">
                {formatFundamento(selectedInfracao?.fundamento_legal || selectedInfracao?.artigo)}
              </Badge>
            </div>
            <SheetTitle className="text-lg leading-snug font-bold text-primary">
              {selectedInfracao?.resumo}
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-6 bg-[#f5f7f4]">
            <div className="py-6 space-y-6">
              
              {/* Card de Descrição */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Descrição Completa
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {selectedInfracao?.descricao_completa || selectedInfracao?.descricao}
                </p>
              </div>

              {/* Card de Valores */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Parâmetros da Multa
                </h4>
                
                {selectedInfracao?._tipo_multa_computado === 'aberta' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <span className="text-xs text-green-700 font-semibold block mb-1">Mínimo</span>
                      <span className="text-lg font-bold text-green-900 block">
                        {formatCurrency(selectedInfracao?.valor_minimo || 0)}
                      </span>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="text-xs text-red-700 font-semibold block mb-1">Máximo</span>
                      <span className="text-lg font-bold text-red-900 block">
                        {formatCurrency(selectedInfracao?.valor_maximo || 0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-orange-700 font-semibold block mb-1">Valor por Unidade</span>
                      <span className="text-xl font-bold text-orange-900">
                        {formatCurrency(selectedInfracao?.valor_por_unidade || 0)}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-white border-orange-200 text-orange-800">
                      {selectedInfracao?.unidade_de_medida || 'unidade'}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Observações */}
              {(selectedInfracao?.observacoes || selectedInfracao?.observacao) && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Observações
                  </h4>
                  <p className="text-sm text-blue-900">
                    {selectedInfracao.observacoes || selectedInfracao.observacao}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Botão de Ação */}
          <div className="p-4 border-t bg-white safe-area-bottom shadow-lg z-20">
            <Button 
              className="w-full h-14 text-base font-bold shadow-lg bg-primary hover:bg-primary/90 text-white rounded-xl" 
              onClick={() => {
                if(selectedInfracao) onSelectInfracao(selectedInfracao);
                setSelectedInfracao(null);
              }}
            >
              <CheckCircle className="mr-2 h-6 w-6" />
              Selecionar para Cálculo
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
