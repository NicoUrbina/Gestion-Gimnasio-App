export default function CardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-orange-500/5 to-transparent" />
      
      {/* Icon placeholder */}
      <div className="w-12 h-12 bg-slate-800 rounded-xl mb-4 animate-pulse" />
      
      {/* Title */}
      <div className="h-4 w-1/3 bg-slate-700 rounded mb-3 animate-pulse" />
      
      {/* Value */}
      <div className="h-8 w-2/3 bg-slate-800 rounded mb-2 animate-pulse" />
      
      {/* Subtitle */}
      <div className="h-3 w-1/2 bg-slate-700 rounded animate-pulse" />

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
