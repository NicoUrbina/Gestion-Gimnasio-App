interface RoleBadgeProps {
  role: string | null | undefined;
  size?: 'sm' | 'md';
}

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: {
    label: 'Administrador',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  staff: {
    label: 'Personal',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  trainer: {
    label: 'Entrenador',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  member: {
    label: 'Miembro',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
};

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  const config = role ? roleConfig[role.toLowerCase()] : null;

  if (!config) {
    return (
      <span className={`inline-flex items-center ${sizeClasses[size]} font-semibold rounded-full bg-zinc-700/50 text-gray-400 border border-zinc-600/50`}>
        Sin rol
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
}
