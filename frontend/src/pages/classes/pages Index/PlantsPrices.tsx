import Navbar from '../../../components/Navbar'
import Footer from '../../../components/footer';

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
    if (value === true) return <span className="text-green-600 font-semibold">✓</span>;
    if (value === false) return <span className="text-gray-400">-</span>;
    return <span className={`text-sm ${isHighlighted ? "font-semibold text-orange-600" : "text-gray-500"}`}>{value}</span>;
};

export default function PlantsPrices() {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            <Navbar bgColor="bg-gray-900" />

            <main className="pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold text-orange-600 tracking-wider uppercase mb-2">Membresías</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">PLANES Y PRECIOS</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            Compara nuestras opciones y elige el plan que mejor se adapte a tu ritmo de entrenamiento y objetivos.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="sticky left-0 p-6 bg-white min-w-[250px] align-bottom z-10">
                                            <span className="text-2xl font-bold text-gray-900 block mb-2">Características</span>
                                            <span className="text-sm text-gray-500 font-normal">Desglose completo de beneficios</span>
                                        </th>
                                        <th className="p-6 align-bottom text-center min-w-[180px]">
                                            <div className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-700 mb-4">
                                                Flexible
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">Por Día</h3>
                                            <div className="text-3xl font-black text-orange-600 mb-1">3$ <span className="text-base font-normal text-gray-500">/día</span></div>
                                            <p className="text-xs text-gray-500 mb-4">Acceso básico</p>
                                            <button className="w-full py-2 px-4 rounded-lg bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-sm transition-colors duration-200">
                                                Elegir
                                            </button>
                                        </th>
                                        <th className="p-6 align-bottom text-center min-w-[180px] bg-orange-50 relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
                                            <div className="inline-block px-3 py-1 rounded-full bg-orange-600 text-xs font-semibold text-white mb-4 shadow-lg shadow-orange-600/30">
                                                Más Popular
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">Por Mes</h3>
                                            <div className="text-3xl font-black text-orange-600 mb-1">25$ <span className="text-base font-normal text-gray-500">/mes</span></div>
                                            <p className="text-xs text-gray-500 mb-4">Para constantes</p>
                                            <button className="w-full py-2 px-4 rounded-lg bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all duration-200 transform hover:-translate-y-0.5">
                                                Elegir
                                            </button>
                                        </th>
                                        <th className="p-6 align-bottom text-center min-w-[180px]">
                                            <div className="inline-block px-3 py-1 rounded-full bg-gray-200 text-xs font-semibold text-gray-700 mb-4">
                                                Ahorro
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">3 Meses</h3>
                                            <div className="text-3xl font-black text-orange-600 mb-1">50$ <span className="text-base font-normal text-gray-500">/3 meses</span></div>
                                            <p className="text-xs text-gray-500 mb-4">Mejor valor</p>
                                            <button className="w-full py-2 px-4 rounded-lg bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-sm transition-colors duration-200">
                                                Elegir
                                            </button>
                                        </th>
                                        <th className="p-6 align-bottom text-center min-w-[180px]">
                                            <div className="invisible px-3 py-1 mb-4 text-xs">Spacer</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">6 Meses</h3>
                                            <div className="text-3xl font-black text-orange-600 mb-1">90$ <span className="text-base font-normal text-gray-500">/6 meses</span></div>
                                            <p className="text-xs text-gray-500 mb-4">Compromiso medio</p>
                                            <button className="w-full py-2 px-4 rounded-lg bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-sm transition-colors duration-200">
                                                Elegir
                                            </button>
                                        </th>
                                        <th className="p-6 align-bottom text-center min-w-[180px]">
                                            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-xs font-semibold text-white mb-4">
                                                VIP
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">Anual</h3>
                                            <div className="text-3xl font-black text-orange-600 mb-1">160$ <span className="text-base font-normal text-gray-500">/año</span></div>
                                            <p className="text-xs text-gray-500 mb-4">Máximo ahorro</p>
                                            <button className="w-full py-2 px-4 rounded-lg bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-bold text-sm transition-colors duration-200">
                                                Elegir
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="bg-gray-50">
                                        <td className="p-4 pl-6 text-sm font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 z-10" colSpan={6}>
                                            Acceso e Instalaciones
                                        </td>
                                    </tr>
                                    {planFeatures.slice(0, 4).map((feature, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="sticky left-0 p-4 pl-6 bg-white text-gray-700 font-medium border-r border-gray-200 z-10">
                                                {feature.feature}
                                            </td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-4 text-center bg-orange-50">{renderFeatureValue(feature.monthly, feature.monthly === "Limitado")}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.quarterly)}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.semiannual)}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.annual)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td className="p-4 pl-6 text-sm font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 z-10" colSpan={6}>
                                            Entrenamiento y Clases
                                        </td>
                                    </tr>
                                    {planFeatures.slice(4, 7).map((feature, index) => (
                                        <tr key={index + 4} className="hover:bg-gray-50 transition-colors">
                                            <td className="sticky left-0 p-4 pl-6 bg-white text-gray-700 font-medium border-r border-gray-200 z-10">
                                                {feature.feature}
                                            </td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-4 text-center bg-orange-50">{renderFeatureValue(feature.monthly)}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.quarterly, typeof feature.quarterly === "string" && feature.quarterly.includes("+"))}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.semiannual, typeof feature.semiannual === "string" && feature.semiannual.includes("+"))}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.annual, feature.annual === "Completa")}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td className="p-4 pl-6 text-sm font-bold uppercase tracking-wider text-gray-500 sticky left-0 bg-gray-50 z-10" colSpan={6}>
                                            Servicios Extra
                                        </td>
                                    </tr>
                                    {planFeatures.slice(7).map((feature, index) => (
                                        <tr key={index + 7} className="hover:bg-gray-50 transition-colors">
                                            <td className="sticky left-0 p-4 pl-6 bg-white text-gray-700 font-medium border-r border-gray-200 z-10">
                                                {feature.feature}
                                            </td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.daily)}</td>
                                            <td className="p-4 text-center bg-orange-50">{renderFeatureValue(feature.monthly)}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.quarterly, typeof feature.quarterly === "string" && (feature.quarterly.includes("/") || feature.quarterly.includes("días")))}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.semiannual, typeof feature.semiannual === "string" && (feature.semiannual.includes("/") || feature.semiannual.includes("días") || feature.semiannual.includes("Consulta")))}</td>
                                            <td className="p-4 text-center">{renderFeatureValue(feature.annual, typeof feature.annual === "string" && (feature.annual.includes("/") || feature.annual.includes("días") || feature.annual.includes("Consulta")))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
