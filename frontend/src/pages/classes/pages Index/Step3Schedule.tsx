import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer'
import { CreditCard, Wallet, Banknote, ShieldCheck, ChevronRight, ChevronLeft, CheckCircle2, Lock } from 'lucide-react'

const Step3Schedule = () => {
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState('credit-card')
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCardData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNext = () => {
        navigate('/step4-schedule')
    }

    const handleBack = () => {
        navigate('/step2-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Payment */}
                    <div className="flex-1 space-y-12">
                        {/* Stepper Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Paso 3 de 4
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                Configura tu <span className="text-orange-600">Pago</span>
                            </h1>
                            <p className="text-gray-500 font-medium text-lg max-w-xl">
                                Selecciona el método de tu preferencia y asegura tu lugar en la clase.
                            </p>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'credit-card', label: 'Tarjeta', icon: CreditCard },
                                { id: 'paypal', label: 'PayPal', icon: Wallet },
                                { id: 'cash', label: 'Efectivo', icon: Banknote },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex flex-col items-center gap-4 p-8 rounded-3xl border transition-all ${paymentMethod === method.id
                                            ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/20 active:scale-95'
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white'
                                        }`}
                                >
                                    <method.icon className="w-8 h-8" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Payment Details Form */}
                        {paymentMethod === 'credit-card' ? (
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 space-y-8 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Número de Tarjeta</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                                <CreditCard className="w-5 h-5" />
                                            </span>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardData.cardNumber}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700 font-mono tracking-widest"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Expiración (MM/AA)</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={cardData.expiryDate}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                            placeholder="12/25"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">CVC / CVP</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-600 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </span>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={cardData.cvv}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all placeholder:text-gray-700"
                                                placeholder="•••"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-orange-600/5 border border-orange-600/10 rounded-2xl">
                                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tight">Transacción Protegida por protocolos bancarios de grado militar.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center space-y-6 animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto border border-orange-600/20">
                                    {paymentMethod === 'paypal' ? <Wallet className="w-8 h-8 text-orange-600" /> : <Banknote className="w-8 h-8 text-orange-600" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">
                                        {paymentMethod === 'paypal' ? 'Continuar con PayPal' : 'Pago en Recepción'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                                        {paymentMethod === 'paypal'
                                            ? 'Serás redirigido a la plataforma segura de PayPal para finalizar.'
                                            : 'Puedes pagar en efectivo o punto de venta al llegar al Box.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Actions */}
                        <div className="flex items-center gap-4 pt-4">
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
                                Finalizar Reserva
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Preview/Summary */}
                    <div className="lg:w-96">
                        <div className="sticky top-32 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                                Resumen del Pedido
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Reserva Clase</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">$15.00</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Service Fee</span>
                                        <span className="text-white text-xs font-black uppercase tracking-tighter">$2.00</span>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex justify-between items-center px-2">
                                        <span className="text-sm font-black text-white uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-black text-orange-600 uppercase tracking-tighter">$17.00</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest font-mono">ORDER #NXO-192</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none">
                                        Al confirmar, aceptas nuestras políticas de cancelación.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 opacity-40">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Paso 1 Completado</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 opacity-40">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Paso 2 Completado</span>
                                    </div>
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

export default Step3Schedule
