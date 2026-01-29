interface DashboardHeaderProps {
  user: {
    first_name: string;
    full_name: string;
  };
  role: string;
}

const greetings = {
  admin: {
    title: '¡Hola, Admin!',
    subtitle: 'Panel de control del sistema',
  },
  staff: {
    title: '¡Hola, Staff!',
    subtitle: 'Gestiona las operaciones del día',
  },
  trainer: {
    title: '¡Hola, Entrenador!',
    subtitle: 'Revisa tus clases y clientes',
  },
  member: {
    title: (firstName: string) => `¡Hola, ${firstName}!`,
    subtitle: '¿Listo para tu entrenamiento de hoy?',
  },
};

export default function DashboardHeader({ user, role }: DashboardHeaderProps) {
  const config = greetings[role as keyof typeof greetings] || greetings.member;
  
  const title = typeof config.title === 'function' 
    ? config.title(user.first_name) 
    : config.title;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 shadow-xl shadow-orange-500/20">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-black text-2xl border-2 border-white/30">
          {user.first_name?.charAt(0) || 'U'}
        </div>

        {/* Text */}
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-orange-100 mt-1">
            {config.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
