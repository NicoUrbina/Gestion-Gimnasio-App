import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { CheckCircle2, QrCode, Share2, Calendar, Download, ChevronRight, MapPin, User, ArrowLeft } from 'lucide-react'

const Step4Schedule = () => {
    const navigate = useNavigate()
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsAnimating(true)
    }, [])

    const handleBackHome = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">

                    {/* Final Success Animation */}
                    <div className={`text-center transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative inline-block mb-12">
                            <div className="absolute inset-0 bg-orange-600 blur-3xl rounded-full opacity-20 animate-pulse"></div>
                            <div className="relative w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-600/40 rotate-6 group hover:rotate-0 transition-transform duration-500">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-green-500 text-xs font-black uppercase tracking-[0.2em] mb-6">
                            RESERVA COMPLETADA EXITOSAMENTE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            ¡Te vemos <br />
                            en <span className="text-orange-600">NEXO!</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light mb-12 leading-relaxed">
                            Tu reserva ha sido procesada. Hemos enviado los detalles a tu correo electrónico.
                        </p>
                    </div>

                    {/* Receipt Card */}
                    <div className={`bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.05] p-1 shadow-2xl transition-all duration-1000 delay-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="bg-zinc-900/40 rounded-[2.2rem] p-8 md:p-10 relative overflow-hidden group">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-3xl"></div>

                            <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Detalles del Ticket</h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Día y Hora</p>
                                                <p className="text-sm font-bold text-white">Lunes 20 Nov • 08:00 AM</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Coach Responsable</p>
                                                <p className="text-sm font-bold text-white">Carlos Ruiz</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ubicación</p>
                                                <p className="text-sm font-bold text-white">NEXO Gym - Sala de Boxeo</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl group-hover:scale-105 transition-transform duration-500">
                                    <QrCode className="w-32 h-32 text-black mb-3" />
                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">NXO-8829-11</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                                <button className="flex-1 min-w-[140px] flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-[11px]">
                                    <Download className="w-4 h-4" />
                                    Guardar PDF
                                </button>
                                <button className="flex-1 min-w-[140px] flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all text-[11px]">
                                    <Share2 className="w-4 h-4" />
                                    Compartir
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`mt-12 flex flex-col md:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                        <button
                            onClick={handleBackHome}
                            className="group flex items-center justify-center gap-3 px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                        >
                            Ir a mi Dashboard
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={handleBackHome}
                            className="flex items-center justify-center gap-2 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-all text-[11px] px-8 py-5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Step4Schedule
