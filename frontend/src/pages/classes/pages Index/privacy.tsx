import Navbar from "../../../components/Navbar"
import Footer from "../../../components/footer"
import { Shield, Eye, Lock, Database } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-orange-600/30 font-['Outfit']">
            <Navbar bgColor="bg-black/40" />

            <main className="relative pt-32 pb-24 px-6 md:px-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Data Protection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            Política de <span className="text-orange-600">Privacidad</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            Tu privacidad es nuestra prioridad número uno.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <Eye className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">1. Recopilación de Información</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Recopilamos información personal básica como su nombre, correo electrónico y datos de contacto cuando se registra en NEXO Gym. También podemos recopilar datos sobre su actividad física y preferencias para personalizar su experiencia de entrenamiento.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <Database className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">2. Uso de Datos</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Sus datos se utilizan exclusivamente para gestionar su membresía, facilitar la reserva de clases con instructores y enviarle actualizaciones importantes sobre nuestros servicios. Nunca venderemos sus datos a terceros ni los utilizaremos con fines publicitarios ajenos a NEXO Gym.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/10 pt-12">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <Lock className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">3. Seguridad de la Información</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Implementamos protocolos de seguridad de última generación para proteger sus datos personales contra accesos no autorizados, alteraciones o divulgaciones indebidas. La seguridad de su información es un compromiso constante para nuestro equipo técnico.
                            </p>
                        </section>

                        <section className="space-y-4 border-t border-white/10 pt-12">
                            <div className="flex items-center gap-3 text-orange-600 mb-2">
                                <Shield className="w-6 h-6" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">4. Sus Derechos</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Si desea ejercer estos derechos o tiene preguntas adicionales, puede ponerse en contacto con nuestro equipo de soporte a través de la sección de contacto.
                            </p>
                        </section>

                    </div>

                    <div className="mt-12 text-center text-gray-500 text-sm">
                        ¿Preguntas sobre tus datos? <a href="/contacto" className="text-orange-600 font-bold hover:underline">Escríbenos</a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
