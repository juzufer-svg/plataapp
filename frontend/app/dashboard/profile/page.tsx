'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import apiClient from '@/lib/api-client'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    apiClient.get('/api/v1/users/me')
      .then(res => setUserInfo(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Información de tu cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="card p-6 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user?.username || 'Usuario'}</p>
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
                { label: 'Nombre de usuario', value: userInfo.username, icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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
    </div>
  )
}
