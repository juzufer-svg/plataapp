import React from 'react'
import { useCurrencyStore } from '@/store/currency'

interface BudgetCardProps {
  categoria: string
  limite: number
  gastado: number
  icono: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function BudgetCard({ categoria, limite, gastado, onEdit, onDelete }: BudgetCardProps) {
  const fmt = useCurrencyStore(s => s.fmt)
  const percentage = limite > 0 ? Math.min((gastado / limite) * 100, 100) : 0
  const remaining = limite - gastado

  const status = percentage >= 100 ? 'exceeded' : percentage >= 75 ? 'warning' : 'ok'

  const config = {
    ok:       { bar: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'En control', accent: 'border-emerald-400' },
    warning:  { bar: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       label: 'Cerca del límite', accent: 'border-amber-400' },
    exceeded: { bar: 'bg-red-500',     badge: 'bg-red-50 text-red-700 border-red-200',             label: 'Límite excedido', accent: 'border-red-400' },
  }

  const c = config[status]

  return (
    <div className={`card p-5 border-l-4 ${c.accent}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">{categoria}</h3>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${c.badge}`}>
              {c.label}
            </span>
          </div>
          <p className="text-xs text-slate-400">Presupuesto mensual</p>
        </div>
        <div className="flex-shrink-0 text-right ml-2 min-w-0 max-w-[45%]">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Límite</p>
          <p className="text-sm sm:text-lg font-bold text-slate-900 truncate">{fmt(limite)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Gastado: <span className="font-semibold text-slate-700">{fmt(gastado)}</span></span>
          <span className="font-semibold">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${c.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className={`flex items-center justify-between p-3 rounded-lg ${remaining >= 0 ? 'bg-slate-50' : 'bg-red-50'}`}>
        <span className="text-xs text-slate-500">{remaining >= 0 ? 'Disponible' : 'Excedido'}</span>
        <span className={`text-sm font-bold ${remaining >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
          {fmt(Math.abs(remaining))}
        </span>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100">
          {onEdit && (
            <button onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              Editar
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
