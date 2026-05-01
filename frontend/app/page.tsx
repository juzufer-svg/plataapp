import Link from 'next/link'
import FinanzyLogo from '@/components/FinanzyLogo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6">
        <div className="flex items-center shrink-0">
          <FinanzyLogo variant="horizontal" size={36} lightText className="hidden md:flex" />
          <FinanzyLogo variant="horizontal" size={28} lightText className="flex md:hidden" />
        </div>
        <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
          <Link href="/auth/login" className="px-2.5 md:px-6 py-1.5 md:py-2 text-xs md:text-base text-white hover:text-blue-200 transition font-medium whitespace-nowrap">
            Iniciar Sesión
          </Link>
          <Link href="/auth/register" className="px-2.5 md:px-6 py-1.5 md:py-2 text-xs md:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium whitespace-nowrap">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Gestiona tus 
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent"> finanzas </span>
            con facilidad
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-blue-100 mb-8 md:mb-12 leading-relaxed px-2">
            Finanzy es tu solución completa para controlar gastos, presupuestos y metas financieras. 
            Toma el control de tu dinero hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center mb-10 md:mb-12">
            <Link href="/auth/register" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 text-center">
              Comenzar Gratis
            </Link>
            <Link href="https://github.com/juzufer-svg/plataapp" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-blue-400 text-blue-200 rounded-lg hover:bg-blue-900 hover:border-blue-300 transition font-semibold text-base md:text-lg text-center">
              Ver en GitHub
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-6 md:p-8 hover:bg-opacity-10 transition text-left">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">💰</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Gestión de Gastos</h3>
              <p className="text-sm md:text-base text-blue-100">Registra y categoriza todos tus gastos automáticamente</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-6 md:p-8 hover:bg-opacity-10 transition text-left">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">📊</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Reportes Detallados</h3>
              <p className="text-sm md:text-base text-blue-100">Visualiza tus hábitos de gasto con gráficos interactivos</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-6 md:p-8 hover:bg-opacity-10 transition text-left">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎯</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Metas Financieras</h3>
              <p className="text-sm md:text-base text-blue-100">Establece y alcanza tus objetivos de ahorro con facilidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-10 px-6 md:px-12 py-8 text-center text-blue-100">
        <p>© 2026 Finanzy. Hecho con ❤️ para ti.</p>
      </footer>
    </div>
  )
}
