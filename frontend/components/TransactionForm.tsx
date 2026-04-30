import React, { useState } from 'react'
import axios from 'axios'

interface TransactionFormProps {
  categories: any[]
  onSuccess?: () => void
}

export default function TransactionForm({ categories, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    categoria_id: '',
    monto: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'gasto'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/v1/transacciones', {
        ...formData,
        monto: parseFloat(formData.monto)
      }, { headers: { Authorization: `Bearer ${token}` } })
      setFormData({ categoria_id: '', monto: '', descripcion: '', fecha: new Date().toISOString().split('T')[0], tipo: 'gasto' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => cat.tipo === formData.tipo)

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Nueva Transacción</h2>
          <p className="text-xs text-slate-500">Registra un ingreso o gasto</p>
        </div>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium animate-slide-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Transacción registrada
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="label">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            {['gasto', 'ingreso'].map(tipo => (
              <label key={tipo} className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm font-semibold ${
                formData.tipo === tipo
                  ? tipo === 'gasto'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}>
                <input type="radio" name="tipo" value={tipo} checked={formData.tipo === tipo}
                  onChange={handleChange} className="hidden" />
                {tipo === 'gasto' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  </svg>
                )}
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="label">Categoría</label>
          <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required className="input-field">
            <option value="">Selecciona una categoría</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No hay categorías para este tipo</p>
          )}
        </div>

        {/* Monto */}
        <div>
          <label className="label">Monto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
            <input type="number" name="monto" value={formData.monto} onChange={handleChange}
              required step="0.01" min="0.01" placeholder="0.00"
              className="input-field !pl-8" />
          </div>
        </div>

        {/* Fecha */}
        <div>
          <label className="label">Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="input-field" />
        </div>

        {/* Descripción */}
        <div>
          <label className="label">Descripción <span className="text-slate-400 font-normal">(opcional)</span></label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}
            className="input-field resize-none" rows={2} placeholder="Añade una nota..." />
        </div>

        <button type="submit" disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
            loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
          }`}>
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Registrar Transacción
            </>
          )}
        </button>
      </form>
    </div>
  )
}
