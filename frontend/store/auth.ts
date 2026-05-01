'use client'

import { create } from 'zustand'

interface AuthUser {
  id: string
  email: string
  full_name?: string
}

interface AuthStore {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  loadAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => {
  // Load auth from localStorage on initialization
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      })
    }
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    
    setToken: (token: string) => {
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
      set({ token, isAuthenticated: true })
    },
    
    setUser: (user: any) => {
      localStorage.setItem('user', JSON.stringify(user))
      set({ user })
    },
    
    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; max-age=0'
      set({ token: null, user: null, isAuthenticated: false })
    },
    
    loadAuth: () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
          })
        }
      }
    },
  }
})
