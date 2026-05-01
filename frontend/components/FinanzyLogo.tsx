import Image from 'next/image'

interface FinanzyLogoProps {
  /** Modo: 'full' muestra icono + nombre + tagline, 'icon' solo el icono, 'horizontal' icono + nombre */
  variant?: 'full' | 'icon' | 'horizontal'
  /** Tamaño del icono en píxeles */
  size?: number
  /** Forzar texto claro (para fondos oscuros) */
  lightText?: boolean
  className?: string
}

export default function FinanzyLogo({
  variant = 'horizontal',
  size = 48,
  lightText = false,
  className = '',
}: FinanzyLogoProps) {
  const textColor = lightText ? 'text-white' : 'text-[#0D1B4B]'
  const taglineColor = lightText ? 'text-teal-300' : 'text-[#00B89C]'

  const Icon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Finanzy logo icon"
    >
      <defs>
        <linearGradient id="fGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D1B4B" />
          <stop offset="100%" stopColor="#00B89C" />
        </linearGradient>
        <linearGradient id="chartGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#00C9A7" />
          <stop offset="100%" stopColor="#00E5C4" />
        </linearGradient>
      </defs>

      {/* Letra F – rama superior horizontal */}
      <rect x="14" y="8" width="56" height="16" rx="6" fill="url(#fGrad)" />
      {/* Letra F – rama media horizontal */}
      <rect x="14" y="36" width="40" height="14" rx="5" fill="url(#fGrad)" />
      {/* Letra F – pilar vertical */}
      <rect x="14" y="8" width="16" height="72" rx="6" fill="url(#fGrad)" />

      {/* Barras del gráfico dentro de la F */}
      <rect x="38" y="62" width="9" height="18" rx="3" fill="url(#chartGrad)" />
      <rect x="51" y="52" width="9" height="28" rx="3" fill="url(#chartGrad)" />
      <rect x="64" y="40" width="9" height="40" rx="3" fill="url(#chartGrad)" />

      {/* Flecha de tendencia alcista */}
      <polyline
        points="36,70 52,54 65,44 80,28"
        stroke="#00E5C4"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Punta de la flecha */}
      <polyline
        points="68,24 80,28 76,40"
        stroke="#00E5C4"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <span className={className} aria-label="Finanzy">
        <Icon />
      </span>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon />
        <span className={`font-extrabold tracking-tight leading-none ${textColor}`} style={{ fontSize: size * 0.6 }}>
          Finanzy
        </span>
      </div>
    )
  }

  // full: icono centrado + nombre + tagline
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Icon />
      <span className={`font-extrabold tracking-tight leading-none ${textColor}`} style={{ fontSize: size * 0.65 }}>
        Finanzy
      </span>
      <span className={`font-semibold tracking-[0.2em] uppercase text-xs ${taglineColor}`}>
        Control a tu medida
      </span>
    </div>
  )
}
