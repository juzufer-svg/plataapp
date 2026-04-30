import React from 'react'

interface GoalProgressCardProps {
  nombre: string
  objetivo: number
  actual: number
  fechaObjetivo: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function GoalProgressCard({ nombre, objetivo, actual, fechaObjetivo, onEdit, onDelete }: GoalProgressCardProps) {
  const percentage = objetivo > 0 ? Math.min((actual / objetivo) * 100, 100) : 0
  const inDays = Math.ceil((new Date(fechaObjetivo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const completed = percentage >= 100

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">{nombre}</h3>
          <p className={`text-xs mt-0.5 flex items-center gap-1 ${inDays > 0 ? 'text-slate-500' : 'text-red-500'}`}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {inDays > 0 ? `${inDays} días restantes` : 'Fecha vencida'}
          </p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${completed ? 'bg-emerald-100' : 'bg-blue-100'}`}>
          {completed ? (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Progreso</span>
          <span className={`font-bold ${completed ? 'text-emerald-600' : 'text-blue-600'}`}>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${completed ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Ahorrado', value: `$${actual.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: 'text-blue-600' },
          { label: 'Objetivo', value: `$${objetivo.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: 'text-slate-900' },
          { label: 'Falta', value: `$${Math.max(0, objetivo - actual).toLocaleString('es-MX', { maximumFractionDigits: 0 })}`, color: completed ? 'text-emerald-600' : 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-xs font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
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
