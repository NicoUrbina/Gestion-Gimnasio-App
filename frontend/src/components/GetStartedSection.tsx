import { ArrowUpRight, Mail, MapPin, Phone, Zap } from "lucide-react"
import { Link } from "react-router-dom"

interface GetStartedSectionProps {
    showCommunity?: boolean
}

export default function GetStartedSection({ showCommunity = true }: GetStartedSectionProps) {
    return (
        <section id="contact" className="bg-[#111] py-24 px-4 sm:px-6 lg:px-8 font-sans text-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                        Construyamos tu <span className="text-orange-500">legado.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Elige tu camino o contáctanos directamente. Nuestro equipo está listo para elevar tu rendimiento.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Get Started Form Card */}
                        <div className="bg-[#1c1c1c] rounded-3xl p-8 flex flex-col justify-between min-h-[500px] hover:bg-[#222] transition-colors duration-300">
                            <div>
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                                    <Zap className="text-white w-6 h-6" fill="currentColor" />
                                </div>
                                <h3 className="text-3xl font-bold mb-2">Comienza Ahora</h3>
                                <p className="text-gray-400 mb-8">
                                    Déjanos tus datos y te contactaremos.
                                </p>

                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            className="w-full bg-[#2a2a2a] border-none rounded-2xl px-4 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Número de Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+58 412 123 4567"
                                            className="w-full bg-[#2a2a2a] border-none rounded-2xl px-4 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors uppercase tracking-wide"
                                    >
                                        Solicitar Llamada
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Top Row of Right Column */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Membresía Card */}
                            <Link to="/planes-y-precios" className="bg-[#1c1c1c] rounded-3xl overflow-hidden relative group min-h-[240px]">
                                <div className="absolute inset-0 bg-black/40 z-10 block group-hover:bg-black/20 transition-colors" />
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop')` }}
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20">
                                    <h3 className="text-2xl font-black uppercase">Membresía</h3>
                                </div>
                            </Link>

                            {/* Elite Coaching Card */}
                            <Link to="/entrenadores" className="bg-orange-500 rounded-3xl p-6 flex flex-col justify-between min-h-[240px] text-black group hover:bg-orange-400 transition-colors relative overflow-hidden">
                                <ArrowUpRight className="absolute top-6 right-6 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                                <div className="mt-auto">
                                    <h3 className="text-3xl font-black uppercase leading-none tracking-tight">
                                        Elite<br />Coaching
                                    </h3>
                                </div>
                            </Link>
                        </div>

                        {/* Middle Row of Right Column */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Main Studio Card */}
                            <div className="bg-[#1c1c1c] rounded-3xl p-6 flex flex-col justify-center min-h-[240px] hover:bg-[#222] transition-colors">
                                <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4 text-orange-500">
                                    <MapPin size={24} fill="currentColor" className="text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Main Studio</h3>
                                <p className="text-gray-400 text-sm">
                                    C.C. Gran Plaza<br />
                                    Nivel 2, Local 24-B
                                </p>
                            </div>

                            {/* Contact Info Card */}
                            <div className="bg-[#1c1c1c] rounded-3xl p-8 flex flex-col justify-center min-h-[240px] hover:bg-[#222] transition-colors">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <a href="mailto:info@nexogym.com" className="text-gray-200 font-medium hover:text-orange-500 transition-colors">info@nexogym.com</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-orange-500 shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <a href="tel:+584125550199" className="text-gray-200 font-medium hover:text-orange-500 transition-colors">+58 (412) 555-0199</a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row - Training Programs & Community */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Training Programs Card */}
                            <div className="bg-[#1c1c1c] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-[#222] transition-colors">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Programas de Entrenamiento</h3>
                                    <p className="text-gray-400 max-w-sm">
                                        Planes personalizados para cada nivel, desde principiante hasta atleta profesional.
                                    </p>
                                </div>

                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#1c1c1c] bg-gray-300 overflow-hidden relative z-[${i}]`}>
                                            <img
                                                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                                alt="Member"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-[#1c1c1c] bg-orange-500 flex items-center justify-center text-black font-bold text-xs relative z-10">
                                        +4k
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile-only Community Card (or just place it in the grid flow) */}
                {showCommunity && (
                    <div className="mt-6 grid grid-cols-1 lg:hidden">
                        <div className="bg-[#1c1c1c] rounded-3xl p-8 relative overflow-hidden group min-h-[200px] flex flex-col justify-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50"
                                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')` }}
                            />
                            <div className="relative z-20">
                                <h3 className="text-2xl font-bold mb-2">Nuestra Comunidad</h3>
                                <p className="text-gray-300 text-sm">
                                    Únete a más de 5,000 atletas superando sus límites cada día en NEXO.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
