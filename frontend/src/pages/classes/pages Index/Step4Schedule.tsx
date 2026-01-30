import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { CheckCircle2, Calendar, Clock, MapPin, User, ArrowRight, Download, Share2, Ticket } from 'lucide-react'

const Step4Schedule = () => {
    const navigate = useNavigate()
    const [bookingConfirmed, setBookingConfirmed] = useState(false)

    const handleConfirm = () => {
        setBookingConfirmed(true)
        // Simulate navigation after delay
        setTimeout(() => {
            navigate('/')
        }, 5000)
    }

    const handleBack = () => {
        navigate('/step3-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0 flex items-center justify-center">
                <div className="max-w-4xl w-full mx-auto">

                    {!bookingConfirmed ? (
                        <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Left: Summary Review */}
                            <div className="flex-1 space-y-12">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Paso 4 de 4
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                        Revisa tu <span className="text-orange-600">Reserva</span>
                                    </h1>
                                    <p className="text-gray-500 font-medium text-lg max-w-xl">
                                        Confirma que todos los datos sean correctos antes de finalizar tu inscripción.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Disciplina', val: 'Crossfit', icon: Ticket, col: 'text-orange-600' },
                                        { label: 'Horario', val: 'Lunes, 08:00 AM', icon: Clock, col: 'text-white' },
                                        { label: 'Coach', val: 'Carlos Ruiz', icon: User, col: 'text-white' },
                                        { label: 'Ubicación', val: 'NEXO Box - Area A', icon: MapPin, col: 'text-white' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-4 h-4 text-orange-600" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <p className={`text-xl font-black uppercase tracking-tighter ${item.col}`}>{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        onClick={handleBack}
                                        className="px-10 py-5 rounded-2xl bg-white/5 text-gray-500 font-black uppercase tracking-widest hover:text-white transition-all border border-white/5 flex items-center gap-3"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 group flex items-center justify-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                                    >
                                        Confirmar Inscripción
                                        <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    </button>
                                </div>
                            </div>

                            {/* Right: Price Final */}
                            <div className="lg:w-80">
                                <div className="bg-orange-600 rounded-[2.5rem] p-8 shadow-2xl shadow-orange-600/20 space-y-8">
                                    <div className="text-center space-y-2">
                                        <p className="text-orange-200 text-[10px] font-black uppercase tracking-[0.2em]">Total a Pagar</p>
                                        <p className="text-5xl font-black text-white uppercase tracking-tighter">$17.00</p>
                                    </div>
                                    <div className="space-y-4 border-t border-white/20 pt-8">
                                        <div className="flex justify-between items-center text-[10px] font-black text-orange-200 uppercase tracking-widest">
                                            <span>Reserva</span>
                                            <span className="text-white">$15.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black text-orange-200 uppercase tracking-widest">
                                            <span>Service Fee</span>
                                            <span className="text-white">$2.00</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 rounded-2xl p-4 text-[10px] font-black text-white uppercase tracking-widest text-center">
                                        Pago procesado con éxito
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-12 animate-in zoom-in-95 fade-in duration-700">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-orange-600 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
                                <div className="relative w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-orange-600/40">
                                    <CheckCircle2 className="w-16 h-16 text-white stroke-[3px]" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                                    ¡Estás <span className="text-orange-600">Dentro</span>!
                                </h1>
                                <p className="text-gray-500 font-medium text-xl max-w-xl mx-auto">
                                    Tu reserva ha sido confirmada. Hemos enviado los detalles a tu correo electrónico.
                                </p>
                            </div>

                            {/* Digital Ticket */}
                            <div className="max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                                <div className="p-8 border-b border-dashed border-white/10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Reserva</p>
                                            <p className="text-2xl font-black text-white uppercase tracking-tighter">NXO-2024-882</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-lg p-1">
                                            <div className="w-full h-full bg-black"></div> {/* Simulating QR */}
                                        </div>
                                    </div>
                                    <div className="flex gap-8 text-left">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Fecha</p>
                                            <p className="text-sm font-black text-white uppercase">20 NOV</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Hora</p>
                                            <p className="text-sm font-black text-orange-600 uppercase">08:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-white/[0.01] flex justify-between items-center">
                                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                                        <Download className="w-4 h-4" /> Guardar Pase
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" /> Compartir
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all group"
                            >
                                Volver al Inicio
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Step4Schedule
