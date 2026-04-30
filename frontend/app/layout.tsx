import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlataApp - Gestor Financiero Personal',
  description: 'Tu solución completa para gestionar tus finanzas personales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-inter bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {children}
      </body>
    </html>
  )
}
