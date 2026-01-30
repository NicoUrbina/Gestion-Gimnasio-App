import { useState, useEffect } from 'react'
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

    // Validation & Formatting Helpers
    const onlyLetters = (val: string) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
    const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, '');
    const formatCardNumber = (val: string) => {
        const raw = val.replace(/\s/g, '').replace(/[^0-9]/g, '');
        return raw.replace(/(\d{4})/g, '$1 ').trim();
    };
    const formatExpiry = (val: string) => {
        const raw = val.replace(/[^0-9]/g, '');
        if (raw.length <= 2) return raw;
        return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        if (paymentMethod === 'credit-card') {
            if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
                alert("Número de tarjeta incompleto")
                return
            }
            if (cardData.expiryDate.length < 5) {
                alert("Fecha de expiración incompleta")
                return
            }
            if (cardData.cvv.length < 3) {
                alert("CVV incompleto")
                return
            }
        }
        navigate('/step4-schedule')
    }

    const handleBack = () => {
        navigate('/step2-schedule')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">

                    {/* Stepper Header */}
                    <div className="flex justify-between items-center mb-16 max-w-2xl mx-auto px-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600/50">Clase</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-orange-600/30 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600/50">Datos</span>
                        </div>
                        <div className="flex-1 h-[2px] bg-orange-600/30 mx-4 mb-8"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/20 ring-4 ring-orange-600/10">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-600">Pago</span>
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
                            PASO 3 • MÉTODO DE PAGO
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Seguridad <span className="text-orange-600">Total</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Procesamos tus pagos de forma segura y encriptada. Elige el método que prefieras.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Payment Selection */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white-[0.05] p-8 md:p-10 shadow-2xl overflow-hidden">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">Elegir método</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('credit-card')}
                                        className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${paymentMethod === 'credit-card' ? 'bg-orange-600/10 border-orange-600 shadow-lg shadow-orange-600/5' : 'bg-white/5 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <CreditCard className={`w-8 h-8 ${paymentMethod === 'credit-card' ? 'text-orange-600' : 'text-gray-500'}`} />
                                        <span className={`text-xs font-black uppercase tracking-wider ${paymentMethod === 'credit-card' ? 'text-white' : 'text-gray-500'}`}>Tarjeta</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${paymentMethod === 'paypal' ? 'bg-blue-600/10 border-blue-600 shadow-lg shadow-blue-600/5' : 'bg-white/5 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <Wallet className={`w-8 h-8 ${paymentMethod === 'paypal' ? 'text-blue-500' : 'text-gray-500'}`} />
                                        <span className={`text-xs font-black uppercase tracking-wider ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-500'}`}>PayPal</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${paymentMethod === 'cash' ? 'bg-green-600/10 border-green-600 shadow-lg shadow-green-600/5' : 'bg-white/5 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <Banknote className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-green-500' : 'text-gray-500'}`} />
                                        <span className={`text-xs font-black uppercase tracking-wider ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-500'}`}>Efectivo</span>
                                    </button>
                                </div>

                                {paymentMethod === 'credit-card' && (
                                    <form id="payment-form" onSubmit={handleNext} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Titular de la tarjeta (Letras)</label>
                                                <input
                                                    required
                                                    type="text"
                                                    maxLength={50}
                                                    placeholder="JUAN PEREZ"
                                                    value={cardData.cardName}
                                                    onChange={(e) => setCardData({ ...cardData, cardName: onlyLetters(e.target.value).toUpperCase() })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all uppercase"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Número de Tarjeta</label>
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
                                                        <CreditCard className="w-5 h-5" />
                                                    </span>
                                                    <input
                                                        required
                                                        type="text"
                                                        maxLength={19}
                                                        placeholder="0000 0000 0000 0000"
                                                        value={cardData.cardNumber}
                                                        onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Expiración (MM/AA)</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        maxLength={5}
                                                        placeholder="MM/AA"
                                                        value={cardData.expiryDate}
                                                        onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiry(e.target.value) })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all text-center"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">CVV</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        maxLength={4}
                                                        placeholder="123"
                                                        value={cardData.cvv}
                                                        onChange={(e) => setCardData({ ...cardData, cvv: onlyNumbers(e.target.value) })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-4 focus:ring-orange-600/20 focus:border-orange-600 outline-none transition-all text-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                                            <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                                                    PAGO ENCRIPTADO <Lock className="w-3 h-3" />
                                                </p>
                                                <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold">
                                                    TUS DATOS ESTÁN PROTEGIDOS POR SSL DE 256 BITS. NO ALMACENAMOS LA INFORMACIÓN DE TU TARJETA EN NUESTROS SERVIDORES.
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-12 text-center space-y-4">
                                        <Wallet className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Redirect a PayPal</h4>
                                        <p className="text-gray-500 text-sm max-w-sm mx-auto">Serás redirigido a la plataforma segura de PayPal para completar tu transacción de forma instantánea.</p>
                                    </div>
                                )}

                                {paymentMethod === 'cash' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-12 text-center space-y-4">
                                        <Banknote className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-xl font-black uppercase tracking-tighter">Reserva en Local</h4>
                                        <p className="text-gray-500 text-sm max-w-sm mx-auto">Tu lugar quedará pre-reservado. Deberás abonar el monto total en la recepción del gimnasio antes de iniciar la clase.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl sticky top-32">
                                <h3 className="text-lg font-black uppercase tracking-widest mb-8 text-white flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                    Detalle Final
                                </h3>

                                <div className="space-y-4 text-sm font-bold">
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="text-gray-500 uppercase tracking-widest text-[10px]">Sesión Única</span>
                                        <span className="text-white">$15.00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="text-gray-500 uppercase tracking-widest text-[10px]">Reserva Online</span>
                                        <span className="text-green-500">GRATIS</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-white uppercase tracking-[0.2em] font-black text-xs">Total</span>
                                        <span className="text-2xl font-black text-orange-600">$15.00</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <button
                                        form="payment-form"
                                        type="submit"
                                        onClick={paymentMethod !== 'credit-card' ? handleNext : undefined}
                                        className="w-full group flex items-center justify-center gap-3 px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 active:scale-[0.98] transition-all"
                                    >
                                        Pagar Ahora
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </button>
                                    <button
                                        onClick={handleBack}
                                        className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-all text-[11px] py-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Modificar datos
                                    </button>
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

// Icon for detail
function Clock({ className, ...props }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

export default Step3Schedule
