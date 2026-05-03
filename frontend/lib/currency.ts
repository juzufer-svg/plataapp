const CACHE_KEY = 'fx_rates_v1'
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours

// Fallback rates relative to USD (used if API fails)
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  MXN: 17.5,
  ARS: 1200,
  COP: 4150,
  CLP: 950,
}

export async function fetchRates(): Promise<Record<string, number>> {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { rates, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) return rates
      }
    } catch {}
  }
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?base=USD&symbols=USD,EUR,MXN,ARS,COP,CLP'
    )
    const data = await res.json()
    const rates: Record<string, number> = { USD: 1, ...data.rates }
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, ts: Date.now() }))
    }
    return rates
  } catch {
    return { ...FALLBACK_RATES }
  }
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to || amount === 0) return amount
  const r = Object.keys(rates).length ? rates : FALLBACK_RATES
  const rFrom = r[from] ?? FALLBACK_RATES[from] ?? 1
  const rTo = r[to] ?? FALLBACK_RATES[to] ?? 1
  return amount * (rTo / rFrom)
}

const CURRENCY_DISPLAY: Record<string, { symbol: string; locale: string; decimals: number }> = {
  USD: { symbol: 'US$', locale: 'en-US', decimals: 2 },
  EUR: { symbol: '€',   locale: 'de-DE', decimals: 2 },
  MXN: { symbol: 'MX$', locale: 'es-MX', decimals: 0 },
  ARS: { symbol: 'AR$', locale: 'es-AR', decimals: 0 },
  COP: { symbol: '$',   locale: 'es-CO', decimals: 0 },
  CLP: { symbol: '$',   locale: 'es-CL', decimals: 0 },
}

export function formatAmount(amount: number, currency: string): string {
  const cfg = CURRENCY_DISPLAY[currency] ?? { symbol: '$', locale: 'es-MX', decimals: 0 }
  return `${cfg.symbol}${amount.toLocaleString(cfg.locale, {
    maximumFractionDigits: cfg.decimals,
    minimumFractionDigits: 0,
  })}`
}
