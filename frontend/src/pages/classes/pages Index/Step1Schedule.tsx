import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { Calendar, Clock, Dumbbell, User as UserIcon, ChevronRight, CheckCircle2 } from 'lucide-react'

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

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Selection */}
                    <div className="flex-1 space-y-12">
                        {/* Stepper Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Paso 1 de 4
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                Reserva tu <span className="text-orange-600">Experiencia</span>
                            </h1>
                            <p className="text-gray-500 font-medium text-lg max-w-xl">
                                Selecciona el horario y la disciplina que mejor se adapte a tus objetivos de hoy.
                            </p>
                        </div>

                        {/* Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Day Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Calendar className="w-3 h-3 text-orange-600" /> Fecha del Entrenamiento
                                </label>
                                <div className="relative group">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Lunes 20 Nov" className="bg-[#121214]">Lunes 20 Nov</option>
                                        <option value="Martes 21 Nov" className="bg-[#121214]">Martes 21 Nov</option>
                                        <option value="Miércoles 22 Nov" className="bg-[#121214]">Miércoles 22 Nov</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Clock className="w-3 h-3 text-orange-600" /> Horario Disponible
                                </label>
                                <div className="relative group">
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="08:00 AM" className="bg-[#121214]">08:00 AM</option>
                                        <option value="10:00 AM" className="bg-[#121214]">10:00 AM</option>
                                        <option value="06:00 PM" className="bg-[#121214]">06:00 PM</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Dumbbell className="w-3 h-3 text-orange-600" /> Disciplina
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Crossfit', 'Yoga Flow', 'Boxeo', 'Zumba'].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedClass(c)}
                                            className={`py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all border ${selectedClass === c
                                                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20'
                                                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Instructor Selection */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <UserIcon className="w-3 h-3 text-orange-600" /> Coach
                                </label>
                                <div className="relative group">
                                    <select
                                        value={selectedInstructor}
                                        onChange={(e) => setSelectedInstructor(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Carlos Ruiz" className="bg-[#121214]">Carlos Ruiz</option>
                                        <option value="Elena Gómez" className="bg-[#121214]">Elena Gómez</option>
                                        <option value="Marcos Silva" className="bg-[#121214]">Marcos Silva</option>
                                    </select>
                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex items-center gap-4 pt-12">
                            <button
                                onClick={handleBack}
                                className="px-10 py-5 rounded-2xl bg-white/5 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all border border-white/5"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                            >
                                Continuar
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Preview/Summary */}
                    <div className="lg:w-96">
                        <div className="sticky top-32 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                                Tu Elección Actual
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-600/20">
                                        <Dumbbell className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Disciplina</p>
                                        <p className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{selectedClass}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Coach Personal</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">{selectedInstructor}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Día de Inicio</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">{selectedDay}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Sesión Programada</span>
                                        <span className="text-orange-600 text-xs font-black uppercase tracking-tighter">{selectedTime}</span>
                                    </div>
                                </div>

                                <div className="bg-orange-600/5 rounded-2xl p-6 border border-orange-600/10 space-y-4">
                                    <div className="flex items-center gap-3 text-orange-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cupos Disponibles</span>
                                    </div>
                                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                                        Tu reserva será válida por 15 minutos mientras completas los siguientes pasos.
                                    </p>
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

export default Step1Schedule