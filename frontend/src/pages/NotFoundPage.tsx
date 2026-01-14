import { AlertTriangle, Home, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-4">
            404
          </h2>
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
          Página No Encontrada
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver Atrás
          </button>

          <a
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
          >
            <Home className="w-5 h-5" />
            Ir al Dashboard
          </a>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Enlaces Rápidos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Miembros', href: '/members', icon: Search },
              { label: 'Membresías', href: '/memberships', icon: Search },
              { label: 'Clases', href: '/classes', icon: Search },
              { label: 'Pagos', href: '/payments', icon: Search },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
