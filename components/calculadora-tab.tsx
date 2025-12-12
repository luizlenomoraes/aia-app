"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  Calculator,
  Trash2,
  User,
  TreePine,
  Heart,
  Scale,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  X,
  Gavel,
} from "lucide-react"
import { regrasPercentuais, categoriasLabels, agravantesOptions, atenuantesOptions, sancoesOptions } from "@/lib/multa-data"
import { formatCurrency, parseCurrency, formatCurrencyInput } from "@/lib/utils"
import type { Infracao } from "@/lib/infracoes-data"

interface AtenuanteState {
  checked: boolean
  percent: number
}

interface CalculadoraTabProps {
  selectedInfracao: Infracao | null
  onClearSelection: () => void
}

export function CalculadoraTab({ selectedInfracao, onClearSelection }: CalculadoraTabProps) {
  // Step 0: Sanções
  const [sancoes, setSancoes] = useState<string[]>([])

  // Step 1: Gravidade
  const [voluntariedade, setVoluntariedade] = useState("")
  const [meioAmbiente, setMeioAmbiente] = useState("")
  const [saudePublica, setSaudePublica] = useState("")

  // Step 2: Tipo Infracional
  const [tipoInfracional, setTipoInfracional] = useState("")

  // Step 3: Categoria
  const [categoria, setCategoria] = useState("")
  const [valorMinimo, setValorMinimo] = useState("")
  const [valorReferencia, setValorReferencia] = useState("")
  const [percentualMaximo, setPercentualMaximo] = useState("")

  // Step 4: Agravantes
  const [agravantes, setAgravantes] = useState<string[]>([])

  // Step 5: Atenuantes
  const [atenuantes, setAtenuantes] = useState<Record<string, AtenuanteState>>({})

  // Result
  const [resultado, setResultado] = useState<any>(null)

  // Collapsible states
  const [openSections, setOpenSections] = useState({
    sancoes: true,
    gravidade: true,
    tipo: false,
    categoria: false,
    agravantes: false,
    atenuantes: false,
  })

  useEffect(() => {
    if (selectedInfracao) {
      if (selectedInfracao.valor_minimo) {
        setValorMinimo(formatCurrency(selectedInfracao.valor_minimo))
      }
      if (selectedInfracao._tipo_multa_computado === "aberta" && selectedInfracao.valor_maximo) {
        setValorReferencia(formatCurrency(selectedInfracao.valor_maximo))
      }
      setOpenSections((prev) => ({ ...prev, categoria: true }))
    }
  }, [selectedInfracao])

  const handleCurrencyInput = useCallback((value: string, setter: (val: string) => void) => {
    setter(formatCurrencyInput(value))
  }, [])

  // Calculations
  const pontuacao = useMemo(() => {
    const v = Number.parseInt(voluntariedade) || 0
    const m = Number.parseInt(meioAmbiente) || 0
    const s = Number.parseInt(saudePublica) || 0
    return v + m + s
  }, [voluntariedade, meioAmbiente, saudePublica])

  const nivelGravidade = useMemo(() => {
    if (pontuacao <= 20) return "A"
    if (pontuacao <= 40) return "B"
    if (pontuacao <= 60) return "C"
    if (pontuacao <= 80) return "D"
    return "E"
  }, [pontuacao])

  const categoriaOptions = useMemo(() => {
    if (!tipoInfracional || !nivelGravidade) return []
    const regras = regrasPercentuais[tipoInfracional as keyof typeof regrasPercentuais]
    if (!regras) return []
    const nivelRegras = regras[nivelGravidade as keyof typeof regras]
    if (!nivelRegras) return []

    return categoriasLabels
      .map((label, idx) => ({
        value: idx.toString(),
        label,
        disabled: nivelRegras[idx] === null,
        percentRange: nivelRegras[idx],
      }))
      .filter((opt) => !opt.disabled)
  }, [tipoInfracional, nivelGravidade])

  const percentRange = useMemo(() => {
    if (!tipoInfracional || !nivelGravidade || categoria === "") return null
    const regras = regrasPercentuais[tipoInfracional as keyof typeof regrasPercentuais]
    if (!regras) return null
    const nivelRegras = regras[nivelGravidade as keyof typeof regras]
    if (!nivelRegras) return null
    const catIdx = Number.parseInt(categoria)
    return nivelRegras[catIdx]
  }, [tipoInfracional, nivelGravidade, categoria])

  const valorMaximoCalculado = useMemo(() => {
    const ref = parseCurrency(valorReferencia)
    const percent = Number.parseFloat(percentualMaximo) || 0
    if (ref > 0 && percent > 0) {
      return ref * (percent / 100)
    }
    return 0
  }, [valorReferencia, percentualMaximo])

  const handleCalcular = () => {
    const valorMin = parseCurrency(valorMinimo)
    const valorMax = valorMaximoCalculado
    const multaBase = valorMin + valorMax

    const numAgravantes = agravantes.length
    const agravantesPercentual = numAgravantes * 10

    let atenuantesTotal = 0
    const atenuantesSelecionadas: { label: string; percent: number }[] = []

    Object.entries(atenuantes).forEach(([key, value]) => {
      if (value.checked && value.percent > 0) {
        atenuantesTotal += value.percent
        const option = atenuantesOptions.find((a) => a.id === key)
        if (option) {
          atenuantesSelecionadas.push({ label: option.label, percent: value.percent })
        }
      }
    })

    const percentualLiquido = agravantesPercentual - atenuantesTotal
    const valorFinal = multaBase * (1 + percentualLiquido / 100)

    const sancoesSelecionadas = sancoes.map(id => sancoesOptions.find(s => s.id === id)?.label).filter(Boolean)

    setResultado({
      nivel: nivelGravidade,
      pontuacao,
      voluntariedadeLabel: voluntariedade ? getVoluntariedadeLabel(voluntariedade) : "-",
      meioAmbienteLabel: meioAmbiente ? getMeioAmbienteLabel(meioAmbiente) : "-",
      saudePublicaLabel: saudePublica ? getSaudePublicaLabel(saudePublica) : "-",
      teto: tipoInfracional ? Number.parseFloat(tipoInfracional) : 0,
      categoriaLabel: categoria !== "" ? categoriasLabels[Number.parseInt(categoria)] : "-",
      valorMin,
      valorReferencia: parseCurrency(valorReferencia),
      valorMax,
      multaBase,
      numAgravantes,
      agravantesPercentual,
      atenuantesSelecionadas,
      atenuantesTotal,
      percentualLiquido,
      valorFinal,
      sancoes: sancoesSelecionadas,
    })
  }

  const handleLimpar = () => {
    setSancoes([])
    setVoluntariedade("")
    setMeioAmbiente("")
    setSaudePublica("")
    setTipoInfracional("")
    setCategoria("")
    setValorMinimo("")
    setValorReferencia("")
    setPercentualMaximo("")
    setAgravantes([])
    setAtenuantes({})
    setResultado(null)
    setOpenSections({
      sancoes: true,
      gravidade: true,
      tipo: false,
      categoria: false,
      agravantes: false,
      atenuantes: false,
    })
    onClearSelection()
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const canCalculate =
    voluntariedade && meioAmbiente && saudePublica && tipoInfracional && categoria !== "" && valorMinimo

  return (
    <div className="space-y-4">
      {selectedInfracao && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Infração Selecionada</span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{selectedInfracao.resumo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedInfracao.fundamento_legal}
                  </Badge>
                  <Badge variant={selectedInfracao._tipo_multa_computado === "aberta" ? "default" : "secondary"}>
                    {selectedInfracao._tipo_multa_computado === "aberta" ? "Aberta" : "Fechada"}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClearSelection} className="shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 0: Sanções */}
      <Collapsible open={openSections.sancoes} onOpenChange={() => toggleSection("sancoes")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                    0
                  </span>
                  Sanções Administrativas
                </span>
                <div className="flex items-center gap-2">
                   {sancoes.length > 0 && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {sancoes.length}
                    </span>
                  )}
                  <ChevronDown className={`w-5 h-5 transition-transform ${openSections.sancoes ? "rotate-180" : ""}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2 max-h-60 overflow-y-auto">
              {sancoesOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={sancoes.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSancoes((prev) => [...prev, option.id])
                      } else {
                        setSancoes((prev) => prev.filter((id) => id !== option.id))
                      }
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Step 1: Gravidade */}
      <Collapsible open={openSections.gravidade} onOpenChange={() => toggleSection("gravidade")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    1
                  </span>
                  Gravidade da Infração
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openSections.gravidade ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  Voluntariedade da Conduta
                </Label>
                <Select value={voluntariedade} onValueChange={setVoluntariedade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Culposa (+5 pontos)</SelectItem>
                    <SelectItem value="15">Dolosa (+15 pontos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <TreePine className="w-4 h-4 text-primary" />
                  Consequências ao Meio Ambiente
                </Label>
                <Select value={meioAmbiente} onValueChange={setMeioAmbiente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Potencial (+5 pontos)</SelectItem>
                    <SelectItem value="15">Reduzida (+15 pontos)</SelectItem>
                    <SelectItem value="30">Fraca (+30 pontos)</SelectItem>
                    <SelectItem value="50">Moderada (+50 pontos)</SelectItem>
                    <SelectItem value="70">Grave (+70 pontos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-primary" />
                  Consequências à Saúde Pública
                </Label>
                <Select value={saudePublica} onValueChange={setSaudePublica}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Não houve (+0 pontos)</SelectItem>
                    <SelectItem value="5">Fraca (+5 pontos)</SelectItem>
                    <SelectItem value="10">Moderada (+10 pontos)</SelectItem>
                    <SelectItem value="15">Significativa (+15 pontos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">
                  Pontuação Total: <span className="text-primary">{pontuacao} pontos</span>
                </p>
                <p className="text-sm font-medium">
                  Nível de Gravidade: <span className="text-primary">Nível {nivelGravidade}</span>
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Step 2: Tipo Infracional */}
      <Collapsible open={openSections.tipo} onOpenChange={() => toggleSection("tipo")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    2
                  </span>
                  Tipo Infracional (Teto)
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openSections.tipo ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Scale className="w-4 h-4 text-primary" />
                  Teto da Multa
                </Label>
                <Select value={tipoInfracional} onValueChange={setTipoInfracional}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2000000">Até R$ 2.000.000,00</SelectItem>
                    <SelectItem value="10000000">De R$ 2.000.000,01 até R$ 10.000.000,00</SelectItem>
                    <SelectItem value="50000000">De R$ 10.000.000,01 até R$ 50.000.000,00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Step 3: Categoria */}
      <Collapsible open={openSections.categoria} onOpenChange={() => toggleSection("categoria")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    3
                  </span>
                  Categoria do Infrator
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openSections.categoria ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  Categoria
                </Label>
                <Select value={categoria} onValueChange={setCategoria} disabled={categoriaOptions.length === 0}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categoriaOptions.length === 0 ? "Selecione tipo e gravidade primeiro" : "Selecione..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriaOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Valor Mínimo (R$)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={valorMinimo}
                  onChange={(e) => handleCurrencyInput(e.target.value, setValorMinimo)}
                />
              </div>

              {percentRange && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Percentual permitido:{" "}
                    <strong>
                      {percentRange[0]}% a {percentRange[1]}%
                    </strong>
                  </p>

                  <div className="space-y-2">
                    <Label className="text-sm">Valor de Referência (R$)</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      value={valorReferencia}
                      onChange={(e) => handleCurrencyInput(e.target.value, setValorReferencia)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Percentual (%)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={percentRange[0]}
                      max={percentRange[1]}
                      placeholder={`${percentRange[0]} - ${percentRange[1]}`}
                      value={percentualMaximo}
                      onChange={(e) => setPercentualMaximo(e.target.value)}
                    />
                  </div>

                  {valorMaximoCalculado > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium">
                        Valor Máximo Calculado:{" "}
                        <span className="text-primary">{formatCurrency(valorMaximoCalculado)}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Step 4: Agravantes */}
      <Collapsible open={openSections.agravantes} onOpenChange={() => toggleSection("agravantes")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    4
                  </span>
                  Agravantes (+10% cada)
                </span>
                <div className="flex items-center gap-2">
                  {agravantes.length > 0 && (
                    <span className="bg-destructive/10 text-destructive text-xs px-2 py-0.5 rounded-full">
                      {agravantes.length}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${openSections.agravantes ? "rotate-180" : ""}`}
                  />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto">
              {agravantesOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={agravantes.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAgravantes((prev) => [...prev, option.id])
                      } else {
                        setAgravantes((prev) => prev.filter((id) => id !== option.id))
                      }
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Step 5: Atenuantes */}
      <Collapsible open={openSections.atenuantes} onOpenChange={() => toggleSection("atenuantes")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer active:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    5
                  </span>
                  Atenuantes (1%-10% cada)
                </span>
                <div className="flex items-center gap-2">
                  {Object.values(atenuantes).filter((a) => a.checked).length > 0 && (
                    <span className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      {Object.values(atenuantes).filter((a) => a.checked).length}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${openSections.atenuantes ? "rotate-180" : ""}`}
                  />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  <strong>Regra especial:</strong> Para cada atenuante selecionada, indique um percentual entre 1% e
                  10%.
                </p>
              </div>

              {atenuantesOptions.map((option) => (
                <div key={option.id} className="p-3 rounded-lg border space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={atenuantes[option.id]?.checked || false}
                      onCheckedChange={(checked) => {
                        setAtenuantes((prev) => ({
                          ...prev,
                          [option.id]: {
                            checked: !!checked,
                            percent: prev[option.id]?.percent || 5,
                          },
                        }))
                      }}
                      className="mt-0.5"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>

                  {atenuantes[option.id]?.checked && (
                    <div className="flex items-center gap-2 ml-7">
                      <Input
                        type="number"
                        inputMode="decimal"
                        min="1"
                        max="10"
                        step="0.5"
                        value={atenuantes[option.id]?.percent || 5}
                        onChange={(e) => {
                          setAtenuantes((prev) => ({
                            ...prev,
                            [option.id]: {
                              ...prev[option.id],
                              percent: Number.parseFloat(e.target.value) || 5,
                            },
                          }))
                        }}
                        className="w-20 h-8 text-sm"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleCalcular} disabled={!canCalculate} className="flex-1 gap-2">
          <Calculator className="w-4 h-4" />
          Calcular Multa
        </Button>
        <Button onClick={handleLimpar} variant="outline" className="gap-2 bg-transparent">
          <Trash2 className="w-4 h-4" />
          Limpar
        </Button>
      </div>

      {/* Result */}
      {resultado && (
        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Resultado do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Gavel className="w-4 h-4 text-primary" />
                Sanções Aplicadas
              </h4>
              {resultado.sancoes && resultado.sancoes.length > 0 ? (
                <ul className="list-disc list-inside text-xs space-y-1">
                  {resultado.sancoes.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">Nenhuma sanção selecionada</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                Gravidade
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Nível:</span>
                <span className="font-medium">Nível {resultado.nivel}</span>
                <span className="text-muted-foreground">Pontuação:</span>
                <span className="font-medium">{resultado.pontuacao} pontos</span>
                <span className="text-muted-foreground">Voluntariedade:</span>
                <span className="font-medium text-xs">{resultado.voluntariedadeLabel}</span>
                <span className="text-muted-foreground">Meio Ambiente:</span>
                <span className="font-medium text-xs">{resultado.meioAmbienteLabel}</span>
                <span className="text-muted-foreground">Saúde Pública:</span>
                <span className="font-medium text-xs">{resultado.saudePublicaLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Teto da Multa:</span>
              <span className="font-medium">{formatCurrency(resultado.teto)}</span>
              <span className="text-muted-foreground">Categoria:</span>
              <span className="font-medium text-xs">{resultado.categoriaLabel}</span>
              <span className="text-muted-foreground">Valor Mínimo:</span>
              <span className="font-medium">{formatCurrency(resultado.valorMin)}</span>
              <span className="text-muted-foreground">Valor Referência:</span>
              <span className="font-medium">{formatCurrency(resultado.valorReferencia)}</span>
              <span className="text-muted-foreground">Valor Máximo:</span>
              <span className="font-medium">{formatCurrency(resultado.valorMax)}</span>
              <span className="text-muted-foreground">Multa Base:</span>
              <span className="font-medium">{formatCurrency(resultado.multaBase)}</span>
            </div>

            <div className="border-t pt-3 grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Agravantes:</span>
              <span className="font-medium">
                {resultado.numAgravantes} × 10% = {resultado.agravantesPercentual}%
              </span>
              <span className="text-muted-foreground">Atenuantes:</span>
              <span className="font-medium">
                {resultado.atenuantesSelecionadas.length} ({resultado.atenuantesTotal}%)
              </span>
              <span className="text-muted-foreground">Percentual Líquido:</span>
              <span className="font-medium">
                {resultado.percentualLiquido > 0 ? "+" : ""}
                {resultado.percentualLiquido}%
              </span>
            </div>

            {resultado.atenuantesSelecionadas.length > 0 && (
              <div className="bg-green-500/10 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2 text-green-700 dark:text-green-400">Atenuantes Aplicadas:</h4>
                {resultado.atenuantesSelecionadas.map((at: any, idx: number) => (
                  <p key={idx} className="text-xs text-green-700 dark:text-green-400">
                    • {at.label}: {at.percent}%
                  </p>
                ))}
              </div>
            )}

            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Valor Final da Multa</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(resultado.valorFinal)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getVoluntariedadeLabel(value: string) {
  const labels: Record<string, string> = {
    "5": "Culposa (+5 pontos)",
    "15": "Dolosa (+15 pontos)",
  }
  return labels[value] || value
}

function getMeioAmbienteLabel(value: string) {
  const labels: Record<string, string> = {
    "5": "Potencial (+5 pontos)",
    "15": "Reduzida (+15 pontos)",
    "30": "Fraca (+30 pontos)",
    "50": "Moderada (+50 pontos)",
    "70": "Grave (+70 pontos)",
  }
  return labels[value] || value
}

function getSaudePublicaLabel(value: string) {
  const labels: Record<string, string> = {
    "0": "Não houve (+0 pontos)",
    "5": "Fraca (+5 pontos)",
    "10": "Moderada (+10 pontos)",
    "15": "Significativa (+15 pontos)",
  }
  return labels[value] || value
}
