import Navbar from "../components/Navbar"
import Footer from "../components/footer"
import GetStartedSection from "../components/GetStartedSection"
import { useAuthStore } from "../stores/authStore"
import { useNavigate } from "react-router-dom"

export default function ContactPage() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuthStore()

    const handleLoginClick = () => {
        navigate("/login")
    }

    const handleSignupClick = () => {
        navigate("/register")
    }

    const handleLogoutClick = () => {
        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar
                onLoginClick={handleLoginClick}
                onSignupClick={handleSignupClick}
                isAuthenticated={isAuthenticated}
                userName={user?.full_name}
                onLogoutClick={handleLogoutClick}
            />

            {/* Content wrapper with top padding to account for fixed navbar */}
            <div className="pt-20">
                <GetStartedSection showCommunity={false} />
            </div>

            <Footer />
        </div>
    )
}
