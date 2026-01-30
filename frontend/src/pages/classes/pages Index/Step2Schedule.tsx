import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { User, Mail, Phone, Calendar as CalendarIcon, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react'

const Step2Schedule = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNext = () => {
        navigate('/step3-schedule')
    }

    const handleBack = () => {
        navigate('/step1-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Form */}
                    <div className="flex-1 space-y-12">
                        {/* Stepper Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Paso 2 de 4
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                Datos del <span className="text-orange-600">Atleta</span>
                            </h1>
                            <p className="text-gray-500 font-medium text-lg max-w-xl">
                                Cuéntanos quién eres para preparar tu llegada al box.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                        <User className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="JUAN"
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Apellido</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                        <User className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="PÉREZ"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="JUAN@EJEMPLO.COM"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Teléfono</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                        placeholder="+58 412 000 0000"
                                    />
                                </div>
                            </div>

                            {/* Birth Date */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                        <CalendarIcon className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex items-center gap-4 pt-12">
                            <button
                                onClick={handleBack}
                                className="px-10 py-5 rounded-2xl bg-white/5 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all border border-white/5 flex items-center gap-3 group"
                            >
                                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                Volver
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                            >
                                Continuar a Pago
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Preview/Summary */}
                    <div className="lg:w-96">
                        <div className="sticky top-32 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                                Tu Reserva
                            </h3>

                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Disciplina</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">Crossfit</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Horario</span>
                                        <span className="text-orange-600 text-xs font-black uppercase tracking-tighter">LUNES, 08:00 AM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Coach</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">Carlos Ruiz</span>
                                    </div>
                                </div>

                                <div className="bg-orange-600/5 rounded-2xl p-6 border border-orange-600/10 space-y-4">
                                    <div className="flex items-center gap-3 text-orange-500">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Datos Protegidos</span>
                                    </div>
                                    <p className="text-gray-400 text-[10px] font-semibold leading-relaxed uppercase tracking-tighter">
                                        Tus datos personales se procesan de forma cifrada siguiendo los estándares SSL de alta seguridad.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 opacity-50">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Paso 1 Completado</span>
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
