/**
 * Layout for authentication pages
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-8" style={{background: 'linear-gradient(135deg, #0D1B4B 0%, #0a3d4a 50%, #0D1B4B 100%)'}}>
      <div className="w-full max-w-sm md:max-w-md">
        {children}
      </div>
    </div>
  )
}
