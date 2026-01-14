import HeroHeader from "../components/HeroHeader"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleSignupClick = () => {
    // You can create a signup page later
    navigate("/login")
  }

  const handleLogoutClick = () => {
    // Handle logout if needed
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black">
      <HeroHeader
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        isAuthenticated={isAuthenticated}
        userName={user?.full_name}
        onLogoutClick={handleLogoutClick}
      />

      {/* Additional sections can be added below the hero */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4 uppercase">Próximas Secciones</h2>
          <p className="text-gray-400 text-lg">Membresías, Clases, Instructores y más...</p>
        </div>
      </section>
    </div>
  )
}
