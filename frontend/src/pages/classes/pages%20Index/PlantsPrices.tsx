import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer';
import PaymentModal from '../../../components/PaymentModal';
import { Check, Minus } from 'lucide-react';

interface PlanFeature {
    feature: string;
    daily: string | boolean;
    monthly: string | boolean;
    quarterly: string | boolean;
    semiannual: string | boolean;
    annual: string | boolean;
}

const planFeatures: PlanFeature[] = [
    {
        feature: "Acceso al gimnasio",
        daily: true,
        monthly: true,
        quarterly: true,
        semiannual: true,
        annual: true
    },
    {
        feature: "Duchas y vestuarios",
        daily: true,
        monthly: true,
        quarterly: true,
        semiannual: true,
        annual: true
    },
    {
        feature: "Toalla incluida",
        daily: false,
        monthly: false,
        quarterly: true,
        semiannual: true,
        annual: true
    },
    {
        feature: "Acceso 24h",
        daily: false,
        monthly: "Limitado",
        quarterly: true,
        semiannual: true,
        annual: true
    },
    {
        feature: "Clases Grupales",
        daily: "1 clase",
        monthly: true,
        quarterly: true,
        semiannual: true,
        annual: true
    },
    {
        feature: "Evaluación Inicial",
        daily: false,
        monthly: true,
        quarterly: "+ Plan Básico",
        semiannual: "+ Plan Avanzado",
        annual: "Completa"
    },
    {
        feature: "Sesión con Entrenador Personal",
        daily: false,
        monthly: "10% Dto",
        quarterly: "15% Dto",
        semiannual: "1 Sesión/mes",
        annual: "2 Sesiones/mes"
    },
    {
        feature: "Acceso a App NEXO",
        daily: "Básica",
        monthly: "Completa",
        quarterly: "Completa",
        semiannual: "Premium",
        annual: "Premium"
    },
    {
        feature: "Invitados Gratis",
        daily: false,
        monthly: false,
        quarterly: "1 /mes",
        semiannual: "2 /mes",
        annual: "4 /mes"
    },
    {
        feature: "Congelación de Plan",
        daily: false,
        monthly: false,
        quarterly: "15 días",
        semiannual: "30 días",
        annual: "60 días"
    },
    {
        feature: "Nutricionista",
        daily: false,
        monthly: false,
        quarterly: false,
        semiannual: "Consulta Trimestral",
        annual: "Consulta Mensual"
    }
];

const renderFeatureValue = (value: string | boolean, isHighlighted: boolean = false) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    if (value === false) return <Minus className="w-4 h-4 text-white/10 mx-auto" />;
    return <span className={`text-[13px] uppercase tracking-wider ${isHighlighted ? "font-black text-orange-600" : "text-white/60 font-bold"}`}>{value}</span>;
};

