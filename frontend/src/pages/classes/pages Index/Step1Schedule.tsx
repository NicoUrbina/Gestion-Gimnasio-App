import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'

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
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar bgColor="bg-gray-900" />

            <main className="relative flex-1 bg-gray-900 pt-24 pb-48 px-4 md:px-0">
                <div className="max-w-4xl mx-auto mb-16 relative">
                    <div className="flex justify-center items-center relative z-10 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                                </div>
                                <span className="text-sm md:text-base font-semibold text-orange-600">1. Clase</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-gray-700 mx-2"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                    <span className="text-sm font-bold">2</span>
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-500">2. Datos</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-gray-700 mx-2"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                    <span className="text-sm font-bold">3</span>
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-500">3. Pago</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-gray-700 mx-2"></div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                    <span className="text-sm font-bold">4</span>
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-500">4. Confirmar</span>
                            </div>
                        </div>
                        <div className="absolute top-6 left-0 w-1/4 h-0.5 bg-orange-600 z-0"></div>
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">Reserva tu Clase</h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">Selecciona tu clase, horario e instructor</p>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
                            <span className="text-orange-600">1.</span> Selección de Clase
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 block">Día</label>
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full bg-gray-700 border-orange-600/50 border rounded-xl py-4 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all appearance-none"
                                >
                                    <option value="Lunes 20 Nov" className="bg-gray-900">Lunes 20 Nov</option>
                                    <option value="Martes 21 Nov" className="bg-gray-900">Martes 21 Nov</option>
                                    <option value="Miércoles 22 Nov" className="bg-gray-900">Miércoles 22 Nov</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 block">Hora</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full bg-gray-700 border-orange-600/50 border rounded-xl py-4 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all appearance-none"
                                >
                                    <option value="08:00 AM" className="bg-gray-900">08:00 AM</option>
                                    <option value="10:00 AM" className="bg-gray-900">10:00 AM</option>
                                    <option value="06:00 PM" className="bg-gray-900">06:00 PM</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 block">Clase</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full bg-gray-700 border-orange-600/50 border rounded-xl py-4 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all appearance-none"
                                >
                                    <option value="Crossfit" className="bg-gray-900">Crossfit</option>
                                    <option value="Yoga Flow" className="bg-gray-900">Yoga Flow</option>
                                    <option value="Boxeo" className="bg-gray-900">Boxeo</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 block">Instructor</label>
                                <select
                                    value={selectedInstructor}
                                    onChange={(e) => setSelectedInstructor(e.target.value)}
                                    className="w-full bg-gray-700 border-orange-600/50 border rounded-xl py-4 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all appearance-none"
                                >
                                    <option value="Carlos Ruiz" className="bg-gray-900">Carlos Ruiz</option>
                                    <option value="Elena Gómez" className="bg-gray-900">Elena Gómez</option>
                                    <option value="Marcos Silva" className="bg-gray-900">Marcos Silva</option>
                                </select>
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
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={handleBack}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-bold rounded-full transition-all uppercase text-sm tracking-wider"
                        >
                            Atrás
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg shadow-orange-600/25 transition-all uppercase text-sm tracking-wider group"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Step1Schedule