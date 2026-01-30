import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'

const Step3Schedule = () => {
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState('credit-card')
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setCardData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method)
    }

    const handleNext = () => {
        navigate('/step4-schedule')
    }

    const handleBack = () => {
        navigate('/step2-schedule')
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
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                                <span className="material-symbols-outlined text-xl">check</span>
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-orange-600">3. Pago</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-700 mx-2 -mt-7"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="text-sm font-bold">4</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500">4. Confirmar</span>
                        </div>
                    </div>
                    <div className="absolute top-5 left-0 w-2/4 h-0.5 bg-orange-600 z-0"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-10 tracking-tight">Reserva tu Clase</h1>
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <span className="text-orange-600">3.</span> Método de Pago
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Selecciona Método de Pago</h3>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-xl cursor-pointer hover:border-orange-600 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="credit-card"
                                                checked={paymentMethod === 'credit-card'}
                                                onChange={() => handlePaymentMethodChange('credit-card')}
                                                className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 focus:ring-orange-600"
                                            />
                                            <span className="material-symbols-outlined text-orange-600">credit_card</span>
                                            <span className="text-white">Tarjeta de Crédito/Débito</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-xl cursor-pointer hover:border-orange-600 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={() => handlePaymentMethodChange('paypal')}
                                                className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 focus:ring-orange-600"
                                            />
                                            <span className="material-symbols-outlined text-blue-600">account_balance</span>
                                            <span className="text-white">PayPal</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border border-gray-700 rounded-xl cursor-pointer hover:border-orange-600 transition-colors">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => handlePaymentMethodChange('cash')}
                                                className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 focus:ring-orange-600"
                                            />
                                            <span className="material-symbols-outlined text-green-600">payments</span>
                                            <span className="text-white">Efectivo (en el gimnasio)</span>
                                        </label>
                                    </div>
                                </div>

                                {paymentMethod === 'credit-card' && (
                                    <div className="space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                        <h3 className="text-lg font-semibold text-white mb-4">Información de la Tarjeta</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-400 ml-1">Número de Tarjeta</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={cardData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-400 ml-1">Nombre del Titular</label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={cardData.cardName}
                                                    onChange={handleInputChange}
                                                    placeholder="JUAN PÉREZ"
                                                    className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-400 ml-1">Fecha Vencimiento</label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={cardData.expiryDate}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/AA"
                                                        className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-400 ml-1">CVV</label>
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={cardData.cvv}
                                                        onChange={handleInputChange}
                                                        placeholder="123"
                                                        className="w-full bg-transparent border-orange-600/50 border rounded-xl py-3 px-4 text-white focus:ring-orange-600 focus:border-orange-600 outline-none transition-all placeholder:text-gray-600"
                                                    />
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="saveCard"
                                                    checked={cardData.saveCard}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 rounded focus:ring-orange-600"
                                                />
                                                <span className="text-gray-300">Guardar tarjeta para futuras compras</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                        <span className="material-symbols-outlined text-4xl text-blue-600 mb-4">account_balance</span>
                                        <p className="text-gray-300">Serás redirigido a PayPal para completar el pago</p>
                                    </div>
                                )}

                                {paymentMethod === 'cash' && (
                                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                        <span className="material-symbols-outlined text-4xl text-green-600 mb-4">payments</span>
                                        <p className="text-gray-300">Paga en efectivo cuando llegues al gimnasio</p>
                                        <p className="text-sm text-gray-400 mt-2">Horario: 6:00 AM - 10:00 PM</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pedido</h3>

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
                                                <span className="text-white">Total</span>
                                                <span className="text-orange-600">$17.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">Detalles de la Clase</h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Día</span>
                                            <span className="text-white">Lunes 20 Nov</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Hora</span>
                                            <span className="text-white">08:00 AM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Clase</span>
                                            <span className="text-white">Crossfit</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Instructor</span>
                                            <span className="text-white">Carlos Ruiz</span>
                                        </div>
                                    </div>
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
                            Pagar y Confirmar
                            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Step3Schedule
