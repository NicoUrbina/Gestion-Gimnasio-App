import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle2, Loader2, User, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        title: string;
        priceLine: string;
    } | null;
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
    const [step, setStep] = useState<'customer_info' | 'payment_info' | 'processing' | 'success'>('customer_info');
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [paymentData, setPaymentData] = useState({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    // Reset step when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep('customer_info');
        }
    }, [isOpen]);

    if (!isOpen || !plan) return null;

    // Validation Helpers
    const onlyLetters = (val: string) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
    const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, '');
    const formatCardNumber = (val: string) => {
        const raw = val.replace(/\s?/g, '').replace(/[^0-9]/g, '');
        return raw.replace(/(\d{4})/g, '$1 ').trim();
    };
    const formatExpiry = (val: string) => {
        const raw = val.replace(/[^0-9]/g, '');
        if (raw.length <= 2) return raw;
        return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerData.phone.length < 7) {
            alert("Teléfono inválido");
            return;
        }
        setStep('payment_info');
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
            alert("Número de tarjeta incompleto");
            return;
        }
        if (paymentData.expiry.length < 5) {
            alert("Fecha de expiración incompleta");
            return;
        }
        if (paymentData.cvv.length < 3) {
            alert("CVV incompleto");
            return;
        }
        setStep('processing');
        // Simulate payment processing
        setTimeout(() => {
            setStep('success');
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                    <div
                        className="h-full bg-orange-600 transition-all duration-500 ease-out"
                        style={{
                            width: step === 'customer_info' ? '25%' :
                                step === 'payment_info' ? '50%' :
                                    step === 'processing' ? '75%' : '100%'
                        }}
                    />
                </div>

                {/* Header */}
                <div className="relative p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                            Inscripción Nexo Gym
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            {step === 'success' ? '¡Bienvenido!' : 'Finalizar Plan'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">Plan: <span className="text-gray-900 font-semibold">{plan.title}</span></span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-sm font-bold text-orange-600">{plan.priceLine}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="relative p-6 sm:p-8">

                    {/* STEP 1: CUSTOMER INFO */}
                    {step === 'customer_info' && (
                        <form onSubmit={handleNextStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                                    <User className="w-4 h-4 text-orange-600" />
                                    Datos del Cliente
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Nombre Completo (Solo letras)</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                maxLength={50}
                                                placeholder="Ej. Juan Pérez"
                                                value={customerData.name}
                                                onChange={(e) => setCustomerData({ ...customerData, name: onlyLetters(e.target.value) })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Correo Electrónico</label>
                                            <input
                                                required
                                                type="email"
                                                maxLength={60}
                                                placeholder="juan@ejemplo.com"
                                                value={customerData.email}
                                                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Teléfono (Solo números)</label>
                                            <input
                                                required
                                                type="tel"
                                                maxLength={15}
                                                placeholder="9112345678"
                                                value={customerData.phone}
                                                onChange={(e) => setCustomerData({ ...customerData, phone: onlyNumbers(e.target.value) })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Siguiente: Datos de pago
                            </button>
                        </form>
                    )}

                    {/* STEP 2: PAYMENT INFO */}
                    {step === 'payment_info' && (
                        <form onSubmit={handlePayment} className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                                        <CreditCard className="w-4 h-4 text-orange-600" />
                                        Información de Pago
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => setStep('customer_info')}
                                        className="text-xs text-orange-600 font-bold hover:underline"
                                    >
                                        Volver
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Titular (Solo letras)</label>
                                        <input
                                            required
                                            type="text"
                                            maxLength={50}
                                            placeholder="JUAN PEREZ"
                                            value={paymentData.cardHolder}
                                            onChange={(e) => setPaymentData({ ...paymentData, cardHolder: onlyLetters(e.target.value).toUpperCase() })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all uppercase font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Número de Tarjeta</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <CreditCard className="w-5 h-5" />
                                            </span>
                                            <input
                                                required
                                                type="text"
                                                maxLength={19}
                                                placeholder="0000 0000 0000 0000"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Expira (MM/AA)</label>
                                            <input
                                                required
                                                type="text"
                                                maxLength={5}
                                                placeholder="MM/AA"
                                                value={paymentData.expiry}
                                                onChange={(e) => setPaymentData({ ...paymentData, expiry: formatExpiry(e.target.value) })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">CVV</label>
                                            <input
                                                required
                                                type="text"
                                                maxLength={4}
                                                placeholder="123"
                                                value={paymentData.cvv}
                                                onChange={(e) => setPaymentData({ ...paymentData, cvv: onlyNumbers(e.target.value) })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    Tus pagos se procesan de forma segura a través de pasarelas encriptadas.
                                    <span className="font-bold text-gray-700"> No almacenamos los datos de tu tarjeta.</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest rounded-xl shadow-xl active:scale-[0.98] transition-all"
                            >
                                Pagar y Suscribirme
                            </button>
                        </form>
                    )}

                    {/* STEP 3: PROCESSING */}
                    {step === 'processing' && (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-pulse">
                            <Loader2 className="w-16 h-16 text-orange-600 animate-spin mb-6 stroke-[1.5]" />
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Procesando...</h3>
                            <p className="text-gray-500 text-sm max-w-[200px]">
                                Validando suscripción de <span className="text-gray-900 font-bold">{customerData.name}</span>.
                            </p>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600 stroke-[2]" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">¡Todo Listo!</h3>
                            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-[320px]">
                                Gracias <span className="text-gray-900 font-black">{customerData.name}</span>. Hemos enviado la información de tu plan <span className="text-orange-600 font-bold">{plan.title}</span> a <span className="font-medium text-gray-900">{customerData.email}</span>.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/20"
                            >
                                Comenzar ahora
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                {step !== 'success' && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-50">
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SSL Secure</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-50">
                            <ShieldCheck className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PCI-DSS</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
