'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import DashboardSummary from '@/components/DashboardSummary'
import TransactionList from '@/components/TransactionList'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    fetchData()
  }, [currentMonth])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [transRes, catRes] = await Promise.all([
        axios.get(`/api/v1/transacciones?mes=${currentMonth}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/v1/categorias', { headers: { Authorization: `Bearer ${token}` } })
      ])
      setTransactions(transRes.data)
      setCategories(catRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const d = new Date(y, m - 2)
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const d = new Date(y, m)
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Cargando datos...</p>
        </div>
      </div>
    )
  }

  const quickLinks = [
    {
      href: '/dashboard/transactions',
      label: 'Transacciones',
      desc: 'Registra y gestiona tus movimientos',
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300',
      iconColor: 'text-blue-600 bg-blue-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      )
    },
    {
      href: '/dashboard/budgets',
      label: 'Presupuestos',
      desc: 'Controla tus límites mensuales',
      color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300',
      iconColor: 'text-emerald-600 bg-emerald-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      href: '/dashboard/goals',
      label: 'Metas de Ahorro',
      desc: 'Establece y sigue tus objetivos',
      color: 'bg-violet-50 border-violet-100 hover:border-violet-300',
      iconColor: 'text-violet-600 bg-violet-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      )
    },
    {
      href: '/dashboard/reports',
      label: 'Reportes',
      desc: 'Analiza tus finanzas en detalle',
      color: 'bg-amber-50 border-amber-100 hover:border-amber-300',
      iconColor: 'text-amber-600 bg-amber-100',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
        </svg>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen de tu actividad financiera</p>
      </div>

      {/* Month Selector */}
      <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Período</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5 capitalize">
            {new Date(parseInt(currentMonth.split('-')[0]), parseInt(currentMonth.split('-')[1]) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePreviousMonth} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <button onClick={handleNextMonth} className="btn-primary">
            <span className="hidden sm:inline">Siguiente</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummary mes={currentMonth} />

      {/* Recent Transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Transacciones Recientes</h2>
            <p className="text-xs text-slate-500 mt-0.5">Últimas 5 transacciones del período</p>
          </div>
          <Link href="/dashboard/transactions" className="btn-primary text-xs">
            Ver todas
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        <TransactionList transactions={transactions.slice(0, 5)} categories={categories} />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="section-title">Acceso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, label, desc, color, iconColor, icon }) => (
            <Link
              key={href}
              href={href}
              className={`card-hover p-5 flex flex-col gap-3 border ${color} transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
                {icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
