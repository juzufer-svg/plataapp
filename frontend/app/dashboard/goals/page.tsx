'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import GoalProgressCard from '@/components/GoalProgressCard'
import { useRouter } from 'next/navigation'

interface Goal {
  id: string
  nombre: string
  monto_objetivo: number
  monto_actual: number
  fecha_objetivo: string
}

function EditGoalModal({ goal, onClose, onSaved }: { goal: Goal; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState({
    nombre: goal.nombre,
    monto_objetivo: String(goal.monto_objetivo),
    monto_actual: String(goal.monto_actual),
    fecha_objetivo: goal.fecha_objetivo,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/v1/metas/${goal.id}`, {
        nombre: formData.nombre,
        monto_objetivo: parseFloat(formData.monto_objetivo),
        monto_actual: parseFloat(formData.monto_actual),
        fecha_objetivo: formData.fecha_objetivo,
      }, { headers: { Authorization: `Bearer ${token}` } })
      onSaved()
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Editar Meta</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input type="text" value={formData.nombre} required
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Monto Objetivo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                <input type="number" value={formData.monto_objetivo} required step="0.01" min="1"
                  onChange={e => setFormData({ ...formData, monto_objetivo: e.target.value })}
                  className="input-field !pl-8" />
              </div>
            </div>
            <div>
              <label className="label">Ahorrado</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                <input type="number" value={formData.monto_actual} required step="0.01" min="0"
                  onChange={e => setFormData({ ...formData, monto_actual: e.target.value })}
                  className="input-field !pl-8" />
              </div>
            </div>
          </div>
          <div>
            <label className="label">Fecha Objetivo</label>
            <input type="date" value={formData.fecha_objetivo} required
              onChange={e => setFormData({ ...formData, fecha_objetivo: e.target.value })}
              className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-all">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', monto_objetivo: '', fecha_objetivo: '' })
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/auth/login'); return }
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/v1/metas', { headers: { Authorization: `Bearer ${token}` } })
      setGoals(res.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/v1/metas', {
        ...formData,
        monto_objetivo: parseFloat(formData.monto_objetivo)
      }, { headers: { Authorization: `Bearer ${token}` } })
      await fetchGoals()
      setShowForm(false)
      setFormData({ nombre: '', monto_objetivo: '', fecha_objetivo: '' })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('¿Eliminar esta meta?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/metas/${goalId}`, { headers: { Authorization: `Bearer ${token}` } })
      setGoals(goals.filter(g => g.id !== goalId))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const totalObjetivo = goals.reduce((s, g) => s + g.monto_objetivo, 0)
  const totalAhorrado = goals.reduce((s, g) => s + g.monto_actual, 0)
  const completadas = goals.filter(g => g.monto_actual >= g.monto_objetivo).length

  return (
    <div className="space-y-6">
      {editingGoal && <EditGoalModal goal={editingGoal} onClose={() => setEditingGoal(null)} onSaved={fetchGoals} />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Metas de Ahorro</h1>
          <p className="page-subtitle">{goals.length} metas · {completadas} completadas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18 18 6M6 6l12 12" : "M12 4.5v15m7.5-7.5h-15"} />
          </svg>
          {showForm ? 'Cancelar' : 'Nueva Meta'}
        </button>
      </div>

      {/* Summary row */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="card p-3 sm:p-4 border-l-4 border-blue-400 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Total Objetivo</p>
            <p className="text-sm sm:text-lg font-bold text-slate-900 mt-0.5 truncate">${totalObjetivo.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card p-3 sm:p-4 border-l-4 border-emerald-400 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Total Ahorrado</p>
            <p className="text-sm sm:text-lg font-bold text-emerald-600 mt-0.5 truncate">${totalAhorrado.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="card p-3 sm:p-4 border-l-4 border-violet-400 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Completadas</p>
            <p className="text-sm sm:text-lg font-bold text-violet-600 mt-0.5">{completadas} / {goals.length}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card p-6 animate-slide-in">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Nueva Meta de Ahorro</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="label">Nombre de la meta</label>
              <input type="text" value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required placeholder="Ej: Vacaciones, Auto..." className="input-field" />
            </div>
            <div>
              <label className="label">Monto Objetivo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                <input type="number" value={formData.monto_objetivo}
                  onChange={(e) => setFormData({ ...formData, monto_objetivo: e.target.value })}
                  required step="0.01" min="1" placeholder="0.00" className="input-field !pl-8" />
              </div>
            </div>
            <div>
              <label className="label">Fecha Objetivo</label>
              <input type="date" value={formData.fecha_objetivo}
                onChange={(e) => setFormData({ ...formData, fecha_objetivo: e.target.value })}
                required className="input-field" />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Creando...' : 'Crear Meta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="card h-52 animate-pulse bg-slate-100" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="card p-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700">Sin metas de ahorro</h3>
          <p className="text-sm text-slate-400 mt-1 mb-4">Establece objetivos financieros para alcanzar tus sueños</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Crear primera meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalProgressCard
              key={goal.id}
              nombre={goal.nombre}
              objetivo={goal.monto_objetivo}
              actual={goal.monto_actual}
              fechaObjetivo={goal.fecha_objetivo}
              onEdit={() => setEditingGoal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
