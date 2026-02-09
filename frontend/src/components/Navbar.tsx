import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

interface NavbarProps {
  onLoginClick?: () => void
  onSignupClick?: () => void
  isAuthenticated?: boolean
  userName?: string
  onLogoutClick?: () => void
  bgColor?: string
}

export default function Navbar({
  onLoginClick,
  onSignupClick,
  isAuthenticated = false,
  userName,
  onLogoutClick,
  bgColor = "bg-black/25",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { label: "HOME", href: "/#home" },
    { label: "MEMBRESÍAS", href: "/planes-y-precios" },
    { label: "AGENDA Y CLASES", href: "/step1-schedule" },
    { label: "INSTRUCTORES", href: "/entrenadores" },
    { label: "CONTACTO", href: "/contact" },
  ]
  const logoSrc = `/Img/nexo-logo.png`

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 ${bgColor} backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/30`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center shrink-0 group">
            <div className="h-12 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={logoSrc} alt="Gym Logo" className="h-full object-contain" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-2 py-2 text-white/90 text-sm font-semibold uppercase tracking-wide hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-8 py-4 text-white border border-orange-500 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-orange-500/10 transition-all duration-200"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-orange-600 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-200"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <p className="text-white font-semibold text-sm">{userName}</p>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="p-2 text-white hover:text-orange-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-orange-500 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-orange-500/20">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-white text-sm font-semibold uppercase tracking-wide hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
