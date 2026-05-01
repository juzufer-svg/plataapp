'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { useAuthStore } from '@/store/auth'
import FinanzyLogo from '@/components/FinanzyLogo'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { setToken, setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Client-side validation
    if (username.length < 3) {
      setError('El usuario debe tener al menos 3 caracteres')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    setLoading(true)

    try {
      const response = await apiClient.post('/api/v1/auth/register', {
        username,
        password,
      })

      const user = response.data
      
      setUser(user)
      
      // Auto login after registration
      try {
        const loginResponse = await apiClient.post('/api/v1/auth/login', {
          username,
          password,
        })
        
        setToken(loginResponse.data.access_token)
        // Guardar en cookie para que el middleware pueda leerlo
        document.cookie = `token=${loginResponse.data.access_token}; path=/; max-age=1800; SameSite=Lax`
        router.push('/dashboard')
      } catch (err) {
        router.push('/auth/login')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrarse. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Card Container */}
      <div className="rounded-2xl shadow-2xl overflow-hidden" style={{background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,184,156,0.25)'}}>
        {/* Header */}
        <div className="px-6 md:px-8 py-8 md:py-10 text-center" style={{background: 'rgba(13, 27, 75, 0.45)', backdropFilter: 'blur(4px)'}}>
          <div className="flex justify-center mb-3">
            <FinanzyLogo variant="full" size={52} lightText />
          </div>
        </div>

        {/* Form Container */}
        <div className="px-6 md:px-8 py-6 md:py-8" style={{background: 'rgba(255,255,255,0.96)'}}>
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-in">
                <div className="flex">
                  <div className="text-red-500 mr-3">⚠️</div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Elige un nombre único"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                    onFocus={e => e.target.style.borderColor='#00B89C'}
                    onBlur={e => e.target.style.borderColor=''}
                    required
                    minLength={3}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres</p>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Elige una contraseña segura"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                    required
                    minLength={6}
                    onFocus={e => e.target.style.borderColor='#00B89C'}
                    onBlur={e => e.target.style.borderColor=''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                    required
                    onFocus={e => e.target.style.borderColor='#00B89C'}
                    onBlur={e => e.target.style.borderColor=''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-8 shadow-lg flex items-center justify-center gap-2"
                style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #00B89C 100%)'}}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <>
                    <span>Crear Cuenta</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-xs md:text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/auth/login" 
                className="text-transparent bg-clip-text font-bold hover:underline transition-all"
                style={{backgroundImage: 'linear-gradient(135deg, #0D1B4B, #00B89C)', WebkitBackgroundClip: 'text'}}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative text */}
      <p className="text-center text-white text-xs md:text-sm mt-4 md:mt-6 opacity-75">
        ✨ Finanzy - Control a tu medida
      </p>

      {/* Animated background elements */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
