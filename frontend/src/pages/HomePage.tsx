import HeroHeader from "../components/HeroHeader"
import PricingSection from "../components/PricingSection"
import ClassesScheduleSection from "../components/ClassesScheduleSection"
import InstructorsSection from "../components/InstructorsSection"
import ContactSection from "../components/ContactSection"
import Footer from "../components/footer"
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

      <PricingSection />

      <ClassesScheduleSection />

      <InstructorsSection />

      <ContactSection />

      <Footer />
    </div>
  )
}
