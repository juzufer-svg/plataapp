'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { useAuthStore } from '@/store/auth'
import FinanzyLogo from '@/components/FinanzyLogo'

type Step = 'form' | 'verify'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { setToken, setUser } = useAuthStore()
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── Paso 1: registro ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      const res = await apiClient.post('/api/v1/auth/register', {
        email, full_name: fullName, password,
      })
      setInfo(res.data.message)
      setStep('verify')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrarse. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Paso 2: verificación ──────────────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const fullCode = code.join('')
    if (fullCode.length < 6) { setError('Ingresa los 6 dígitos'); return }
    setLoading(true)
    try {
      const res = await apiClient.post('/api/v1/auth/verify-email', { email, code: fullCode })
      setToken(res.data.access_token)
      setUser({ id: res.data.user_id, email })
      document.cookie = `token=${res.data.access_token}; path=/; max-age=1800; SameSite=Lax`
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Código incorrecto o expirado')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(''); setInfo('')
    try {
      const res = await apiClient.post('/api/v1/auth/resend-code', { email })
      setInfo(res.data.message)
    } catch { setError('No se pudo reenviar el código') }
  }

  const handleCodeInput = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...code]; next[i] = digit; setCode(next)
    if (digit && i < 5) codeRefs.current[i + 1]?.focus()
  }
  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) codeRefs.current[i - 1]?.focus()
  }
  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setCode(pasted.split('')); codeRefs.current[5]?.focus() }
  }

  return (
    <>
      <div className="rounded-2xl shadow-2xl overflow-hidden"
           style={{background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
                   border: '1px solid rgba(0,184,156,0.25)'}}>
        {/* Header */}
        <div className="px-6 md:px-8 py-8 md:py-10 text-center"
             style={{background: 'rgba(13,27,75,0.45)', backdropFilter: 'blur(4px)'}}>
          <div className="flex justify-center mb-3">
            <FinanzyLogo variant="full" size={52} lightText />
          </div>
          <p className="text-sm mt-1" style={{color: '#00B89C'}}>
            {step === 'form' ? 'Crea tu cuenta gratis' : 'Verifica tu correo'}
          </p>
        </div>

        {/* Form body */}
        <div className="px-6 md:px-8 py-6 md:py-8" style={{background: 'rgba(255,255,255,0.96)'}}>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-in flex gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {info && !error && (
            <div className="mb-5 p-4 bg-teal-50 border-l-4 rounded-lg animate-slide-in flex gap-3"
                 style={{borderColor: '#00B89C'}}>
              <span>📧</span>
              <p className="text-sm font-medium" style={{color: '#0a7a6b'}}>{info}</p>
            </div>
          )}

          {/* ── PASO 1: registro ── */}
          {step === 'form' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                    </svg>
                  </div>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                         placeholder="Tu nombre completo"
                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                         onFocus={e => e.target.style.borderColor = '#00B89C'}
                         onBlur={e => e.target.style.borderColor = ''}
                         required minLength={2}/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                    </svg>
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                         placeholder="tu@correo.com"
                         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                         onFocus={e => e.target.style.borderColor = '#00B89C'}
                         onBlur={e => e.target.style.borderColor = ''}
                         required/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                    </svg>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} value={password}
                         onChange={e => setPassword(e.target.value)}
                         placeholder="Mínimo 6 caracteres"
                         className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                         onFocus={e => e.target.style.borderColor = '#00B89C'}
                         onBlur={e => e.target.style.borderColor = ''}
                         required minLength={6}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
                    </svg>
                  </div>
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                         onChange={e => setConfirmPassword(e.target.value)}
                         placeholder="Repite tu contraseña"
                         className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                         onFocus={e => e.target.style.borderColor = '#00B89C'}
                         onBlur={e => e.target.style.borderColor = ''}
                         required/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                      className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-6 shadow-lg flex items-center justify-center gap-2"
                      style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #00B89C 100%)'}}>
                {loading
                  ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Creando cuenta...</span></>
                  : <><span>Crear cuenta</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                }
              </button>
            </form>
          )}

          {/* ── PASO 2: código ── */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                Ingresa el código de 6 dígitos enviado a<br/>
                <span className="font-semibold text-gray-800">{email}</span>
              </p>

              <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input key={i}
                         ref={el => { codeRefs.current[i] = el }}
                         type="text" inputMode="numeric" maxLength={1} value={digit}
                         onChange={e => handleCodeInput(i, e.target.value)}
                         onKeyDown={e => handleCodeKey(i, e)}
                         className="w-11 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                         style={digit ? {borderColor: '#00B89C', color: '#0D1B4B'} : {}}/>
                ))}
              </div>

              <button type="submit" disabled={loading}
                      className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-lg flex items-center justify-center gap-2"
                      style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #00B89C 100%)'}}>
                {loading
                  ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Verificando...</span></>
                  : <><span>Activar cuenta</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></>
                }
              </button>

              <div className="text-center space-y-2">
                <button type="button" onClick={handleResend}
                        className="text-sm font-semibold hover:underline" style={{color: '#00B89C'}}>
                  Reenviar código
                </button>
                <br/>
                <button type="button"
                        onClick={() => { setStep('form'); setError(''); setInfo(''); setCode(['','','','','','']) }}
                        className="text-sm text-gray-500 hover:underline">
                  ← Volver
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
          {step === 'form' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-500">O</span></div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/auth/login" className="font-bold hover:underline" style={{color: '#00B89C'}}>
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-white text-sm mt-6 opacity-75">✨ Finanzy - Control a tu medida</p>

      <style>{`
        @keyframes slide-in { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        .animate-slide-in { animation: slide-in 0.3s ease-out }
      `}</style>
    </>
  )
}
