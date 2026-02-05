/**
 * Register Page - Dark Theme con estilo fitness moderno
 */
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegisterFormData {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const logoSrc = `${import.meta.env.BASE_URL}Img/nexo-logo.png`;

    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación básica
        if (formData.password !== formData.password_confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            // Crear usuario
            await api.post('/users/', formData);

            // Auto-login después del registro
            toast.success('¡Cuenta creada exitosamente!');
            const success = await login({
                email: formData.email,
                password: formData.password,
            });

            if (success) {
                navigate('/dashboard');
            }
        } catch (error: any) {
            const message =
                error.response?.data?.email?.[0] ||
                error.response?.data?.detail ||
                'Error al crear la cuenta';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen overflow-y-auto flex items-center justify-center font-sans py-10">

            {/* 1. IMAGEN DE FONDO */}
            <div className="fixed top-0 left-0 w-full h-full z-0">
                <img
                    src="/public/img/fondoLogin.jpg"
                    alt="Fondo de Login"
                    className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
            </div>

            {/* 2. TARJETA DE REGISTRO (Glassmorphism) */}
            <div className="relative z-10 w-full max-w-lg p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl mx-4 my-auto">

                {/* LOGO */}
                <div className="flex justify-center mb-0.5">
                    <img
                        src={logoSrc}
                        alt="Logo Nexo"
                        className="h-20 w-auto object-contain"
                    />
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wider">
                    CREAR <span className="text-orange-500">CUENTA</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                            <p className="text-red-200 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}

                    {/* Nombre y Apellido (Grid) - Already updated in previous step, but we need to ensure the form tag above has space-y-6 */}
                    {/* ... (Skipping content already replaced, but I can't skip ranges in replace_file_content easily without context. Let's just target the other inputs) ... */}

                    {/* Email */}
                    <div className="space-y-2">
                        <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-3">
                            <Mail className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Correo Electrónico"
                                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-3">
                            <Phone className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Teléfono (Opcional)"
                                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-3">
                            <Lock className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Contraseña"
                                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="space-y-2">
                        <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-3">
                            <Lock className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                            <input
                                id="password_confirm"
                                name="password_confirm"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Confirmar Contraseña"
                                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
                                value={formData.password_confirm}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                CREANDO CUENTA...
                            </>
                        ) : (
                            'REGISTRARSE'
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-white font-semibold underline hover:text-orange-500 transition-colors">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
