/**
 * Register Page - Dark Theme con estilo fitness moderno
 */
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo y Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg shadow-orange-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
                        GymPro
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                        Manager System
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Crear Cuenta
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                    Nombre
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                    placeholder="Nicolas"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                    Apellido
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                    placeholder="Urbina"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                placeholder="nicolatesla@test.com"
                            />
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                Teléfono <span className="text-gray-500 text-xs">(Opcional)</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                placeholder="+58 412 123 4567"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="password_confirm" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="password_confirm"
                                name="password_confirm"
                                type="password"
                                required
                                value={formData.password_confirm}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wide"
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
                                'Registrarse'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-400 text-sm">
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" className="text-orange-500 hover:text-orange-400 font-semibold transition">
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-8 uppercase tracking-widest">
                    GymPro Manager © 2026
                </p>
            </div>
        </div>
    );
}
