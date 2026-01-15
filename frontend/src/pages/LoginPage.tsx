import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom'; // Asumiendo que usas React Router

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del login:', formData);
    // Aquí iría tu lógica de conexión con el backend
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans">

      {/* 1. IMAGEN DE FONDO */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src="/public/img/fondoLogin.jpg"
          alt="Fondo de Login"
          className="w-full h-full object-cover"
        />
        {/* Capa oscura superpuesta para que se lea el texto (Overlay) */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
      </div>

      {/* 2. TARJETA DE LOGIN (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl mx-4">

        {/* LOGO (Centrado Arriba) */}
        <div className="flex justify-center mb-0.5">
          <img
            src="/video/nexo-logo.png"
            alt="Logo Nexo"
            className="h-20 w-auto object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wider">
          INICIAR <span className="text-orange-500">SESIÓN</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input: Email */}
          <div className="space-y-2">
            <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-2">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Input: Contraseña */}
          <div className="space-y-2">
            <div className="relative flex items-center border-b border-gray-500 focus-within:border-orange-500 transition-colors py-2">
              <Lock className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg mt-6"
          >
            INICIAR SESIÓN
          </button>

          {/* Enlaces del Footer */}
          <div className="text-center space-y-3 mt-6 text-sm">
            <a href="#" className="block text-gray-300 hover:text-white transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
            <p className="text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-white font-semibold underline hover:text-orange-500 transition-colors">
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
