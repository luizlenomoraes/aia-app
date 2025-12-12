"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ChevronRight, X, FileText, Scale, AlertCircle, CheckCircle } from "lucide-react"
import { infracoesData, type Infracao } from "@/lib/infracoes-data"
import { formatCurrency } from "@/lib/utils"

interface InfracoesTabProps {
  onSelectInfracao: (infracao: Infracao) => void
}

function extractArtigo(fundamento: string | undefined): string {
  if (!fundamento) return ""
  const match = fundamento.match(/Art\.?\s*(\d+)/i)
  return match ? `Art. ${match[1]}` : ""
}

function getArtigoNumber(fundamento: string | undefined): number {
  if (!fundamento) return 9999
  const match = fundamento.match(/Art\.?\s*(\d+)/i)
  return match ? Number.parseInt(match[1], 10) : 9999
}

// Função para remover acentos e caracteres especiais para busca
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

export function InfracoesTab({ onSelectInfracao }: InfracoesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const [tipoMultaFilter, setTipoMultaFilter] = useState("")
  const [selectedInfracao, setSelectedInfracao] = useState<Infracao | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const categorias = useMemo(() => {
    const cats = new Set<string>()
    infracoesData.forEach((bloco) => cats.add(bloco.tipo_infracao))
    return Array.from(cats).sort()
  }, [])

  const filteredInfracoes = useMemo(() => {
    const allInfracoes: Infracao[] = []
    infracoesData.forEach((bloco) => {
      bloco.infracoes.forEach((inf) => {
        allInfracoes.push({
          ...inf,
          _categoria: bloco.tipo_infracao,
        })
      })
    })

    allInfracoes.sort((a, b) => getArtigoNumber(a.fundamento_legal) - getArtigoNumber(b.fundamento_legal))

    // Prepara o termo de busca normalizado
    const normalizedQuery = normalizeText(searchQuery)

    return allInfracoes.filter((inf) => {
      // Busca insensível a acentos
      const searchableText = `${inf.resumo || ""} ${inf.descricao_completa || ""} ${inf.fundamento_legal || ""}`
      const matchesSearch = !searchQuery || normalizeText(searchableText).includes(normalizedQuery)

      const matchesCategoria = !categoriaFilter || inf._categoria === categoriaFilter

      const matchesTipoMulta = !tipoMultaFilter || inf._tipo_multa_computado === tipoMultaFilter

      return matchesSearch && matchesCategoria && matchesTipoMulta
    })
  }, [searchQuery, categoriaFilter, tipoMultaFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setCategoriaFilter("")
    setTipoMultaFilter("")
  }

  const hasActiveFilters = searchQuery || categoriaFilter || tipoMultaFilter

  const handleSelectThisInfracao = () => {
    if (selectedInfracao) {
      onSelectInfracao(selectedInfracao)
      setSelectedInfracao(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar (ex: fauna, pesca, art 40)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-destructive" />}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredInfracoes.length} infrações
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Multa</label>
              <Select value={tipoMultaFilter} onValueChange={setTipoMultaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="aberta">Multa Aberta</SelectItem>
                  <SelectItem value="fechada">Multa Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-2 pr-2 pb-20">
          {filteredInfracoes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhuma infração encontrada.</p>
              </CardContent>
            </Card>
          ) : (
            filteredInfracoes.map((inf, idx) => (
              <Card
                key={idx}
                className="cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => setSelectedInfracao(inf)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {extractArtigo(inf.fundamento_legal) && (
                          <Badge variant="outline" className="text-xs font-semibold shrink-0">
                            {extractArtigo(inf.fundamento_legal)}
                          </Badge>
                        )}
                        <Badge
                          variant={inf._tipo_multa_computado === "aberta" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {inf._tipo_multa_computado === "aberta" ? "Aberta" : "Fechada"}
                        </Badge>
                      </div>
                      {/* Adicionado break-words para evitar estouro horizontal */}
                      <h3 className="font-medium text-sm leading-snug break-words mb-1">{inf.resumo}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{inf._categoria}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Detail Sheet */}
      <Sheet open={!!selectedInfracao} onOpenChange={() => setSelectedInfracao(null)}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-xl p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left pr-8">Detalhes da Infração</SheetTitle>
          </SheetHeader>
          
          {selectedInfracao && (
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              <div className="space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {extractArtigo(selectedInfracao.fundamento_legal) && (
                      <Badge variant="outline" className="text-sm font-semibold">
                        {extractArtigo(selectedInfracao.fundamento_legal)}
                      </Badge>
                    )}
                    <Badge className="text-xs break-all">{selectedInfracao._categoria}</Badge>
                  </div>
                  {/* Título com quebra de linha forçada */}
                  <h2 className="text-lg font-bold leading-snug break-words whitespace-normal">
                    {selectedInfracao.resumo}
                  </h2>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Descrição Completa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Descrição com quebra de linha e espaçamento */}
                    <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap leading-relaxed">
                      {selectedInfracao.descricao_completa}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Fundamento Legal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground break-words">
                      {selectedInfracao.fundamento_legal}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tipo de Multa</span>
                      <Badge variant={selectedInfracao._tipo_multa_computado === "aberta" ? "default" : "secondary"}>
                        {selectedInfracao._tipo_multa_computado === "aberta" ? "Aberta" : "Fechada"}
                      </Badge>
                    </div>

                    {selectedInfracao.valor_minimo != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Valor Mínimo</span>
                        <span className="font-medium">{formatCurrency(selectedInfracao.valor_minimo)}</span>
                      </div>
                    )}

                    {selectedInfracao.valor_maximo != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Valor Máximo</span>
                        <span className="font-medium">{formatCurrency(selectedInfracao.valor_maximo)}</span>
                      </div>
                    )}

                    {selectedInfracao.valor_por_unidade != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Valor por Unidade</span>
                        <span className="font-medium">{formatCurrency(selectedInfracao.valor_por_unidade)}</span>
                      </div>
                    )}

                    {selectedInfracao.unidade_de_medida && (
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm text-muted-foreground shrink-0">Unidade</span>
                        <span className="font-medium text-right text-sm">{selectedInfracao.unidade_de_medida}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedInfracao.criterios_aplicacao && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Critérios de Aplicação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground break-words">{selectedInfracao.criterios_aplicacao}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {selectedInfracao && (
            <div className="p-4 bg-background border-t mt-auto">
              <Button onClick={handleSelectThisInfracao} className="w-full gap-2 h-12 text-base shadow-lg">
                <CheckCircle className="w-5 h-5" />
                Selecionar esta Infração
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
