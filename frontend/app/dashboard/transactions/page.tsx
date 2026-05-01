'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { useRouter } from 'next/navigation'

interface Transaction {
  id: string
  categoria_id: string
  tipo: 'ingreso' | 'gasto'
  monto: number
  descripcion: string
  fecha: string
}

interface Category {
  id: string
  nombre: string
  tipo: string
  icono?: string
}

const ICONOS = ['🛒', '🍔', '🚗', '🏠', '💊', '🎓', '👗', '💡', '📱', '🎮', '✈️', '💼', '💰', '🎁', '🏋️', '📚']

function CategoryModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto')
  const [icono, setIcono] = useState('🛒')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/v1/categorias', { nombre, tipo, icono }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onCreated()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Nueva Categoría</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(['gasto', 'ingreso'] as const).map(t => (
                <label key={t} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-all ${
                  tipo === t
                    ? t === 'gasto' ? 'border-red-500 bg-red-50 text-red-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                  <input type="radio" className="hidden" checked={tipo === t} onChange={() => setTipo(t)} />
                  {t === 'gasto' ? '↓' : '↑'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre</label>
            <input
              type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Alimentación, Salario..." required maxLength={40}
              className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Icono */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Ícono</label>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONOS.map(i => (
                <button key={i} type="button" onClick={() => setIcono(i)}
                  className={`text-lg p-1.5 rounded-lg transition-all ${icono === i ? 'bg-blue-100 ring-2 ring-blue-400 scale-110' : 'hover:bg-slate-100'}`}>
                  {i}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Seleccionado: {icono}</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
            {loading ? 'Creando...' : 'Crear Categoría'}
          </button>
        </form>
      </div>
    </div>
  )
}

function EditTransactionModal({ transaction, categories, onClose, onSaved }: {
  transaction: Transaction
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const [formData, setFormData] = useState({
    categoria_id: transaction.categoria_id,
    monto: String(transaction.monto),
    descripcion: transaction.descripcion || '',
    fecha: transaction.fecha,
    tipo: transaction.tipo as 'gasto' | 'ingreso',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const filteredCats = categories.filter(c => c.tipo === formData.tipo)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/v1/transacciones/${transaction.id}`, {
        ...formData,
        monto: parseFloat(formData.monto)
      }, { headers: { Authorization: `Bearer ${token}` } })
      onSaved()
      onClose()
    } catch {
      setError('Error al actualizar la transacción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900">Editar Transacción</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(['gasto', 'ingreso'] as const).map(t => (
                <label key={t} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-all ${
                  formData.tipo === t
                    ? t === 'gasto' ? 'border-red-500 bg-red-50 text-red-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                  <input type="radio" className="hidden" checked={formData.tipo === t} onChange={() => setFormData(p => ({...p, tipo: t, categoria_id: ''}))} />
                  {t === 'gasto' ? '↓' : '↑'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Categoría</label>
            <select value={formData.categoria_id} onChange={e => setFormData(p => ({...p, categoria_id: e.target.value}))} required
              className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white">
              <option value="">Selecciona una categoría</option>
              {filteredCats.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
              <input type="number" value={formData.monto} onChange={e => setFormData(p => ({...p, monto: e.target.value}))}
                required step="0.01" min="0.01"
                className="w-full !pl-8 pr-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fecha</label>
            <input type="date" value={formData.fecha} onChange={e => setFormData(p => ({...p, fecha: e.target.value}))}
              required className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Descripción <span className="text-slate-400 font-normal">(opcional)</span></label>
            <textarea value={formData.descripcion} onChange={e => setFormData(p => ({...p, descripcion: e.target.value}))}
              rows={2} className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

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
      setTransactions(transRes.data)
      setCategories(catRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/transacciones/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setTransactions(transactions.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const income = transactions.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0)
  const expenses = transactions.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0)

  return (
    <div className="space-y-6">
      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCreated={fetchData}
        />
      )}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
          onSaved={fetchData}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Transacciones</h1>
          <p className="page-subtitle capitalize">
            {new Date(parseInt(currentMonth.split('-')[0]), parseInt(currentMonth.split('-')[1]) - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="btn-secondary flex items-center gap-1.5"
            title="Gestionar categorías"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h.008v.008H6V6Z" />
            </svg>
            Categorías
          </button>
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

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-emerald-400">
          <p className="text-xs text-slate-500">Ingresos</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">${income.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-400">
          <p className="text-xs text-slate-500">Gastos</p>
          <p className="text-xl font-bold text-red-600 mt-0.5">${expenses.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-400">
          <p className="text-xs text-slate-500">Balance</p>
          <p className={`text-xl font-bold mt-0.5 ${(income - expenses) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${(income - expenses).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm categories={categories} onSuccess={fetchData} />
        </div>
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Historial
                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-normal">
                  {transactions.length} registros
                </span>
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <TransactionList transactions={transactions} categories={categories} onDelete={handleDelete} onEdit={setEditingTransaction} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
