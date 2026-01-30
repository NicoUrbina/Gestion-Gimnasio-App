import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Lock, ChevronRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        const success = await login({ email, password });
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] text-white selection:bg-orange-600/30 overflow-hidden relative font-['Outfit']">

            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-orange-900/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md px-6 py-12">
                {/* Branding Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <Link to="/" className="block group transition-all mb-8">
                        <img src="/Img/nexo-logo.png" alt="NEXO" className="h-20 w-auto mx-auto object-contain brightness-110 drop-shadow-[0_0_20px_rgba(234,88,12,0.3)] group-hover:scale-105 transition-transform" />
                    </Link>

                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Acceso al Sistema
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Bienvenido de <span className="text-orange-600">Nuevo</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">Ingresa tus credenciales para acceder a tu panel.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 flex items-center gap-3 animate-in shake duration-300">
                                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Registrado</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="CORREO@EJEMPLO.COM"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Autenticando...
                                </div>
                            ) : (
                                <>
                                    Acceder al Panel
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        {/* Test Credentials Badge */}
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Modo Desarrollador</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                <p>Email: <span className="text-white ml-2">admin@gimnasio.com</span></p>
                                <p>Pass: <span className="text-white ml-2">admin123</span></p>
                            </div>
                        </div>
                    </form>

                    {/* Social Login */}
                    <div className="mt-10">
                        <div className="relative flex items-center gap-4 mb-8 opacity-20">
                            <div className="h-[1px] flex-1 bg-white"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-gray-400">O también puedes</span>
                            <div className="h-[1px] flex-1 bg-white"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.22-1.9 4.22-1.12 1.12-2.8 2.34-5.94 2.34-5.1 0-9.22-4.12-9.22-9.22s4.12-9.22 9.22-9.22c2.78 0 4.86 1.1 6.3 2.4l2.32-2.32C19.22 1.04 16.32 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.7 0 6.5-1.22 8.7-3.5 2.26-2.26 2.96-5.46 2.96-8.06 0-.78-.06-1.5-.18-2.2H12.48z" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-10 text-center space-y-6 animate-in fade-in duration-1000 delay-1000">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        ¿Aún no tienes cuenta?
                        <a
                            className="text-white hover:text-orange-600 ml-2 transition-colors border-b-2 border-white/10 hover:border-orange-600 pb-0.5"
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
                        >
                            Regístrate ahora
                        </a>
                    </p>

                    <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                        <span>Legal</span>
                        <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                        <span>Soporte</span>
                        <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                        <span>V2.4.0</span>
                    </div>
                </div>
            </div>
        </div >
    );
}