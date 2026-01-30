import Navbar from "../../../components/Navbar"
import Footer from "../../../components/footer"
import { ShieldCheck, Scale, FileText, AlertCircle } from 'lucide-react'

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30 font-['Outfit']">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Legal & Compliance
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            Términos y <span className="text-orange-600">Condiciones</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            Última actualización: 30 de Enero, 2026
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <FileText className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">1. Aceptación de los Términos</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Al acceder y utilizar la plataforma de NEXO Gym, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <Scale className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">2. Uso del Servicio</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Los servicios de NEXO Gym están diseñados para gestionar entrenamientos y clases. Usted se compromete a utilizar la plataforma de manera responsable y a no interferir con su funcionamiento normal. El uso indebido de los servicios resultará en la suspensión inmediata de la cuenta.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/5 pt-12">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <ShieldCheck className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">3. Privacidad y Datos</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Su privacidad es fundamental para nosotros. La recopilación y el uso de su información personal se rigen por nuestra Política de Privacidad. Al utilizar NEXO Gym, usted consiente el tratamiento de sus datos conforme a dicha política.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/5 pt-12">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <AlertCircle className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">4. Limitación de Responsabilidad</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                NEXO Gym no se hace responsable de las lesiones físicas que puedan ocurrir durante el uso de nuestras instalaciones o el seguimiento de las rutinas sugeridas por nuestros instructores. Se recomienda consultar a un médico antes de iniciar cualquier programa de ejercicio intenso.
                            </p>
                        </section>

                    </div>

                    <div className="mt-12 text-center text-gray-500 text-sm">
                        ¿Tienes dudas sobre nuestros términos? <a href="/contacto" className="text-orange-600 font-bold hover:underline">Contáctanos</a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
