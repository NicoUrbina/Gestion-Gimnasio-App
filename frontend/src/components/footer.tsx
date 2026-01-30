import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="w-full bg-black text-white pt-16 pb-8 border-t-4 border-orange-600 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
                    <div className="space-y-0">
                        {/* AQUÍ VA TU LOGO EXACTAMENTE COMO EN EL HEADER */}
                        <Link to="/" className="inline-block">
                            <img
                                src="/Img/nexo-logo.png"
                                alt="Nexo Gym Logo"
                                className="h-25 object-contain"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Supera tus límites. Entrena con tecnología de punta y los mejores profesionales. Tu transformación comienza aquí.
                        </p>

                        {/* REDES SOCIALES (Círculos Naranjas al pasar el mouse) */}
                        <div className="flex gap-4">
                            <SocialLink Icon={Facebook} />
                            <SocialLink Icon={Instagram} />
                            <SocialLink Icon={Twitter} />
                        </div>
                    </div>

                    {/* COLUMNA 2: ENLACES RÁPIDOS */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 tracking-wide text-white">
                            NAVEGACIÓN
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <FooterLink to="/">Inicio</FooterLink>
                            <FooterLink to="/#classes">Clases y Horarios</FooterLink>
                            <FooterLink to="/planes-y-precios">Planes y Precios</FooterLink>
                            <FooterLink to="/entrenadores">Nuestros Entrenadores</FooterLink>
                        </ul>
                    </div>

                    {/* COLUMNA 3: LEGAL Y AYUDA */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 tracking-wide text-white">
                            SOPORTE
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <FooterLink to="/preguntas-frecuentes">Preguntas Frecuentes</FooterLink>
                            <FooterLink to="/terminos">Términos y Condiciones</FooterLink>
                            <FooterLink to="/privacidad">Política de Privacidad</FooterLink>
                            <FooterLink to="/trabaja-con-nosotros">Trabaja con nosotros</FooterLink>
                        </ul>
                    </div>

                    {/* COLUMNA 4: CONTACTO DIRECTO */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 tracking-wide text-white">
                            CONTACTO
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>C.C. Gran Plaza, Nivel 2, Local 24-B.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>+58 (412) 555-0199</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="break-all">info@nexogym.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* BARRA INFERIOR (COPYRIGHT) */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} GIMNASIO NEXO. Todos los derechos reservados.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Diseñado con <span className="text-orange-600 text-lg">●</span> potencia pura.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Componente pequeño para los Links (Hover Naranja)
const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <li>
        <Link
            to={to}
            className="hover:text-orange-500 hover:pl-2 transition-all duration-300 block"
            onClick={() => {
                if (to.includes('#')) {
                    const id = to.split('#')[1];
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
        >
            {children}
        </Link>
    </li>
);

// Componente pequeño para los Iconos Sociales
const SocialLink = ({ Icon }: { Icon: React.ComponentType<{ size?: number }> }) => (
    <a
        href="#"
        className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300"
    >
        <Icon size={18} />
    </a>
);

export default Footer;