export default function PlantsPrices() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ title: string; priceLine: string } | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSelectPlan = (title: string, priceLine: string) => {
        setSelectedPlan({ title, priceLine });
        setIsModalOpen(true);
    };

    return (
        <div className="bg-[#0a0a0b] min-h-screen text-white selection:bg-orange-600/30">
            <Navbar bgColor="bg-black/40" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 blur-[100px] rounded-full"></div>
            </div>

            <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-500 text-xs font-black uppercase tracking-[0.2em] mb-6">
                            MEMBRESÍAS NEXO
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Domina tu <span className="text-orange-600">Destino</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                            Diseñamos planes que se adaptan a tu nivel de compromiso. Elige la suscripción que impulsará tu transformación.
                        </p>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white-[0.05] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="sticky left-0 p-8 text-left bg-[#0a0a0b]/80 backdrop-blur-xl min-w-[280px] z-20">
                                            <span className="text-2xl font-black text-white block mb-1 tracking-tighter uppercase">Beneficios</span>
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Comparativa de planes</span>
                                        </th>

                                        {/* Plan Headers */}
                                        {[
                                            { title: "Diario", price: "3$", period: "/día", sub: "Flexible", tag: "" },
                                            { title: "Mensual", price: "25$", period: "/mes", sub: "Constante", tag: "Popular", highlight: true },
                                            { title: "Trimestral", price: "50$", period: "/3m", sub: "Ahorro", tag: "" },
                                            { title: "Semestral", price: "90$", period: "/6m", sub: "Medio", tag: "" },
                                            { title: "Anual", price: "160$", period: "/año", sub: "Elite", tag: "VIP" }
                                        ].map((plan, i) => (
                                            <th key={i} className={`p-8 align-bottom text-center min-w-[180px] ${plan.highlight ? 'bg-orange-600/[0.03] relative' : ''}`}>
                                                {plan.highlight && <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>}
                                                {plan.tag && (
                                                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${plan.highlight ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/60'}`}>
                                                        {plan.tag}
                                                    </div>
                                                )}
                                                {!plan.tag && <div className="h-7"></div>}

                                                <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tighter">{plan.title}</h3>
                                                <div className="text-3xl font-black text-white mb-1 tracking-tight">
                                                    {plan.price}
                                                    <span className="text-sm font-bold text-gray-500 lowercase ml-1">{plan.period}</span>
                                                </div>
                                                <p className="text-[10px] font-black text-gray-600 mb-6 uppercase tracking-widest">{plan.sub}</p>

                                                <button
                                                    onClick={() => handleSelectPlan(plan.title, `${plan.price} ${plan.period}`)}
                                                    className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${plan.highlight
                                                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-600/20'
                                                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                                                        }`}
                                                >
                                                    Elegir
                                                </button>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {/* Section 1 */}
                                    <tr className="bg-white/[0.02]">
                                        <td className="p-4 pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 sticky left-0 bg-[#0a0a0b]/90 backdrop-blur-xl z-20" colSpan={6}>
                                            Espacio y Equipamiento
                                        </td>
                                    </tr>
                                    {planFeatures.slice(0, 4).map((feature, index) => (
                                        <tr key={index} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="sticky left-0 p-5 pl-8 bg-[#0a0a0b]/90 backdrop-blur-xl text-white/80 font-bold text-sm border-r border-white/5 z-20 group-hover:text-white transition-colors">
                                                {feature.feature}
                                            </td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-5 text-center bg-orange-600/[0.02]">{renderFeatureValue(feature.monthly, feature.monthly === "Limitado")}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.quarterly)}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.semiannual)}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.annual)}</td>
                                        </tr>
                                    ))}

                                    {/* Section 2 */}
                                    <tr className="bg-white/[0.02]">
                                        <td className="p-4 pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 sticky left-0 bg-[#0a0a0b]/90 backdrop-blur-xl z-20" colSpan={6}>
                                            Entrenamiento y Clases
                                        </td>
                                    </tr>
                                    {planFeatures.slice(4, 7).map((feature, index) => (
                                        <tr key={index + 4} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="sticky left-0 p-5 pl-8 bg-[#0a0a0b]/90 backdrop-blur-xl text-white/80 font-bold text-sm border-r border-white/5 z-20 group-hover:text-white transition-colors">
                                                {feature.feature}
                                            </td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-5 text-center bg-orange-600/[0.02]">{renderFeatureValue(feature.monthly)}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.quarterly, typeof feature.quarterly === "string" && feature.quarterly.includes("+"))}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.semiannual, typeof feature.semiannual === "string" && feature.semiannual.includes("+"))}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.annual, feature.annual === "Completa")}</td>
                                        </tr>
                                    ))}

                                    {/* Section 3 */}
                                    <tr className="bg-white/[0.02]">
                                        <td className="p-4 pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 sticky left-0 bg-[#0a0a0b]/90 backdrop-blur-xl z-20" colSpan={6}>
                                            Servicios Premium
                                        </td>
                                    </tr>
                                    {planFeatures.slice(7).map((feature, index) => (
                                        <tr key={index + 7} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="sticky left-0 p-5 pl-8 bg-[#0a0a0b]/90 backdrop-blur-xl text-white/80 font-bold text-sm border-r border-white/5 z-20 group-hover:text-white transition-colors">
                                                {feature.feature}
                                            </td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-5 text-center bg-orange-600/[0.02]">{renderFeatureValue(feature.monthly)}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.quarterly, typeof feature.quarterly === "string" && (feature.quarterly.includes("/") || feature.quarterly.includes("días")))}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.semiannual, typeof feature.semiannual === "string" && (feature.semiannual.includes("/") || feature.semiannual.includes("días") || feature.semiannual.includes("Consulta")))}</td>
                                            <td className="p-5 text-center">{renderFeatureValue(feature.annual, typeof feature.annual === "string" && (feature.annual.includes("/") || feature.annual.includes("días") || feature.annual.includes("Consulta")))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlan}
            />
        </div>
    );
}
