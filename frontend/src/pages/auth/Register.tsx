import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';

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
        <div className="flex min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30 font-['Outfit']">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-screen sticky top-0">
                <img
                    alt="Persona entrenando intensamente en el gimnasio"
                    className="absolute inset-0 h-full w-full object-cover scale-110 group-hover:scale-100 transition-transform duration-10000"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHW2wASvJVfqPB9UE4f0Adxk5fX8MauLuQA13b6YErNny1JS7FHqW72_Y9JY89qLkLeZyUBaTRG2ev58fcFkSDsZ1_PdulAUFceIlGnu9ga-yNf0HLUjzrv_lP4GEIBds575w-unqAcUwcHyfNmAJxWqVG6BWF5ceInTBHLzoBQKXbldi39ywWQP_nOLmkXVinZwOCwRWt5mFA7sg6wqdvkGBQN-laXKxFv9SF5Ai8ZcT2wxIoea1h80olFw8iyiWnU1idYUgTiT56"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
                    <Link to="/" className="animate-in fade-in slide-in-from-top-4 duration-700 block hover:opacity-80 transition-opacity">
                        <img src="/Img/nexo-logo.png" alt="NEXO" className="h-16 w-auto object-contain brightness-110" />
                    </Link>

                    <div className="max-w-lg mb-20 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center px-4 py-1 rounded-full bg-orange-600/20 border border-orange-600/30 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Comunidad Elite
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] mb-8 uppercase tracking-tighter">
                            Redefine <br />
                            <span className="text-orange-600">Tu Límite</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-light leading-relaxed">
                            Accede a instalaciones de primer nivel, entrenadores certificados y planes nutricionales diseñados para resultados reales.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest animate-in fade-in duration-1000">
                        <span>© 2024 NEXO SYSTEM</span>
                        <div className="h-[1px] w-12 bg-white/10"></div>
                        <span>Pioneering Fitness Evolution</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative overflow-hidden bg-[#0a0a0b]">
                {/* Background glow effects */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-orange-900/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden flex justify-center mb-12 hover:opacity-80 transition-opacity">
                        <img src="/Img/nexo-logo.png" alt="NEXO" className="h-14 w-auto object-contain" />
                    </Link>

                    {/* Form Header */}
                    <div className="mb-12 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase leading-none">Únete a la <span className="text-orange-600">Revolución</span></h2>
                        <p className="text-gray-500 font-medium">Ingresa tus credenciales para comenzar tu transformación hoy mismo.</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 mb-8 flex items-center gap-3 animate-in zoom-in-95 duration-300">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            <p className="text-red-500 text-sm font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1" htmlFor="name">Nombre Completo</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                    <User className="w-5 h-5" />
                                </span>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="JUAN PEREZ"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1" htmlFor="email">Correo Electrónico</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="CORREO@EJEMPLO.COM"
                                />
                            </div>
                        </div>

                        {/* Password Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1" htmlFor="password">Contraseña</label>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1" htmlFor="confirm-password">Confirmar</label>
                                <div className="relative group">
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    id="terms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleInputChange}
                                    className="peer h-5 w-5 appearance-none rounded-lg border-2 border-white/10 bg-white/5 checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer"
                                />
                                <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity font-black" strokeWidth={4} />
                            </div>
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-relaxed cursor-pointer" htmlFor="terms">
                                Acepto los <a className="text-orange-600 hover:text-orange-500 transition-colors" href="#">términos de servicio</a> y la política de privacidad de NEXO.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-[1.25rem] shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sincronizando...
                                </div>
                            ) : (
                                <>
                                    Comenzar Transformación
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Registration */}
                    <div className="mt-10">
                        <div className="relative flex items-center gap-4 mb-8 opacity-20">
                            <div className="h-[1px] flex-1 bg-white"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-gray-400">O también puedes</span>
                            <div className="h-[1px] flex-1 bg-white"></div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-800">
                            <button
                                type="button"
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.22-1.9 4.22-1.12 1.12-2.8 2.34-5.94 2.34-5.1 0-9.22-4.12-9.22-9.22s4.12-9.22 9.22-9.22c2.78 0 4.86 1.1 6.3 2.4l2.32-2.32C19.22 1.04 16.32 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.7 0 6.5-1.22 8.7-3.5 2.26-2.26 2.96-5.46 2.96-8.06 0-.78-.06-1.5-.18-2.2H12.48z" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-12 text-center animate-in fade-in duration-1000 delay-1000">
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                            ¿Ya formas parte?
                            <a className="text-white hover:text-orange-600 ml-2 transition-colors border-b-2 border-white/10 hover:border-orange-600 pb-0.5" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Acceder ahora</a>
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 flex items-center justify-center gap-8 py-8 border-t border-white/5 animate-in fade-in duration-1000 delay-1200">
                        <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <ShieldCheck className="w-5 h-5 text-gray-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Secure Data</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                            <Lock className="w-5 h-5 text-gray-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Privacy First</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Check({ className, ...props }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
