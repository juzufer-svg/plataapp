'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { useCurrencyStore, AVAILABLE_CURRENCIES } from '@/store/currency'
import apiClient from '@/lib/api-client'

type ToastType = 'success' | 'error'
interface Toast { msg: string; type: ToastType }

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const { currency, setCurrency } = useCurrencyStore()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [updatingCurrency, setUpdatingCurrency] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const setCurrencyRef = useRef(setCurrency)
  setCurrencyRef.current = setCurrency

  function showToast(msg: string, type: ToastType) {
    setToast({ msg, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!user) return
    apiClient.get('/api/v1/users/me')
      .then(res => {
        setUserInfo(res.data)
        // Keep local selection as source of truth for UI display currency.
        // Only hydrate from backend if there is no local value yet.
        const hasLocalCurrency = typeof window !== 'undefined' && !!localStorage.getItem('currency')
        if (res.data.currency && !hasLocalCurrency) {
          setCurrencyRef.current(res.data.currency)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError('')
    try {
      await apiClient.delete('/api/v1/users/me')
      logout()
      router.push('/')
    } catch {
      setDeleteError('No se pudo eliminar la cuenta. Intenta de nuevo.')
      setDeleting(false)
    }
  }

  async function handleCurrencyChange(newCurrency: string) {
    setUpdatingCurrency(true)
    // Actualizar localmente de inmediato (optimistic update)
    setCurrency(newCurrency)
    try {
      const res = await apiClient.put('/api/v1/users/me/currency', { currency: newCurrency })
      setUserInfo(res.data)
      showToast(`Moneda actualizada a ${AVAILABLE_CURRENCIES.find(c => c.code === newCurrency)?.name}`, 'success')
    } catch (error: any) {
      // Si el backend falla, la moneda igual queda guardada en localStorage
      const status = error?.response?.status
      if (status === 500 || status === 400) {
        showToast('No se pudo guardar en el servidor. La preferencia se guardó localmente.', 'error')
      } else {
        showToast(`Moneda cambiada a ${newCurrency} (guardada localmente)`, 'success')
      }
    } finally {
      setUpdatingCurrency(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Información de tu cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card p-6 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {(user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user?.full_name || user?.email || 'Usuario'}</p>
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Cuenta activa
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            Información de la cuenta
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}
            </div>
          ) : userInfo ? (
            <div className="space-y-4">
              {[
                { label: 'Nombre completo', value: userInfo.full_name, icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )},
                { label: 'Correo electrónico', value: userInfo.email, icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                )},
                { label: 'ID de cuenta', value: userInfo.id, mono: true, icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                  </svg>
                )},
              ].map(({ label, value, icon, mono }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className={`text-sm font-semibold text-slate-900 mt-0.5 ${mono ? 'font-mono text-xs break-all' : ''}`}>
                      {value || '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-slate-500">No se pudo cargar la información</p>
            </div>
          )}
        </div>
      </div>

      {/* Moneda */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Moneda
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_CURRENCIES.map(curr => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              disabled={updatingCurrency}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                currency === curr.code
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-900/10'
              }`}
            >
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 ${
                currency === curr.code
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {curr.symbol}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-bold ${currency === curr.code ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {curr.code}
                </p>
                <p className="text-xs text-slate-400 truncate">{curr.name}</p>
              </div>
              {currency === curr.code && (
                <svg className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
        {updatingCurrency && (
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            Guardando preferencia…
          </p>
        )}
      </div>

      {/* Apariencia */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
            </svg>
          </div>
          Apariencia
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tema de la interfaz</p>
            <p className="text-xs text-slate-400 mt-0.5">{dark ? 'Modo oscuro activado' : 'Modo claro activado'}</p>
          </div>
          <button
            onClick={toggle}
            className={`relative flex items-center gap-1 p-1 rounded-full transition-all duration-300 border-2 ${dark ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`}
            style={{ width: 76, height: 40 }}
            aria-label="Cambiar tema"
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${!dark ? 'bg-[#0D1B4B] text-white shadow-md scale-110' : 'text-slate-500'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
              </svg>
            </span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${dark ? 'bg-[#00B89C] text-white shadow-md scale-110' : 'text-slate-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="card p-5 border border-red-200 dark:border-red-900/50">
        <h2 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 pb-3 border-b border-red-100 dark:border-red-900/40 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 dark:bg-red-900/40 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          Zona de peligro
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Eliminar cuenta</p>
            <p className="text-xs text-slate-400 mt-0.5">Esta acción es permanente e irreversible</p>
          </div>
          <button
            onClick={() => { setShowDeleteModal(true); setDeleteConfirm(''); setDeleteError('') }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Eliminar tu cuenta?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Esta acción es <span className="font-semibold text-red-600">completamente irreversible</span>. Se borrarán todos tus datos, transacciones, presupuestos y metas. No hay vuelta atrás.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Para confirmar, escribe tu correo: <span className="text-slate-900 dark:text-white font-mono">{user?.email}</span>
              </label>
              <input
                type="email"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Tu correo electrónico"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            {deleteError && <p className="text-xs text-red-600 font-medium">{deleteError}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirm.toLowerCase() !== (user?.email || '').toLowerCase()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {deleting ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
