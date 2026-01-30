import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ChartWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  rightElement?: ReactNode;
}

export default function ChartWrapper({
  children,
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No hay datos suficientes para mostrar esta gráfica',
  rightElement,
}: ChartWrapperProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {rightElement && (
          <div className="flex-shrink-0">
            {rightElement}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}

        {!isLoading && isEmpty && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        )}

        {!isLoading && !isEmpty && (
          <div>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
