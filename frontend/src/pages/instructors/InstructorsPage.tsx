import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calendar, Clock, ChevronRight, CheckCircle2, Star, ArrowLeft } from 'lucide-react'

const INSTRUCTORS = [
    {
        id: 1,
        name: "Valentina Rivas",
        role: "Entrenadora Funcional",
        bio: "Te acompaña a mejorar fuerza, postura y resistencia con planes por objetivos.",
        specialties: ["HIIT", "Pilates", "Movilidad"],
        imagePath: "/Img/entrenadora.jpg",
        availability: {
            "Lunes 20 Nov": ["08:00 AM", "10:00 AM", "04:00 PM"],
            "Martes 21 Nov": ["09:00 AM", "11:00 AM", "05:00 PM"],
            "Miércoles 22 Nov": ["08:00 AM", "02:00 PM", "06:00 PM"]
        }
    },
    {
        id: 2,
        name: "Matías Calderón",
        role: "Coach de Fuerza",
        bio: "Especialista en técnica y progresión para que entrenes seguro y constante.",
        specialties: ["CrossFit", "Fuerza", "Spinning"],
        imagePath: "/Img/entrenador1.jpg",
        availability: {
            "Lunes 20 Nov": ["07:00 AM", "09:00 AM", "06:00 PM"],
            "Martes 21 Nov": ["08:00 AM", "12:00 PM", "07:00 PM"],
            "Miércoles 22 Nov": ["09:00 AM", "03:00 PM", "05:00 PM"]
        }
    },
    {
        id: 3,
        name: "Diego Navarro",
        role: "Instructor de Combate",
        bio: "Enfoque en disciplina, cardio y coordinación con sesiones intensas y guiadas.",
        specialties: ["Boxeo", "Kickboxing", "Muay Thai"],
        imagePath: "/Img/entrenador2.jpg",
        availability: {
            "Lunes 20 Nov": ["10:00 AM", "12:00 PM", "07:00 PM"],
            "Martes 21 Nov": ["09:00 AM", "11:00 AM", "06:00 PM"],
            "Miércoles 22 Nov": ["08:00 AM", "01:00 PM", "08:00 PM"]
        }
    }
]

export default function InstructorsPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedInstructor, setSelectedInstructor] = useState<typeof INSTRUCTORS[0] | null>(null)
    const [selectedDay, setSelectedDay] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [step, setStep] = useState(1) // 1: List, 2: Scheduling

    useEffect(() => {
        const state = location.state as { instructorId?: number }
        if (state?.instructorId) {
            const instructor = INSTRUCTORS.find(i => i.id === state.instructorId)
            if (instructor) {
                setSelectedInstructor(instructor)
                setSelectedDay(Object.keys(instructor.availability)[0])
                setStep(2)
                window.scrollTo(0, 0)
            }
        }
    }, [location.state])

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
            setSelectedInstructor(null)
            setSelectedDay('')
            setSelectedTime('')
        } else {
            navigate('/')
        }
    }

    const handleSelectInstructor = (instructor: typeof INSTRUCTORS[0]) => {
        setSelectedInstructor(instructor)
        setSelectedDay(Object.keys(instructor.availability)[0])
        setStep(2)
        window.scrollTo(0, 0)
    }

    const handleFinalize = () => {
        // Redirigir al último paso de agendar cita o similar
        navigate('/step4-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30 font-['Outfit']">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-7xl mx-auto">
                    {step === 1 ? (
                        <div className="space-y-16">
                            {/* Header */}
                            <div className="max-w-3xl animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                    Coach Selection
                                </div>
                                <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                                    Entrena con los <span className="text-orange-600">Mejores</span>
                                </h1>
                                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                    Nuestros entrenadores certificados están listos para llevar tu rendimiento al siguiente nivel. Selecciona un profesional y agenda tu sesión personalizada.
                                </p>
                            </div>

                            {/* Instructors List */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {INSTRUCTORS.map((instructor, idx) => (
                                    <div
                                        key={instructor.id}
                                        className="group relative bg-[#121214] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-600/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                                        style={{ animationDelay: `${idx * 150}ms` }}
                                    >
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img
                                                src={instructor.imagePath}
                                                alt={instructor.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        <div className="p-8 space-y-4">
                                            <div>
                                                <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{instructor.role}</p>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter">{instructor.name}</h3>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {instructor.specialties.map(s => (
                                                    <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handleSelectInstructor(instructor)}
                                                className="w-full mt-4 flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-orange-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group/btn"
                                            >
                                                Agendar Cita
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-right-8 duration-700">
                            {/* Left Column: Selection */}
                            <div className="flex-1 space-y-12">
                                {/* Back Button */}
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver a coaches</span>
                                </button>

                                {/* Header */}
                                <div className="space-y-4">
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Programando con {selectedInstructor?.name.split(' ')[0]}
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                        Elige tu <span className="text-orange-600">Horario</span>
                                    </h2>
                                    <p className="text-gray-500 font-medium text-lg max-w-xl">
                                        Selecciona la fecha y hora que mejor te convenga para tu sesión personalizada con {selectedInstructor?.name}.
                                    </p>
                                </div>

                                {/* Selection Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Day Selection */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            <Calendar className="w-3 h-3 text-orange-600" /> Fecha de Sesión
                                        </label>
                                        <div className="relative group">
                                            <select
                                                value={selectedDay}
                                                onChange={(e) => {
                                                    setSelectedDay(e.target.value)
                                                    setSelectedTime('')
                                                }}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                {selectedInstructor && Object.keys(selectedInstructor.availability).map(day => (
                                                    <option key={day} value={day} className="bg-[#121214]">{day}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 rotate-90 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                            <Clock className="w-3 h-3 text-orange-600" /> Horarios Libres
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedInstructor && selectedInstructor.availability[selectedDay as keyof typeof selectedInstructor.availability]?.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all border ${selectedTime === time
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20'
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-12">
                                    <button
                                        onClick={handleFinalize}
                                        disabled={!selectedDay || !selectedTime}
                                        className="w-full group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                                    >
                                        Confirmar Reserva
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Preview */}
                            <div className="lg:w-96 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="sticky top-32 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                    {/* Background Icon */}
                                    <Star className="absolute -right-8 -top-8 w-40 h-40 text-orange-600/5 rotate-12" />

                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                                        Resumen de Sesión
                                    </h3>

                                    <div className="space-y-8 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-600/20 overflow-hidden">
                                                <img src={selectedInstructor?.imagePath} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Entrenador</p>
                                                <p className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{selectedInstructor?.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Especialidad</span>
                                                <span className="text-white text-xs font-black uppercase tracking-tighter">{selectedInstructor?.role}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Día Elegido</span>
                                                <span className="text-white text-xs font-black uppercase tracking-tighter">{selectedDay || 'Pendiente'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Hora Confirmada</span>
                                                <span className="text-orange-600 text-xs font-black uppercase tracking-tighter">{selectedTime || 'Pendiente'}</span>
                                            </div>
                                        </div>

                                        <div className="bg-orange-600/5 rounded-2xl p-6 border border-orange-600/10 space-y-4">
                                            <div className="flex items-center gap-3 text-orange-500">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Sesión Personalizada</span>
                                            </div>
                                            <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                                                Recibirás un recordatorio 1 hora antes de tu entrenamiento. Prepárate para darlo todo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
