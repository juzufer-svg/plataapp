'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setDark } = useThemeStore()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDark(isDark)
  }, [setDark])

  return <>{children}</>
}
