'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import FinanzyLogo from '@/components/FinanzyLogo'

// SVG Icon components
const IconDashboard = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

const IconCreditCard = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
)

const IconBudget = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const IconGoal = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
  </svg>
)

const IconReport = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
  </svg>
)

const IconProfile = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)

const IconLogout = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
)

const IconWallet = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>
)

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
  { href: '/dashboard/transactions', label: 'Transacciones', Icon: IconCreditCard },
  { href: '/dashboard/budgets', label: 'Presupuestos', Icon: IconBudget },
  { href: '/dashboard/goals', label: 'Metas', Icon: IconGoal },
  { href: '/dashboard/reports', label: 'Reportes', Icon: IconReport },
  { href: '/dashboard/profile', label: 'Perfil', Icon: IconProfile },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const { isAuthenticated, logout, user, loadAuth } = useAuthStore()
  const { dark } = useThemeStore()

  useEffect(() => {
    loadAuth()
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.push('/auth/login')
  }, [hydrated, isAuthenticated, router])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (!hydrated) return null
  if (!isAuthenticated) return null

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <div className={`flex h-screen ${dark ? 'bg-slate-900' : 'bg-slate-100'}`}>
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className={`hidden md:flex flex-col ${sidebarOpen ? 'w-60' : 'w-16'} bg-slate-900 text-white transition-all duration-300 fixed h-screen left-0 top-0 z-40 shadow-xl`}>
        {/* Logo – Desktop Sidebar */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          {sidebarOpen ? (
            <FinanzyLogo variant="horizontal" size={32} lightText />
          ) : (
            <FinanzyLogo variant="icon" size={32} />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                title={!sidebarOpen ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-slate-700/60 p-3 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                {(user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.email || 'Usuario'}</p>
                <p className="text-xs text-slate-400">Cuenta activa</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); router.push('/') }}
            title={!sidebarOpen ? 'Cerrar sesión' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-150"
          >
            <IconLogout />
            {sidebarOpen && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-7 w-6 h-6 bg-slate-700 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-150 text-xs"
        >
          {sidebarOpen ? '‹' : '›'}
        </button>
      </aside>

      {/* ── Mobile Drawer overlay ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-white flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/60">
              <FinanzyLogo variant="horizontal" size={30} lightText />
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
              {menuItems.map(({ href, label, Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Drawer user + logout */}
            <div className="border-t border-slate-700/60 p-3 space-y-2">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                  {(user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{user?.email || 'Usuario'}</p>
                  <p className="text-xs text-slate-400">Cuenta activa</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); router.push('/') }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-150"
              >
                <IconLogout />
                <span className="text-sm font-medium">Cerrar sesión</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${sidebarOpen ? 'md:ml-60' : 'md:ml-16'}`}>
        {/* Top Header */}
        <header className={`border-b px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-1.5 rounded-lg mr-1 ${dark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <FinanzyLogo variant="horizontal" size={26} lightText={dark} />
            <span className={`hidden sm:inline ${dark ? 'text-slate-500' : 'text-slate-300'}`}>·</span>
            <span className={`hidden sm:inline text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Control Financiero Total</span>
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${dark ? 'bg-teal-900/40 text-teal-300 border border-teal-700/50' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
            <IconProfile />
            <span className="text-sm font-semibold hidden sm:inline">{user?.email || 'Usuario'}</span>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 overflow-auto p-3 md:p-6 pb-24 md:pb-6 ${dark ? 'bg-slate-900' : ''}`}>
          <div className="animate-fade-in max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t z-40 shadow-lg ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-6 h-16">
          {menuItems.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon />
                <span className="text-[9px] font-medium leading-none truncate px-0.5">
                  {label === 'Transacciones' ? 'Transacc.' : label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
