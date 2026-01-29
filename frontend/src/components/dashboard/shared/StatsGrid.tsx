import { ReactNode } from 'react';

interface StatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export default function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {children}
    </div>
  );
}
