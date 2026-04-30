import React from 'react'

interface TransactionListProps {
  transactions: any[]
  categories: any[]
  onDelete?: (id: string) => void
  onEdit?: (transaction: any) => void
}

function CategoryIcon({ tipo }: { tipo: string }) {
  if (tipo === 'ingreso') {
    return (
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
      </svg>
    </div>
  )
}

export default function TransactionList({ transactions, categories, onDelete, onEdit }: TransactionListProps) {
  const getCategoryName = (categoryId: string) =>
    categories.find(c => c.id === categoryId)?.nombre || 'Sin categoría'

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700">Sin transacciones</h3>
        <p className="text-sm text-slate-400 mt-1">No hay registros en este período</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group"
        >
          <CategoryIcon tipo={transaction.tipo} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {getCategoryName(transaction.categoria_id)}
              </p>
              <span className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                transaction.tipo === 'ingreso'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {transaction.descripcion || 'Sin descripción'} · {transaction.fecha}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <p className={`text-sm font-bold ${
              transaction.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {transaction.tipo === 'ingreso' ? '+' : '-'}$
              {transaction.monto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </p>
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-50 rounded-lg transition-all text-slate-400 hover:text-blue-500"
                title="Editar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all text-slate-400 hover:text-red-500"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
