import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

interface HeroHeaderProps {
  onLoginClick?: () => void
  onSignupClick?: () => void
  isAuthenticated?: boolean
  userName?: string
  onLogoutClick?: () => void
}

export default function HeroHeader({
  onLoginClick,
  onSignupClick,
  isAuthenticated = false,
  userName,
  onLogoutClick,
}: HeroHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { label: "HOME", href: "#home" },
    { label: "MEMBRESÍAS", href: "#memberships" },
    { label: "AGENDA Y CLASES", href: "#classes" },
    { label: "INSTRUCTORES", href: "#instructors" },
    { label: "CONTACTO", href: "#contact" },
  ]

  const logoSrc = `${import.meta.env.BASE_URL}Img/nexo-logo.png`
  const heroVideoSrc = `${import.meta.env.BASE_URL}gym-hero.mp4`

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-black/25 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <img src={logoSrc} alt="NEXO Logo" className="w-30 h-30 object-contain" />
              </div>
            </Link>

            {/* Navigation Menu - Center (Hidden on mobile) */}
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

            {/* Auth Buttons - Right */}
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-orange-500 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
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

      {/* Hero Section with Video Background */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-slate-900/20 to-black/40 opacity-35 pointer-events-none"></div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8 sm:space-y-10">
            {/* Main Heading */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                Transforma tu{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
                  Cuerpo
                </span>
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">
                Cambia tu Vida
              </h2>
            </div>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed pt-2">
              Entrena con los mejores instructores, accede a clases en vivo y alcanza tus objetivos de fitness con NEXO.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6">
              <button
                onClick={onSignupClick}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-orange-500 text-white rounded-lg font-bold text-lg uppercase tracking-wide hover:bg-orange-600 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:scale-105 transition-all duration-300"
              >
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-sm font-semibold uppercase tracking-wide">Desplázate</p>
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

