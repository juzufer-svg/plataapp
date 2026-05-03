'use client'

import { create } from 'zustand'
import { fetchRates, convertAmount, formatAmount, FALLBACK_RATES } from '@/lib/currency'

interface CurrencyStore {
  currency: string        // display currency (what user selected)
  baseCurrency: string    // the currency data is stored in (set once)
  rates: Record<string, number>
  ratesLoaded: boolean
  setCurrency: (currency: string) => void
  initBaseCurrency: (currency: string) => void
  loadRates: () => Promise<void>
  fmt: (amount: number) => string
  convert: (amount: number) => number
}

function readStorage(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return localStorage.getItem(key) ?? fallback
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currency: readStorage('currency', 'USD'),
  baseCurrency: readStorage('base_currency', readStorage('currency', 'USD')),
  rates: {},
  ratesLoaded: false,

  setCurrency: (currency: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('currency', currency)
    set({ currency })
  },

  // Sets the base currency ONCE (only if not already stored)
  initBaseCurrency: (currency: string) => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('base_currency')) {
      localStorage.setItem('base_currency', currency)
      set({ baseCurrency: currency })
    }
  },

  loadRates: async () => {
    if (get().ratesLoaded) return
    const rates = await fetchRates()
    set({ rates, ratesLoaded: true })
  },

  convert: (amount: number) => {
    const { currency, baseCurrency, rates } = get()
    const r = Object.keys(rates).length ? rates : FALLBACK_RATES
    return convertAmount(amount, baseCurrency, currency, r)
  },

  fmt: (amount: number) => {
    const { currency, baseCurrency, rates } = get()
    const r = Object.keys(rates).length ? rates : FALLBACK_RATES
    const converted = convertAmount(amount, baseCurrency, currency, r)
    return formatAmount(converted, currency)
  },
}))

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: 'US$',
  EUR: '€',
  MXN: 'MX$',
  ARS: 'AR$',
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
  { code: 'USD', name: 'Dólar Estadounidense', symbol: 'US$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: 'MX$' },
  { code: 'ARS', name: 'Peso Argentino', symbol: 'AR$' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
]

