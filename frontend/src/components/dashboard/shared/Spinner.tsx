import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 
        className={`${sizeClasses[size]} text-orange-500 animate-spin ${className}`} 
      />
    </div>
  );
}
