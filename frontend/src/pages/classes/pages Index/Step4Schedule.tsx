import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'

const Step4Schedule = () => {
    const navigate = useNavigate()
    const [bookingConfirmed, setBookingConfirmed] = useState(false)

    const handleConfirm = () => {
        setBookingConfirmed(true)
        // Simulate booking confirmation
        setTimeout(() => {
            navigate('/')
        }, 3000)
    }

    const handleBack = () => {
        navigate('/step3-schedule')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar bgColor="bg-gray-900" />

            <main className="relative flex-1 bg-gray-900 pt-12 pb-48 px-4 md:px-0">
                <div className="max-w-xl mx-auto mb-16 relative">
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">1. Clase</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">2. Datos</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">3. Pago</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-orange-600">4. Confirmar</span>
                        </div>
                    </div>
                    <div className="absolute top-5 left-0 w-3/4 h-0.5 bg-orange-600 z-0"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-10 tracking-tight">Reserva tu Clase</h1>
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <span className="text-orange-600">4.</span> Confirmación de Reserva
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-2xl text-green-600">check_circle</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">¡Reserva Confirmada!</h3>
                                            <p className="text-gray-400">Tu clase ha sido reservada exitosamente</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-gray-900/50 p-6 rounded-lg">
                                            <h4 className="text-lg font-semibold text-white mb-4">Detalles de tu Reserva</h4>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-orange-600">event</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Clase</p>
                                                        <p className="text-white font-medium">Crossfit</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-blue-600">calendar_today</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Fecha y Hora</p>
                                                        <p className="text-white font-medium">Lunes 20 Nov, 08:00 AM</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-purple-600">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Instructor</p>
                                                        <p className="text-white font-medium">Carlos Ruiz</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-green-600">location_on</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Ubicación</p>
                                                        <p className="text-white font-medium">NEXO Gym - Sala Principal</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-900/50 p-6 rounded-lg">
                                            <h4 className="text-lg font-semibold text-white mb-4">Información Importante</h4>

                                            <div className="space-y-3 text-sm text-gray-300">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-orange-600 mt-0.5">info</span>
                                                    <p>Llega 10 minutos antes de la clase para calentar</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-orange-600 mt-0.5">water_drop</span>
                                                    <p>Recuerda traer tu botella de agua y toalla</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-orange-600 mt-0.5">fitness_center</span>
                                                    <p>Usa ropa cómoda y calzado apropiado para entrenar</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-orange-600 mt-0.5">cancel</span>
                                                    <p>Cancela con 2 horas de anticipación sin costo</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-600/10 border border-orange-600/30 p-6 rounded-lg">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="material-symbols-outlined text-orange-600">qr_code_2</span>
                                                <h4 className="text-lg font-semibold text-white">Código de Reserva</h4>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-gray-900 tracking-wider">NXO-2024-1120</p>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-3">Presenta este código al llegar al gimnasio</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pago</h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Clase de Crossfit</span>
                                            <span className="text-white">$15.00</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Fee de reserva</span>
                                            <span className="text-white">$2.00</span>
                                        </div>

                                        <div className="border-t border-gray-700 pt-3">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span className="text-white">Total Pagado</span>
                                                <span className="text-green-600">$17.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                                            <span className="text-green-600 text-sm font-medium">Pago confirmado</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Contacto del Gimnasio</h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400">phone</span>
                                            <span className="text-gray-300">+58 412 555 0199</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400">mail</span>
                                            <span className="text-gray-300">info@nexogym.com</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-gray-400">schedule</span>
                                            <span className="text-gray-300">Lun-Vie: 6:00 AM - 10:00 PM</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        Agregar a mi Calendario
                                    </button>

                                    <button className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined">share</span>
                                        Compartir Reserva
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="custom-shape-divider-bottom">
                    <svg data-name="Layer 1" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
                        <path className="fill-gray-800" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            </main>

            <section className="bg-gray-800 pb-12 pt-10 px-4 transition-colors duration-300">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
                    <div className="w-full max-w-[320px] bg-gray-900/95 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                            <span className="text-sm font-bold text-white tracking-wide uppercase">Reserva Confirmada</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Día</span>
                                <span className="text-xs text-white font-medium">Lunes 20 Nov</span>
                            </div>
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Hora</span>
                                <span className="text-xs text-white font-medium">08:00 AM</span>
                            </div>
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Clase</span>
                                <span className="text-xs text-white font-medium">Crossfit</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Instructor</span>
                                <span className="text-xs text-white font-medium">Carlos Ruiz</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={handleBack}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-bold rounded-full transition-all uppercase text-sm tracking-wider"
                        >
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                            Atrás
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg shadow-green-600/25 transition-all uppercase text-sm tracking-wider group"
                        >
                            Confirmar Reserva
                            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">check</span>
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Step4Schedule
