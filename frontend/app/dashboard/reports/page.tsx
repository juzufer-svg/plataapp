'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalIngresos: 0, totalGastos: 0, balance: 0,
    promedioMesGastos: 0,
    categoriaConMasGasto: { nombre: 'N/A', monto: 0 }
  })
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    fetchData()
  }, [currentMonth])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const [transRes, catRes] = await Promise.all([
        axios.get(`/api/v1/transacciones?mes=${currentMonth}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/v1/categorias', { headers: { Authorization: `Bearer ${token}` } })
      ])
      const trans = transRes.data
      const cats = catRes.data

      const totalIngresos = trans.filter((t: any) => t.tipo === 'ingreso').reduce((s: number, t: any) => s + t.monto, 0)
      const totalGastos = trans.filter((t: any) => t.tipo === 'gasto').reduce((s: number, t: any) => s + t.monto, 0)

      const gastosPorCat: Record<string, number> = {}
      trans.filter((t: any) => t.tipo === 'gasto').forEach((t: any) => {
        gastosPorCat[t.categoria_id] = (gastosPorCat[t.categoria_id] || 0) + t.monto
      })
      const topCatId = Object.entries(gastosPorCat).sort(([, a], [, b]) => b - a)[0]?.[0]
      const topCatName = cats.find((c: any) => c.id === topCatId)?.nombre || 'N/A'

      setStats({
        totalIngresos, totalGastos,
        balance: totalIngresos - totalGastos,
        promedioMesGastos: totalGastos / 30,
        categoriaConMasGasto: { nombre: topCatName, monto: gastosPorCat[topCatId || ''] || 0 }
      })
      setTransactions(trans)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const savingsRate = stats.totalIngresos > 0
    ? ((stats.balance / stats.totalIngresos) * 100).toFixed(1)
    : '0.0'
  const expenseRate = stats.totalIngresos > 0
    ? ((stats.totalGastos / stats.totalIngresos) * 100).toFixed(1)
    : '0.0'

  const statCards = [
    { label: 'Total Ingresos', value: `$${stats.totalIngresos.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: 'text-emerald-600', border: 'border-emerald-400', bg: 'bg-emerald-50', icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    )},
    { label: 'Total Gastos', value: `$${stats.totalGastos.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: 'text-red-600', border: 'border-red-400', bg: 'bg-red-50', icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
      </svg>
    )},
    { label: 'Balance Neto', value: `$${stats.balance.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600', border: stats.balance >= 0 ? 'border-blue-400' : 'border-orange-400', bg: stats.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50', icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    )},
    { label: 'Gasto Diario Prom.', value: `$${stats.promedioMesGastos.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: 'text-violet-600', border: 'border-violet-400', bg: 'bg-violet-50', icon: (
      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    )},
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Reportes y Análisis</h1>
          <p className="page-subtitle capitalize">
            {new Date(parseInt(currentMonth.split('-')[0]), parseInt(currentMonth.split('-')[1]) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { const [y, m] = currentMonth.split('-').map(Number); const d = new Date(y, m - 2); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`) }}
            className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <button onClick={() => { const [y, m] = currentMonth.split('-').map(Number); const d = new Date(y, m); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`) }}
            className="btn-primary">
            <span className="hidden sm:inline">Siguiente</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-24 animate-pulse bg-slate-100" />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, color, border, bg, icon }) => (
              <div key={label} className={`card p-4 border-l-4 ${border}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
                </div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Category */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" />
                  </svg>
                </div>
                Mayor Categoría de Gasto
              </h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.categoriaConMasGasto.nombre}</p>
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    ${stats.categoriaConMasGasto.monto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                  </svg>
                </div>
                Resumen del Período
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total de transacciones', value: String(transactions.length), color: '' },
                  { label: 'Tasa de gasto', value: `${expenseRate}%`, color: parseFloat(expenseRate) > 90 ? 'text-red-600' : 'text-slate-900' },
                  { label: 'Tasa de ahorro', value: `${savingsRate}%`, color: parseFloat(savingsRate) > 0 ? 'text-emerald-600' : 'text-red-600' },
                  { label: 'Ahorro neto', value: `$${stats.balance.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className={`text-sm font-bold ${color || 'text-slate-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions breakdown */}
          {transactions.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Distribución de Gastos vs Ingresos</h3>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-600 font-medium">Ingresos</span>
                    <span className="text-slate-500">{expenseRate !== '0.0' ? (100 - parseFloat(expenseRate)).toFixed(1) : 100}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-3 bg-emerald-500 rounded-full" style={{ width: `${stats.totalIngresos > 0 ? 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-600 font-medium">Gastos</span>
                    <span className="text-slate-500">{expenseRate}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-3 bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(parseFloat(expenseRate), 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
