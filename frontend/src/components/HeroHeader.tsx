import { useState } from "react"
import Navbar from './Navbar';

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
  const heroVideoSrc = `${import.meta.env.BASE_URL}gym-hero.mp4`
  const logoSrc = `${import.meta.env.BASE_URL}img/nexo-logo.png`

  return (
    <>
      {/* Fixed Navigation Bar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogoutClick={onLogoutClick}
      />

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

