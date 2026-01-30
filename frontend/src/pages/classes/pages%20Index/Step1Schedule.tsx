import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { Calendar, Clock, Dumbbell, User as UserIcon, ChevronRight } from 'lucide-react'

const Step1Schedule = () => {
    const navigate = useNavigate()
    const [selectedDay, setSelectedDay] = useState('Lunes 20 Nov')
    const [selectedTime, setSelectedTime] = useState('08:00 AM')
    const [selectedClass, setSelectedClass] = useState('Crossfit')
    const [selectedInstructor, setSelectedInstructor] = useState('Carlos Ruiz')

    const handleNext = () => {
        navigate('/step2-schedule')
    }

    const handleBack = () => {
        navigate('/')
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
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/20 ring-4 ring-orange-600/10">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600">Clase</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-white/5 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                                <span className="font-black text-lg">2</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/20">Datos</span>
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
                            PASO 1 • SELECCIÓN DE ACTIVIDAD
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Configura tu <br />
                            <span className="text-orange-600">Entrenamiento</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Personaliza tu sesión eligiendo el horario que mejor se adapte a tu ritmo y los mejores instructores certificados.
                        </p>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white-[0.05] p-6 md:p-12 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-3xl pointer-events-none -mr-32 -mt-32"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {/* Day Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    ¿Qué día quieres venir?
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-lg focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer group-hover/select:border-white/20"
                                    >
                                        <option value="Lunes 20 Nov" className="bg-zinc-900">Lunes 20 Nov</option>
                                        <option value="Martes 21 Nov" className="bg-zinc-900">Martes 21 Nov</option>
                                        <option value="Miércoles 22 Nov" className="bg-zinc-900">Miércoles 22 Nov</option>
                                        <option value="Jueves 23 Nov" className="bg-zinc-900">Jueves 23 Nov</option>
                                        <option value="Viernes 24 Nov" className="bg-zinc-900">Viernes 24 Nov</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    Horario disponible
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-lg focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer group-hover/select:border-white/20"
                                    >
                                        <option value="08:00 AM" className="bg-zinc-900">08:00 AM - Madrugadores</option>
                                        <option value="10:00 AM" className="bg-zinc-900">10:00 AM - Media Mañana</option>
                                        <option value="12:00 PM" className="bg-zinc-900">12:00 PM - Mediodía</option>
                                        <option value="04:00 PM" className="bg-zinc-900">04:00 PM - Tarde</option>
                                        <option value="06:00 PM" className="bg-zinc-900">06:00 PM - After Office</option>
                                        <option value="08:00 PM" className="bg-zinc-900">08:00 PM - Night Flow</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Dumbbell className="w-4 h-4 text-orange-600" />
                                    Tipo de Disciplina
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-lg focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer group-hover/select:border-white/20"
                                    >
                                        <option value="Crossfit" className="bg-zinc-900">Crossfit - Alta Intensidad</option>
                                        <option value="Yoga Flow" className="bg-zinc-900">Yoga Flow - Flexibilidad</option>
                                        <option value="Boxeo" className="bg-zinc-900">Boxeo - Cardio Combat</option>
                                        <option value="Funcional" className="bg-zinc-900">Funcional - Fuerza</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Instructor Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <UserIcon className="w-4 h-4 text-orange-600" />
                                    Instructor Certificado
                                </label>
                                <div className="relative group/select">
                                    <select
                                        value={selectedInstructor}
                                        onChange={(e) => setSelectedInstructor(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold text-lg focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer group-hover/select:border-white/20"
                                    >
                                        <option value="Carlos Ruiz" className="bg-zinc-900">Coach Carlos Ruiz</option>
                                        <option value="Elena Gómez" className="bg-zinc-900">Coach Elena Gómez</option>
                                        <option value="Marcos Silva" className="bg-zinc-900">Coach Marcos Silva</option>
                                        <option value="Lucía Ferrar" className="bg-zinc-900">Coach Lucía Ferrar</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <ChevronRight className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-12 md:mt-16 flex flex-col md:flex-row gap-4 justify-between items-center pt-8 border-t border-white/5">
                            <button
                                onClick={handleBack}
                                className="w-full md:w-auto px-10 py-5 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all text-xs"
                            >
                                Volver al inicio
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-full md:w-auto group flex items-center justify-center gap-3 px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                            >
                                Reservar Ahora
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Step1Schedule
