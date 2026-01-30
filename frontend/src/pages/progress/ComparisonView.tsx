import { useState, useEffect } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { progressService } from '../../services/progress';
import type { ProgressLog } from '../../types/progress';
import toast from 'react-hot-toast';

export default function ComparisonView() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [selectedLog1, setSelectedLog1] = useState<number | ''>('');
  const [selectedLog2, setSelectedLog2] = useState<number | ''>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await progressService.getLogs();
      const sorted = data.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setLogs(sorted);

      // Auto-select first and last if available
      if (sorted.length >= 2) {
        setSelectedLog1(sorted[0].id);
        setSelectedLog2(sorted[sorted.length - 1].id);
      }
    } catch (error: any) {
      console.error('Error loading progress data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const log1 = logs.find(log => log.id === selectedLog1);
  const log2 = logs.find(log => log.id === selectedLog2);

  const calculateDifference = (value1: number | null | undefined, value2: number | null | undefined) => {
    if (!value1 || !value2) return null;
    return value2 - value1;
  };

  const renderComparison = (
    label: string,
    value1: number | null | undefined,
    value2: number | null | undefined,
    unit: string,
    lowerIsBetter = false
  ) => {
    if (!value1 && !value2) return null;

    const diff = calculateDifference(value1, value2);
    const hasDiff = diff !== null;
    const isPositive = hasDiff && diff > 0;
    const isNegative = hasDiff && diff < 0;
    const isImprovement = lowerIsBetter ? isNegative : isPositive;
    const isDecline = lowerIsBetter ? isPositive : isNegative;

    return (
      <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-zinc-700 last:border-0">
        {/* Label */}
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Antes</p>
            <p className="text-xl font-bold text-white">
              {value1 ? `${value1}${unit}` : '-'}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Ahora</p>
            <p className="text-xl font-bold text-blue-900">
              {value2 ? `${value2}${unit}` : '-'}
            </p>
          </div>
        </div>

        {/* Difference */}
        <div className="text-center">
          {hasDiff && diff !== 0 ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/50">
              {isImprovement && (
                <>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-600">
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                  </span>
                </>
              )}
              {isDecline && (
                <>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-600">
                    {diff.toFixed(1)}{unit}
                  </span>
                </>
              )}
              {!isImprovement && !isDecline && hasDiff && (
                <>
                  <Minus className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-600">
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                  </span>
                </>
              )}
            </div>
          ) : hasDiff ? (
            <span className="text-sm text-gray-500">Sin cambio</span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (logs.length < 2) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GitCompare className="w-10 h-10 text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Necesitas al menos 2 registros
        </h3>
        <p className="text-gray-500 mb-6">
          Para comparar tu progreso, necesitas tener al menos dos registros guardados.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <GitCompare className="w-7 h-7 text-orange-500" />
          Comparar Progreso
        </h1>
        <p className="text-gray-500 mt-1">Compara dos registros para ver tu evolución</p>
      </div>

      {/* Selectors */}
      <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Registro Inicial (Antes)
            </label>
            <select
              value={selectedLog1}
              onChange={(e) => setSelectedLog1(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="">Selecciona un registro...</option>
              {logs.map((log) => (
                <option key={log.id} value={log.id}>
                  {new Date(log.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {log.weight && ` - ${log.weight}kg`}
                </option>
              ))}
            </select>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Registro Final (Ahora)
            </label>
            <select
              value={selectedLog2}
              onChange={(e) => setSelectedLog2(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium bg-blue-50"
            >
              <option value="">Selecciona un registro...</option>
              {logs.map((log) => (
                <option key={log.id} value={log.id}>
                  {new Date(log.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {log.weight && ` - ${log.weight}kg`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {log1 && log2 && (
        <>
          {selectedLog1 === selectedLog2 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-medium">
                ⚠️ Has seleccionado el mismo registro dos veces. Elige fechas diferentes para compararlas.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2">Resultados de la Comparación</h2>
                <p className="text-sm text-gray-500">
                  Período: {Math.floor((new Date(log2.date).getTime() - new Date(log1.date).getTime()) / (1000 * 60 * 60 * 24))} días
                </p>
              </div>

              <div className="space-y-0">
                {renderComparison('Peso', log1.weight, log2.weight, ' kg', false)}
                {renderComparison('IMC', log1.bmi, log2.bmi, '', false)}
                {renderComparison('Grasa Corporal', log1.body_fat_percentage, log2.body_fat_percentage, '%', true)}
                {renderComparison('Masa Muscular', log1.muscle_mass, log2.muscle_mass, ' kg', false)}
                {renderComparison('Pecho', log1.chest, log2.chest, ' cm', false)}
                {renderComparison('Cintura', log1.waist, log2.waist, ' cm', true)}
                {renderComparison('Cadera', log1.hips, log2.hips, ' cm', false)}
              </div>
            </div>
          )}

          {/* Notes Comparison */}
          {(log1.notes || log2.notes) && selectedLog1 !== selectedLog2 && (
            <div className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Notas Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-bold mb-2">
                    {new Date(log1.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-white">
                    {log1.notes || <span className="text-gray-400 italic">Sin notas</span>}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-xs text-blue-600 font-bold mb-2">
                    {new Date(log2.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-blue-900">
                    {log2.notes || <span className="text-blue-400 italic">Sin notas</span>}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
