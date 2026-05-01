'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { useAuthStore } from '@/store/auth'
import FinanzyLogo from '@/components/FinanzyLogo'

type Step = 'credentials' | 'verify'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setToken, setUser } = useAuthStore()
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── Paso 1: credenciales ──────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiClient.post('/api/v1/auth/login', { email, password })
      const data = res.data
      if (data.status === 'pending') {
        setInfo(data.message)
        setStep('verify')
      } else {
        // logged in directly
        setToken(data.access_token)
        setUser({ id: data.user_id, email, full_name: data.full_name })
        document.cookie = `token=${data.access_token}; path=/; max-age=1800; SameSite=Lax`
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Credenciales inválidas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Paso 2: código de verificación ────────────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const fullCode = code.join('')
    if (fullCode.length < 6) { setError('Ingresa los 6 dígitos'); return }
    setLoading(true)
    try {
      const res = await apiClient.post('/api/v1/auth/verify-email', { email, code: fullCode })
      setToken(res.data.access_token)
      setUser({ id: res.data.user_id, email, full_name: res.data.full_name })
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
    } catch {
      setError('No se pudo reenviar el código')
    }
  }

  const handleCodeInput = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = digit
    setCode(next)
    if (digit && i < 5) codeRefs.current[i + 1]?.focus()
  }

  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) codeRefs.current[i - 1]?.focus()
  }

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      codeRefs.current[5]?.focus()
    }
  }

  return (
    <>
      <div className="rounded-2xl shadow-2xl overflow-hidden"
           style={{background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)',
                   border: '1px solid rgba(0,184,156,0.25)'}}>
        {/* Header */}
        <div className="px-6 md:px-8 py-8 md:py-10 text-center"
             style={{background: 'rgba(13,27,75,0.45)', backdropFilter: 'blur(4px)'}}>
          <div className="flex justify-center mb-4">
            <FinanzyLogo variant="full" size={52} lightText />
          </div>
          <p className="text-sm md:text-base mt-2" style={{color: '#00B89C'}}>
            {step === 'credentials' ? 'Accede a tu cuenta' : 'Verifica tu identidad'}
          </p>
        </div>

        {/* Form */}
        <div className="px-6 md:px-8 py-6 md:py-8" style={{background: 'rgba(255,255,255,0.96)'}}>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-in flex gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {/* Info */}
          {info && !error && (
            <div className="mb-5 p-4 bg-teal-50 border-l-4 rounded-lg animate-slide-in flex gap-3"
                 style={{borderColor: '#00B89C'}}>
              <span>📧</span>
              <p className="text-sm font-medium" style={{color: '#0a7a6b'}}>{info}</p>
            </div>
          )}

          {/* ── STEP 1: credentials ── */}
          {step === 'credentials' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-900"
                    onFocus={e => e.target.style.borderColor = '#00B89C'}
                    onBlur={e => e.target.style.borderColor = ''}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-900"
                    onFocus={e => e.target.style.borderColor = '#00B89C'}
                    onBlur={e => e.target.style.borderColor = ''}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword
                      ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                      : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                      className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-6 shadow-lg flex items-center justify-center gap-2"
                      style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #00B89C 100%)'}}>
                {loading
                  ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Verificando...</span></>
                  : <><span>Iniciar Sesión</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                }
              </button>
            </form>
          )}

          {/* ── STEP 2: verification code ── */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                Ingresa el código de 6 dígitos enviado a<br/>
                <span className="font-semibold text-gray-800">{email}</span>
              </p>

              {/* 6-box code input */}
              <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { codeRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeInput(i, e.target.value)}
                    onKeyDown={e => handleCodeKey(i, e)}
                    className="w-11 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                    style={digit ? {borderColor: '#00B89C', color: '#0D1B4B'} : {}}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading}
                      className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-lg flex items-center justify-center gap-2"
                      style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #00B89C 100%)'}}>
                {loading
                  ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg><span>Verificando...</span></>
                  : <><span>Confirmar código</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></>
                }
              </button>

              <div className="text-center space-y-2">
                <button type="button" onClick={handleResend}
                        className="text-sm font-semibold hover:underline"
                        style={{color: '#00B89C'}}>
                  Reenviar código
                </button>
                <br/>
                <button type="button" onClick={() => { setStep('credentials'); setError(''); setInfo(''); setCode(['','','','','','']) }}
                        className="text-sm text-gray-500 hover:underline">
                  ← Volver
                </button>
              </div>
            </form>
          )}

          {/* Register link */}
          {step === 'credentials' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-500">O</span></div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  ¿No tienes cuenta?{' '}
                  <Link href="/auth/register"
                        className="font-bold hover:underline"
                        style={{color: '#00B89C'}}>
                    Regístrate aquí
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

