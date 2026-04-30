/**
 * Layout for authentication pages
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-2xl">
        {children}
      </div>
    </div>
  )
}
