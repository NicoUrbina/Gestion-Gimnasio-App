import { useState } from 'react';
import { Plus, Search, CreditCard, Clock, Users, MessageSquare, Mail } from 'lucide-react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

const faqCategories = [
    {
        title: 'Membresías y Pagos',
        icon: CreditCard,
        questions: [
            {
                q: '¿Cuáles son los métodos de pago aceptados?',
                a: 'Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), tarjetas de débito, transferencias bancarias directas y efectivo en recepción. También puedes configurar pagos automáticos mensuales.',
            },
            {
                q: '¿Puedo congelar mi membresía?',
                a: 'Sí, puedes congelar tu membresía por motivos médicos o de viaje por un máximo de 30 días al año. Debes solicitarlo con al menos 5 días de anticipación en recepción o a través de tu perfil en línea.',
            },
            {
                q: '¿Hay costo de inscripción?',
                a: 'Dependiendo de la promoción vigente. Regularmente tenemos un costo único de inscripción de $20, pero en nuestros planes trimestrales y anuales la inscripción suele ser gratuita.',
            },
        ],
    },
    {
        title: 'Horarios',
        icon: Clock,
        questions: [
            {
                q: '¿Qué días abren en feriados?',
                a: 'NEXO opera los 365 días del año. Sin embargo, en días feriados nacionales, operamos con horario reducido de 8:00 AM a 4:00 PM. Anunciamos estos cambios con antelación en nuestras redes sociales.',
            },
            {
                q: '¿Cuál es el horario pico?',
                a: 'Generalmente, nuestras horas con mayor afluencia son de 6:00 PM a 8:00 PM de lunes a jueves. Si prefieres entrenar con menos gente, recomendamos las mañanas o el horario de almuerzo (1:00 PM - 3:00 PM).',
            },
        ],
    },
    {
        title: 'Entrenadores',
        icon: Users,
        questions: [
            {
                q: '¿Cómo agendar con un entrenador personal?',
                a: 'Puedes agendar directamente desde nuestra app móvil NEXO, o acercándote al mostrador de entrenadores. La primera sesión de evaluación está incluida en tu membresía mensual.',
            },
            {
                q: '¿Los entrenadores están certificados?',
                a: 'Absolutamente. Todos nuestros entrenadores cuentan con certificaciones nacionales e internacionales y pasan por un riguroso proceso de selección y capacitación continua en NEXO.',
            },
        ],
    },
    {
        title: 'Clases Grupales',
        icon: Users,
        questions: [
            {
                q: '¿Debo reservar mi cupo para las clases?',
                a: 'Sí, para garantizar tu lugar y una buena experiencia, requerimos reserva previa. Puedes reservar hasta 48 horas antes desde la app. Las clases de Yoga y Spinning suelen llenarse rápido.',
            },
            {
                q: '¿Qué debo llevar a las clases?',
                a: 'Recomendamos llevar tu propia botella de agua y toalla pequeña. Para clases como Yoga o Pilates, tenemos mats disponibles, pero puedes traer el tuyo si lo prefieres por higiene personal.',
            },
            {
                q: '¿Si llego tarde puedo entrar?',
                a: 'Por favor, llega a tiempo. Si llegas tarde, podrías perder tu lugar en la clase. Si es una situación excepcional, comunícate con nosotros con anticipación.',
            },
        ],
    },
];

const FaqItem = ({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) => (
    <div className="border-b border-zinc-700">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none group"
        >
            <h3 className="text-base font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{q}</h3>
            <Plus
                className={`w-5 h-5 text-orange-600 transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        >
            <p className="text-gray-600 pb-5 px-6 text-sm leading-relaxed">{a}</p>
        </div>
    </div>
);

export default function QuestionsPage() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const handleItemClick = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            <Navbar bgColor="bg-gray-900" />

            <main className="pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold text-orange-600 tracking-wider uppercase mb-2">AYUDA Y SOPORTE</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">PREGUNTAS FRECUENTES</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            Resuelve tus dudas sobre nuestros planes, horarios y entrenamientos. Estamos aquí para ayudarte a transformar tu vida.
                        </p>
                        <div className="mt-8 max-w-xl mx-auto relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input className="block w-full pl-12 pr-4 py-4 border border-zinc-700 rounded-lg bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-sm" placeholder="Busca una pregunta (ej. precios, horarios)" type="text" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {faqCategories.map((category, catIndex) => (
                            <div key={catIndex} className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <category.icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                                </div>
                                <div className="bg-white rounded-xl border border-zinc-700 overflow-hidden">
                                    {category.questions.map((faq, faqIndex) => {
                                        const id = `${catIndex}-${faqIndex}`;
                                        return (
                                            <FaqItem
                                                key={id}
                                                q={faq.q}
                                                a={faq.a}
                                                isOpen={openFaq === id}
                                                onClick={() => handleItemClick(id)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 bg-orange-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white">¿Aún tienes dudas?</h2>
                            <p className="text-orange-100 mt-2">Nuestro equipo de soporte está disponible 24/7 para ayudarte.</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-4">
                            <a className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-bold rounded-lg bg-white text-orange-600 hover:bg-orange-500/10 transition-colors" href="#">
                                <Mail className="w-5 h-5 mr-2" />
                                CONTÁCTANOS
                            </a>
                            <a className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-bold rounded-lg text-white hover:bg-white/10 transition-colors" href="#">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                CHAT EN VIVO
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}