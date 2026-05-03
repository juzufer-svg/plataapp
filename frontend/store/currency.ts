'use client'

import { create } from 'zustand'

interface CurrencyStore {
  currency: string
  setCurrency: (currency: string) => void
}

function loadCurrency(): string {
  if (typeof window === 'undefined') return 'USD'
  return localStorage.getItem('currency') || 'USD'
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: loadCurrency(),
  setCurrency: (currency: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency)
    }
    set({ currency })
  },
}))

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  MXN: '$',
  ARS: '$',
  COP: '$',
  CLP: '$',
}

// Currency names
export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'Dólar Estadounidense',
  EUR: 'Euro',
  MXN: 'Peso Mexicano',
  ARS: 'Peso Argentino',
  COP: 'Peso Colombiano',
  CLP: 'Peso Chileno',
}

// Available currencies
export const AVAILABLE_CURRENCIES = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
]
