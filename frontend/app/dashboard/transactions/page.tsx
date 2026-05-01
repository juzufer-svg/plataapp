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

const ICONOS = [
  // Comida y bebida
  '🛒','🍔','🍕','🍣','☕','🍺','🥗','🍷','🧃','🍰','🥩','🌮',
  // Transporte
  '🚗','🚌','🚇','✈️','🚕','⛽','🏍️','🚲','🛵','🚢','🚁','🛺',
  // Hogar
  '🏠','💡','🔧','🛋️','🧹','🚿','🏡','🔑','🪣','🛁','🪴','🛏️',
  // Salud y bienestar
  '💊','🏥','🦷','👁️','🧘','💉','🩺','🏃','🧬','🩹','🧠','🫀',
  // Mascotas
  '🐕','🐈','🐾','🦮','🐠','🐇','🐓','🦎','🐹','🐦','🐢','🐾',
  // Educación
  '🎓','📚','💻','📝','🎒','🏫','✏️','🔬','📐','🎨','🎭','🎤',
  // Entretenimiento
  '🎮','🎬','🎵','📺','🎧','🎲','🎯','🎪','🎠','🎡','🎸','🎻',
  // Ropa y personal
  '👗','👟','💄','👜','💍','🛍️','🧴','👒','👠','🕶️','⌚','💎',
  // Deportes
  '⚽','🏋️','🏊','🚴','🎾','⛷️','🥊','🤸','🏀','⚾','🏈','🎿',
  // Trabajo
  '💼','🖥️','📊','📋','🏢','📞','🤝','📧','🖨️','📠','🗂️','📌',
  // Finanzas
  '💰','💳','🏦','📈','💵','🪙','💹','🏧','💸','📉','🤑','💱',
  // Social y familia
  '🎁','🎉','🍽️','👨‍👩‍👧','❤️','👶','🌹','🎂','🥂','🎊','💝','🫂',
  // Naturaleza y viajes
  '🌿','🌍','🏖️','⛰️','🌅','🏕️','🌊','🗺️','🏯','🗽','🌋','🏝️',
  // Otros
  '⚡','📦','🔑','🛠️','🌟','❓','♻️','🔮','🧩','🪄','🎴','🃏',
]

function CategoriesManagerModal({ onClose, onChanged }: { onClose: () => void; onChanged: () => void }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', tipo: 'gasto' as 'gasto' | 'ingreso', icono: '🛒' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filterTipo, setFilterTipo] = useState<'todos' | 'gasto' | 'ingreso'>('todos')

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoadingCats(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/v1/categorias', { headers: { Authorization: `Bearer ${token}` } })
      setCategories(res.data)
    } catch { } finally { setLoadingCats(false) }
  }

  const openEdit = (cat: Category) => {
    setEditingId(cat.id)
    setFormData({ nombre: cat.nombre, tipo: cat.tipo as 'gasto' | 'ingreso', icono: cat.icono || '🛒' })
    setShowForm(true)
    setError('')
  }

  const openCreate = () => {
    setEditingId(null)
    setFormData({ nombre: '', tipo: 'gasto', icono: '🛒' })
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      if (editingId) {
        await axios.put(`/api/v1/categorias/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await axios.post('/api/v1/categorias', formData, { headers: { Authorization: `Bearer ${token}` } })
      }
      await fetchCategories()
      onChanged()
      setShowForm(false)
      setEditingId(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar la categoría')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/categorias/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setCategories(prev => prev.filter(c => c.id !== id))
      onChanged()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'No se pudo eliminar. Puede tener transacciones asociadas.')
    }
  }

  const displayed = filterTipo === 'todos' ? categories : categories.filter(c => c.tipo === filterTipo)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-base font-bold text-slate-900">Categorías</h3>
          <div className="flex items-center gap-2">
            <button onClick={openCreate}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
              + Nueva
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        </div>

        {/* Form (create/edit) */}
        {showForm && (
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">{editingId ? 'Editar categoría' : 'Nueva categoría'}</h4>
              <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
            </div>
            {error && <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(['gasto', 'ingreso'] as const).map(t => (
                  <label key={t} className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border-2 cursor-pointer text-xs font-semibold transition-all ${
                    formData.tipo === t
                      ? t === 'gasto' ? 'border-red-500 bg-red-50 text-red-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                    <input type="radio" className="hidden" checked={formData.tipo === t} onChange={() => setFormData(p => ({...p, tipo: t}))} />
                    {t === 'gasto' ? '↓' : '↑'} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                ))}
              </div>
              <input type="text" value={formData.nombre} onChange={e => setFormData(p => ({...p, nombre: e.target.value}))}
                placeholder="Nombre de la categoría" required maxLength={40}
                className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white" />
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Ícono: <span>{formData.icono}</span></p>
                <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto p-1.5 bg-white rounded-lg border border-slate-200">
                  {ICONOS.map(i => (
                    <button key={i} type="button" onClick={() => setFormData(p => ({...p, icono: i}))}
                      className={`text-base p-1 rounded transition-all ${formData.icono === i ? 'bg-blue-100 ring-2 ring-blue-400 scale-110' : 'hover:bg-slate-100'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors">
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear Categoría'}
              </button>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-1.5 px-5 pt-4 flex-shrink-0">
          {(['todos', 'gasto', 'ingreso'] as const).map(f => (
            <button key={f} onClick={() => setFilterTipo(f)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                filterTipo === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {f === 'todos' ? 'Todas' : f === 'gasto' ? 'Gastos' : 'Ingresos'}
            </button>
          ))}
        </div>

        {/* Lista de categorías */}
        <div className="flex-1 overflow-y-auto p-5 pt-3 space-y-2">
          {loadingCats ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">No hay categorías</p>
          ) : (
            displayed.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <span className="text-2xl flex-shrink-0">{cat.icono || '📁'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{cat.nombre}</p>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                    cat.tipo === 'gasto' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {cat.tipo === 'gasto' ? '↓ Gasto' : '↑ Ingreso'}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
  const _now = new Date()
  const [currentMonth, setCurrentMonth] = useState(`${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}`)
  const [showCategoriesManager, setShowCategoriesManager] = useState(false)
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
      {showCategoriesManager && (
        <CategoriesManagerModal
          onClose={() => setShowCategoriesManager(false)}
          onChanged={fetchData}
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
            onClick={() => setShowCategoriesManager(true)}
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
        <div className="card p-4 border-l-4 border-emerald-400 min-w-0 overflow-hidden">
          <p className="text-xs text-slate-500">Ingresos</p>
          <p className="text-xs font-bold text-emerald-600 mt-0.5 sm:text-xl truncate">${income.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-400 min-w-0 overflow-hidden">
          <p className="text-xs text-slate-500">Gastos</p>
          <p className="text-xs font-bold text-red-600 mt-0.5 sm:text-xl truncate">${expenses.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-400 min-w-0 overflow-hidden">
          <p className="text-xs text-slate-500">Balance</p>
          <p className={`text-xs font-bold mt-0.5 sm:text-xl truncate ${(income - expenses) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
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
