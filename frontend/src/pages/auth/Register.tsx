import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        if (formData.password !== formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!formData.acceptTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        const success = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (success) {
            navigate('/dashboard');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    alt="Persona entrenando intensamente en el gimnasio"
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHW2wASvJVfqPB9UE4f0Adxk5fX8MauLuQA13b6YErNny1JS7FHqW72_Y9JY89qLkLeZyUBaTRG2ev58fcFkSDsZ1_PdulAUFceIlGnu9ga-yNf0HLUjzrv_lP4GEIBds575w-unqAcUwcHyfNmAJxWqVG6BWF5ceInTBHLzoBQKXbldi39ywWQP_nOLmkXVinZwOCwRWt5mFA7sg6wqdvkGBQN-laXKxFv9SF5Ai8ZcT2wxIoea1h80olFw8iyiWnU1idYUgTiT56"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
                <div className="relative z-8 flex flex-col justify-between p-12 w-full">
                    <div>
                        <div className="flex items-center gap-2">
                            <img src="/public/img/nexo-logo.png" alt="NEXO GYM" className="w-20 h-20 object-contain" />
                        </div>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            TRANSFORMA TU <span className="text-orange-500">CUERPO</span><br />
                            CAMBIA TU VIDA
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Únete a la comunidad fitness más exclusiva. Entrena con los mejores y alcanza tus metas hoy mismo.
                        </p>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2024 NEXO GYM SYSTEM. Todos los derechos reservados.
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
                        <img src="/img/gym_Logo_icono.png" alt="NEXO GYM" className="w-16 h-16 object-contain" />
                    </div>

                    {/* Form Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-2 dark:text-white">Crea tu cuenta</h2>
                        <p className="text-gray-500 dark:text-gray-400">Ingresa tus datos para comenzar tu transformación</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">
                                Nombre Completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="juan@ejemplo.com"
                            />
                        </div>

                        {/* Password Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="password">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
                                    Confirmar
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showConfirmPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-center gap-2 py-2">
                            <input
                                id="terms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 bg-transparent"
                            />
                            <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="terms">
                                Acepto los <a className="text-orange-500 hover:underline" href="#">términos y condiciones</a> y la política de privacidad.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando cuenta...
                                </span>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            ¿Ya tienes cuenta?
                            <a className="text-orange-500 font-semibold hover:underline ml-1" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Iniciar sesión</a>
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex items-center justify-center gap-6 text-gray-400 dark:text-gray-500">
                        <a className="hover:text-orange-500 transition-colors" href="#">
                            <span className="material-symbols-outlined">public</span>
                        </a>
                        <a className="hover:text-orange-500 transition-colors" href="#">
                            <span className="material-symbols-outlined">help_outline</span>
                        </a>
                        <a className="hover:text-orange-500 transition-colors text-sm font-medium" href="#">ES</a>
                    </div>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
                className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-orange-500 flex items-center justify-center z-50"
                onClick={() => document.documentElement.classList.toggle('dark')}
            >
                <span className="material-symbols-outlined dark:hidden">dark_mode</span>
                <span className="material-symbols-outlined hidden dark:block text-orange-500">light_mode</span>
            </button>
        </div>
    );
}
