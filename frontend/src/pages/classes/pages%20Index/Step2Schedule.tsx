import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { User, Mail, Phone, Calendar, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react'

const Step2Schedule = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        birthDate: '',
    })

    // Validation Helpers
    const onlyLetters = (val: string) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
    const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, '');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.phone.length < 8) {
            alert("Por favor, ingresa un número de teléfono válido")
            return
        }
        navigate('/step3-schedule')
    }

    const handleBack = () => {
        navigate('/step1-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            {/* Hero Background Effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Stepper Header */}
                    <div className="flex justify-between items-center mb-16 max-w-2xl mx-auto px-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600/50">Clase</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-orange-600/30 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/20 ring-4 ring-orange-600/10">
                                <User className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600">Datos</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-white/5 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                                <span className="font-black text-lg">3</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/20">Pago</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-white/5 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                                <span className="font-black text-lg">4</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/20">Listo</span>
                        </div>
                    </div>

                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-6">
                            PASO 2 • INFORMACIÓN PERSONAL
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Sobre <span className="text-orange-600">Ti</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Completa tus datos para confirmar tu lugar en la sesión. La seguridad de tu información es nuestra prioridad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <form onSubmit={handleNext} className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white-[0.05] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                                <User className="w-5 h-5" />
                                            </span>
                                            <input
                                                required
                                                type="text"
                                                maxLength={50}
                                                placeholder="Ej. Juan Pérez"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: onlyLetters(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                                <Mail className="w-5 h-5" />
                                            </span>
                                            <input
                                                required
                                                type="email"
                                                maxLength={60}
                                                placeholder="juan@ejemplo.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Teléfono Móvil</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                                <Phone className="w-5 h-5" />
                                            </span>
                                            <input
                                                required
                                                type="tel"
                                                maxLength={15}
                                                placeholder="9112345678"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: onlyNumbers(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                                                <Calendar className="w-5 h-5" />
                                            </span>
                                            <input
                                                required
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-medium focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex items-start gap-4 p-5 bg-orange-600/5 rounded-2xl border border-orange-600/10">
                                    <ShieldCheck className="w-6 h-6 text-orange-600 shrink-0" />
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                        Al continuar, aceptas que NEXO Gym procese tus datos para gestionar tu reserva y mejorar tu experiencia. Nunca compartiremos tus datos con terceros.
                                    </p>
                                </div>

                                <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-all text-[11px]"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Retroceder
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto group flex items-center justify-center gap-3 px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                                    >
                                        Siguiente Paso
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl sticky top-32">
                                <h3 className="text-lg font-black uppercase tracking-widest mb-8 text-white flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-orange-600" />
                                    Tu Selección
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Día y Hora</span>
                                        <p className="text-sm font-bold text-white">Lunes 20 Nov • 08:00 AM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Actividad</span>
                                        <p className="text-sm font-bold text-white">Crossfit - Alta Intensidad</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Coach Responsable</span>
                                        <p className="text-sm font-bold text-white">Carlos Ruiz</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-400">Costo de Clase</span>
                                        <span className="text-sm font-black text-white">$15.00</span>
                                    </div>
                                    <div className="flex justify-between items-center font-black text-lg">
                                        <span className="text-white">TOTAL</span>
                                        <span className="text-orange-600">$15.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Step2Schedule
