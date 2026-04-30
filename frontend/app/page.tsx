import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="text-3xl">💳</div>
          <span className="text-2xl font-bold text-white">PlataApp</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-6 py-2 text-white hover:text-blue-200 transition font-medium">
            Iniciar Sesión
          </Link>
          <Link href="/auth/register" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Gestiona tus 
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent"> finanzas </span>
            con facilidad
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            PlataApp es tu solución completa para controlar gastos, presupuestos y metas financieras. 
            Toma el control de tu dinero hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/auth/register" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
              Comenzar Gratis
            </Link>
            <Link href="https://github.com" className="px-8 py-4 border-2 border-blue-400 text-blue-200 rounded-lg hover:bg-blue-900 hover:border-blue-300 transition font-semibold text-lg">
              Ver en GitHub
            </Link>
          </div>

          {/* Floating Cards Background */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Gestión de Gastos</h3>
              <p className="text-blue-100">Registra y categoriza todos tus gastos automáticamente</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">Reportes Detallados</h3>
              <p className="text-blue-100">Visualiza tus hábitos de gasto con gráficos interactivos</p>
            </div>

            <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Metas Financieras</h3>
              <p className="text-blue-100">Establece y alcanza tus objetivos de ahorro con facilidad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-10 px-6 md:px-12 py-8 text-center text-blue-100">
        <p>© 2026 PlataApp. Hecho con ❤️ para ti.</p>
      </footer>
    </div>
  )
}
