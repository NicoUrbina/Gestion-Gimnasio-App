import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'

const Step2Schedule = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        emergencyContact: '',
        emergencyPhone: '',
        healthConditions: '',
        fitnessLevel: 'principiante',
        goals: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-orange-600">2. Datos</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="text-sm font-bold">3</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">3. Pago</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="text-sm font-bold">4</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">4. Confirmar</span>
                        </div>
                    </div>
                    <div className="absolute top-5 left-0 w-1/4 h-0.5 bg-orange-600 z-0"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-10 tracking-tight">Reserva tu Clase</h1>
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <span className="text-orange-600">2.</span> Datos Personales
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                    placeholder="+34 000 000 000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all [color-scheme:dark]"
                                />
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
                            <span className="material-symbols-outlined text-orange-600 text-xl">event_available</span>
                            <span className="text-sm font-bold text-white tracking-wide uppercase">Resumen de Clase</span>
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
                            onClick={handleNext}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg shadow-orange-600/25 transition-all uppercase text-sm tracking-wider group"
                        >
                            Siguiente
                            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Step2Schedule
