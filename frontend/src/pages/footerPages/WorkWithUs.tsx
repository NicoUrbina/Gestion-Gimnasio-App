import Navbar from '../../components/Navbar';
import Footer from '../../components/footer';

interface JobPosition {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    typeColor: string;
    responsibilities: string[];
    requirements: string[];
}

const jobPositions: JobPosition[] = [
    {
        id: 1,
        title: "Entrenador Personal",
        department: "Departamento de Fitness",
        location: "Madrid, España",
        type: "Tiempo Completo",
        typeColor: "green",
        responsibilities: [
            "Diseñar planes de entrenamiento personalizados y seguimiento de objetivos.",
            "Liderar sesiones individuales y grupales de alta intensidad."
        ],
        requirements: [
            "Certificación oficial en Fitness o Grado en CAFYD.",
            "Mínimo 2 años de experiencia en entrenamiento personal."
        ]
    },
    {
        id: 2,
        title: "Nutricionista Deportivo",
        department: "Salud y Bienestar",
        location: "Barcelona, España",
        type: "Medio Tiempo",
        typeColor: "blue",
        responsibilities: [
            "Realizar evaluaciones antropométricas y planes nutricionales específicos.",
            "Asesorar a socios sobre suplementación y hábitos saludables."
        ],
        requirements: [
            "Grado en Nutrición Humana y Dietética.",
            "Especialización demostrable en nutrición deportiva."
        ]
    },
    {
        id: 3,
        title: "Gerente de Recepción",
        department: "Operaciones",
        location: "Valencia, España",
        type: "Tiempo Completo",
        typeColor: "green",
        responsibilities: [
            "Coordinar el equipo de atención al cliente y gestión de altas.",
            "Supervisar la experiencia del socio y resolución de incidencias."
        ],
        requirements: [
            "Experiencia previa en gestión de equipos de servicios.",
            "Excelentes habilidades de comunicación y liderazgo."
        ]
    }
];

const benefits: Benefit[] = [
    {
        icon: "card_membership",
        title: "Membresía Gratuita",
        description: "Acceso total VIP a todas nuestras instalaciones, zona de spa y clases dirigidas sin costo alguno."
    },
    {
        icon: "school",
        title: "Desarrollo Profesional",
        description: "Cursos de certificación internacional y talleres de especialización pagados por la empresa."
    },
    {
        icon: "payments",
        title: "Salario Competitivo",
        description: "Sueldo base superior al mercado, bonos por retención de clientes y comisiones por rendimiento."
    },
    {
        icon: "schedule",
        title: "Horarios Flexibles",
        description: "Turnos adaptables para conciliar tu vida personal, estudios y tiempo libre."
    }
];

interface Benefit {
    icon: string;
    title: string;
    description: string;
}

const getTypeColorClasses = (color: string) => {
    switch (color) {
        case "green":
            return "bg-green-900/20 text-green-400 border-green-800/50";
        case "blue":
            return "bg-blue-900/20 text-blue-400 border-blue-800/50";
        default:
            return "bg-gray-900/20 text-gray-400 border-gray-800/50";
    }
};

