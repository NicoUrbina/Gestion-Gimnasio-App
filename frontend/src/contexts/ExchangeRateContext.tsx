import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getBcvUsdRate } from '../services/exchangeRate';

interface ExchangeRateContextType {
  rate: number | null;
  loading: boolean;
  error: string | null;
  usdToBs: (usdAmount: number) => string | null;
  refetch: () => Promise<void>;
}

const ExchangeRateContext = createContext<ExchangeRateContextType | null>(null);

export function ExchangeRateProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBcvUsdRate();
      const parsed = parseFloat(data.usd_rate);
      if (!isNaN(parsed) && parsed > 0) {
        setRate(parsed);
      } else {
        setError('Tasa no disponible');
      }
    } catch (e) {
      setError('No se pudo obtener la tasa BCV');
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  const usdToBs = useCallback(
    (usdAmount: number): string | null => {
      if (rate == null) return null;
      const bs = usdAmount * rate;
      return bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    [rate]
  );

  return (
    <ExchangeRateContext.Provider value={{ rate, loading, error, usdToBs, refetch: fetchRate }}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRate() {
  const ctx = useContext(ExchangeRateContext);
  if (!ctx) {
    return {
      rate: null,
      loading: false,
      error: null,
      usdToBs: () => null,
      refetch: async () => {},
    };
  }
  return ctx;
}
