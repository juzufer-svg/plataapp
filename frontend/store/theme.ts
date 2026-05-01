'use client'

import { create } from 'zustand'

interface ThemeStore {
  dark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  dark: false,
  toggle: () =>
    set((state) => {
      const next = !state.dark
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', next)
      }
      return { dark: next }
    }),
  setDark: (dark: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', dark)
    }
    set({ dark })
  },
}))
