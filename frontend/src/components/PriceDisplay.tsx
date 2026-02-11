import { useExchangeRate } from '../contexts/ExchangeRateContext';

/** Parsea "25$ /mes" o "3$ /día" a { amount: 25, suffix: " /mes" } */
export function parsePriceLine(priceLine: string): { amount: number; suffix: string } {
  const match = priceLine.match(/\$?\s*([\d.]+)\s*\$?\s*(.*)/);
  if (match) {
    const amount = parseFloat(match[1]);
    const suffix = (match[2] || '').trim();
    return { amount: isNaN(amount) ? 0 : amount, suffix: suffix ? ` ${suffix}` : '' };
  }
  return { amount: 0, suffix: '' };
}

interface PriceDisplayProps {
  /** Precio en USD (ignorado si se usa priceLine) */
  amountUsd?: number;
  /** Alternativa: línea de precio "25$ /mes" para parsear */
  priceLine?: string;
  /** Sufijo opcional (ej: "/mes", "/día") */
  suffix?: string;
  /** Clases para el contenedor principal */
  className?: string;
  /** Tamaño del precio principal: 'lg' | 'md' | 'sm' */
  size?: 'lg' | 'md' | 'sm';
  /** Mostrar equivalente en Bs incluso si no hay tasa (mostrar "---" o similar) */
  alwaysShowBs?: boolean;
  /** Clase de color para el precio principal (ej: text-white, text-orange-600) */
  priceColorClass?: string;
  /** Clase de color para el equivalente en Bs (ej: text-white/80) */
  bsColorClass?: string;
}

const sizeClasses = {
  lg: 'text-3xl',
  md: 'text-xl',
  sm: 'text-lg',
};

export default function PriceDisplay({
  amountUsd,
  priceLine,
  suffix = '',
  className = '',
  size = 'md',
  alwaysShowBs = true,
  priceColorClass = 'text-orange-600',
  bsColorClass = 'text-gray-500',
}: PriceDisplayProps) {
  const { rate, loading, usdToBs } = useExchangeRate();
  const resolved = priceLine ? parsePriceLine(priceLine) : { amount: amountUsd ?? 0, suffix };
  const amount = resolved.amount;
  const suffixStr = resolved.suffix || suffix;
  const bsFormatted = usdToBs(amount);

  return (
    <div className={className}>
      <div className={`font-black ${priceColorClass} ${sizeClasses[size]} leading-tight`}>
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        {suffixStr && <span className="text-base font-normal text-gray-500">{suffixStr}</span>}
      </div>
      {(alwaysShowBs || bsFormatted) && (
        <div className={`text-xs mt-0.5 ${bsColorClass}`}>
          {loading ? (
            <span className="animate-pulse">Bs. ---</span>
          ) : bsFormatted ? (
            <>Bs. {bsFormatted}{suffixStr}</>
          ) : (
            <span>Bs. ---{suffixStr}</span>
          )}
        </div>
      )}
    </div>
  );
}