const WorkWithUs = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            <Navbar bgColor="bg-gray-900" />

            <main>
                {/* Hero Section */}
                <div className="relative w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black pointer-events-none z-10"></div>
                    <div
                        className="relative min-h-[550px] flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjMGldfDTcg3_1g23ToQSd96F4DwtcRT0SwEEZLtB2kkNnKdk8jJZ71lE2ybhyvR3BE9VIP_Y44JRxFqTfJWyM1i92Dz6t_Ut0w4NZBex-JiX1lSgSe1omkSCvGqN_tsXzD9mjO-_IfhLMbSVOYknzHWmdz3uJLB2yP57OOlUpdHaEnpd0Ezqh5ZWM1hX60GdAfNP2UvRRj2riQYFJhFOElKJqKlPfQX27YOQLCKQoWFizb6UAlmmX_9QJeW3gH1sWELyH39R44pot")'
                        }}
                    >
                        <div className="z-20 flex flex-col gap-6 text-center max-w-[800px] px-4">
                            <h1 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg uppercase">
                                Tu carrera empieza aquí
                            </h1>
                            <p className="text-gray-100 text-lg md:text-xl font-medium leading-normal drop-shadow-md max-w-2xl mx-auto">
                                Únete a la familia NEXO y transforma vidas. Buscamos pasión, energía y compromiso para construir el futuro del fitness.
                            </p>
                            <div className="pt-4 flex justify-center">
                                <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-orange-600 hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-600/30 text-white text-base font-bold leading-normal">
                                    Ver Vacantes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="w-full relative py-20 overflow-hidden bg-gray-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-600/12 opacity-40 blur-3xl pointer-events-none rounded-full"></div>
                    <div className="max-w-[1280px] mx-auto px-4 sm:px-10 relative z-10">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-4 text-center md:text-left">
                                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight uppercase">
                                    Por qué elegir NEXO
                                </h2>
                                <p className="text-gray-400 text-lg font-normal max-w-[720px]">
                                    Más que un gimnasio, somos una comunidad. Disfruta de beneficios diseñados para tu crecimiento profesional y personal.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Benefit 1 */}
                                <div className="group flex flex-col gap-5 rounded-xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm p-8 hover:border-orange-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/10">
                                    <div className="text-orange-600 p-3 bg-orange-600/10 rounded-lg w-fit group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                        <img
                                            src={`${import.meta.env.BASE_URL}Img/1Membresia.png`}
                                            alt="Membresía Gratuita"
                                            className="w-8 h-8 object-contain animate-pulse"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-white text-xl font-bold leading-tight">Membresía Gratuita</h3>
                                        <p className="text-gray-400 text-sm font-normal leading-relaxed">
                                            Acceso total VIP a todas nuestras instalaciones, zona de spa y clases dirigidas sin costo alguno.
                                        </p>
                                    </div>
                                </div>

                                {/* Benefit 2 */}
                                <div className="group flex flex-col gap-5 rounded-xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm p-8 hover:border-orange-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/10">
                                    <div className="text-orange-600 p-3 bg-orange-600/10 rounded-lg w-fit group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                        <img
                                            src={`${import.meta.env.BASE_URL}Img/2Desarrollo.png`}
                                            alt="Desarrollo Profesional"
                                            className="w-8 h-8 object-contain animate-pulse"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-white text-xl font-bold leading-tight">Desarrollo Profesional</h3>
                                        <p className="text-gray-400 text-sm font-normal leading-relaxed">
                                            Cursos de certificación internacional y talleres de especialización pagados por la empresa.
                                        </p>
                                    </div>
                                </div>

                                {/* Benefit 3 */}
                                <div className="group flex flex-col gap-5 rounded-xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm p-8 hover:border-orange-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/10">
                                    <div className="text-orange-600 p-3 bg-orange-600/10 rounded-lg w-fit group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                        <img
                                            src={`${import.meta.env.BASE_URL}Img/3Pagos.png`}
                                            alt="Salario Competitivo"
                                            className="w-8 h-8 object-contain animate-pulse"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-white text-xl font-bold leading-tight">Salario Competitivo</h3>
                                        <p className="text-gray-400 text-sm font-normal leading-relaxed">
                                            Sueldo base superior al mercado, bonos por retención de clientes y comisiones por rendimiento.
                                        </p>
                                    </div>
                                </div>

                                {/* Benefit 4 */}
                                <div className="group flex flex-col gap-5 rounded-xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm p-8 hover:border-orange-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/10">
                                    <div className="text-orange-600 p-3 bg-orange-600/10 rounded-lg w-fit group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                                        <img
                                            src={`${import.meta.env.BASE_URL}Img/4Tiempo.png`}
                                            alt="Horarios Flexibles"
                                            className="w-8 h-8 object-contain animate-pulse"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-white text-xl font-bold leading-tight">Horarios Flexibles</h3>
                                        <p className="text-gray-400 text-sm font-normal leading-relaxed">
                                            Turnos adaptables para conciliar tu vida personal, estudios y tiempo libre.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Positions Section */}
                <div className="w-full bg-gray-900 py-12 border-t border-gray-700">
                    <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-700/50">
                                <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] uppercase">Posiciones Abiertas</h2>
                                <span className="text-gray-400 text-sm">Mostrando {jobPositions.length} vacantes</span>
                            </div>
                            <div className="w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead>
                                            <tr className="bg-gray-800 border-b border-gray-700">
                                                <th className="px-6 py-4 text-left text-gray-400 text-xs font-bold uppercase tracking-wider w-[20%]">Puesto</th>
                                                <th className="px-6 py-4 text-left text-gray-400 text-xs font-bold uppercase tracking-wider w-[20%]">Ubicación / Tipo</th>
                                                <th className="px-6 py-4 text-left text-gray-400 text-xs font-bold uppercase tracking-wider w-[60%]">Detalles del Puesto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {jobPositions.map((position) => (
                                                <tr key={position.id} className="group hover:bg-gray-800/80 transition-colors duration-200">
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="flex flex-col">
                                                            <span className="text-white text-base font-bold group-hover:text-orange-600 transition-colors">{position.title}</span>
                                                            <span className="text-gray-400 text-xs mt-1 uppercase tracking-wider">{position.department}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                                {position.location}
                                                            </div>
                                                            <span className={`inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${getTypeColorClasses(position.typeColor)}`}>
                                                                {position.type}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col gap-6">
                                                            <div className="grid grid-cols-2 gap-8">
                                                                <div>
                                                                    <h4 className="text-orange-600 text-[11px] font-black uppercase mb-2 tracking-widest">Responsabilidades</h4>
                                                                    <ul className="text-gray-300 text-sm space-y-1.5 list-disc pl-4">
                                                                        {position.responsibilities.map((resp, index) => (
                                                                            <li key={index}>{resp}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-orange-600 text-[11px] font-black uppercase mb-2 tracking-widest">Requisitos</h4>
                                                                    <ul className="text-gray-300 text-sm space-y-1.5 list-disc pl-4">
                                                                        {position.requirements.map((req, index) => (
                                                                            <li key={index}>{req}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <button className="w-64 mx-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                                                                <span>Aplicar al Puesto</span>
                                                                <img
                                                                    src={`${import.meta.env.BASE_URL}Img/FlechaTrabajaNosotros.png`}
                                                                    alt="Flecha"
                                                                    className="w-4 h-4 object-contain"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                                    Ver todas las vacantes antiguas
                                    <span className="material-symbols-outlined text-[16px]">history</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default WorkWithUs;
