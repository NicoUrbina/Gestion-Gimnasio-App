interface UserStatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'md';
}

export default function UserStatusBadge({ isActive, size = 'md' }: UserStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  if (isActive) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} font-semibold rounded-full bg-green-500/20 text-green-400`}>
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        Activo
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} font-semibold rounded-full bg-red-500/20 text-red-400`}>
      <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
      Inactivo
    </span>
  );
}
