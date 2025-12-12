import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0)
  } catch {
    return `R$ ${(value || 0).toFixed(2).replace(".", ",")}`
  }
}

export function parseCurrency(value: string): number {
  if (!value) return 0
  // Remove tudo exceto números, pontos e vírgulas
  let cleaned = value.replace(/[^0-9.,-]/g, "")
  if (!cleaned) return 0

  // Se tem vírgula como decimal (formato BR), converte
  const parts = cleaned.split(",")
  if (parts.length > 1) {
    const dec = parts.pop()
    cleaned = parts.join("").replace(/[.]/g, "") + "." + dec
  } else {
    cleaned = cleaned.replace(/[.]/g, "")
  }

  const num = Number.parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

export function formatCurrencyInput(value: string): string {
  // Remove tudo exceto números
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""

  // Converte para número com 2 casas decimais
  const numValue = Number.parseInt(digits, 10) / 100

  // Formata no padrão brasileiro
  const formatted = numValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `R$ ${formatted}`
}
