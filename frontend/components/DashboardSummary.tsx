import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useCurrencyStore } from '@/store/currency'

interface SummaryCardProps {
  title: string
  value: number
  type: 'ingreso' | 'gasto' | 'balance'
}

function SummaryCard({ title, value, type }: SummaryCardProps) {
  const fmt = useCurrencyStore(s => s.fmt)
  const config = {
    ingreso: {
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      ring: 'ring-emerald-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      )
    },
    gasto: {
      gradient: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      text: 'text-red-600',
      ring: 'ring-red-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
        </svg>
      )
    },
    balance: {
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  }

  const c = config[type]
  const isNegative = type === 'balance' && value < 0

  return (
    <div className={`card overflow-hidden`}>
      <div className={`h-1 bg-gradient-to-r ${c.gradient}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center ${c.text}`}>
            {c.icon}
          </div>
        </div>
        <p className={`text-3xl font-bold tracking-tight ${isNegative ? 'text-red-600' : 'text-slate-900'}`}>
          {fmt(value)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Período actual</p>
      </div>
    </div>
  )
}

export default function DashboardSummary({ mes }: { mes: string }) {
  const [summary, setSummary] = useState({ ingresos: 0, gastos: 0, balance: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSummary() }, [mes])

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/v1/transacciones/resumen/${mes}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSummary(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card h-32 animate-pulse bg-slate-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard title="Ingresos" value={summary.ingresos} type="ingreso" />
      <SummaryCard title="Gastos" value={summary.gastos} type="gasto" />
      <SummaryCard title="Balance" value={summary.balance} type="balance" />
    </div>
  )
}
