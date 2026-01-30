import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import ChartWrapper from '../../components/progress/ChartWrapper';
import { progressService } from '../../services/progress';
import type { EvolutionData } from '../../types/progress';
import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

type MetricType = 'weight' | 'body_fat' | 'muscle_mass' | 'measurements';
type TimeRange = 30 | 90 | 180 | 365;

export default function EvolutionCharts() {
  const [loading, setLoading] = useState(true);
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [selectedRange, setSelectedRange] = useState<TimeRange>(90);

  useEffect(() => {
    loadEvolutionData();
  }, [selectedRange]);

  const loadEvolutionData = async () => {
    try {
      setLoading(true);
      const data = await progressService.getEvolution(selectedRange);
      setEvolutionData(data);
    } catch (error: any) {
      console.error('Error loading evolution data:', error);
      toast.error('Error al cargar datos de evolución');
    } finally {
      setLoading(false);
    }
  };

  // Transform data for charts
  const getChartData = () => {
    if (!evolutionData) return [];

    return evolutionData.dates.map((date, index) => ({
      date: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      peso: evolutionData.weight[index],
      grasa: evolutionData.body_fat[index],
      músculo: evolutionData.muscle_mass[index],
      IMC: evolutionData.bmi[index],
      pecho: evolutionData.chest[index],
      cintura: evolutionData.waist[index],
      cadera: evolutionData.hips[index],
    }));
  };

  const chartData = getChartData();
  const hasData = chartData.length > 0;

  const renderChart = () => {
    switch (selectedMetric) {
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Peso (kg)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="IMC"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 5 }}
                name="IMC"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'body_fat':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="grasa"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 5 }}
                name="Grasa Corporal (%)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="músculo"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                name="Masa Muscular (kg)"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'muscle_mass':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="músculo"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                name="Masa Muscular (kg)"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'measurements':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#71717a" style={{ fontSize: '12px' }} unit=" cm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pecho"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                name="Pecho (cm)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="cintura"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 5 }}
                name="Cintura (cm)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="cadera"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 5 }}
                name="Cadera (cm)"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const metricButtons: { value: MetricType; label: string }[] = [
    { value: 'weight', label: 'Peso & IMC' },
    { value: 'body_fat', label: 'Composición Corporal' },
    { value: 'muscle_mass', label: 'Masa Muscular' },
    { value: 'measurements', label: 'Medidas' },
  ];

  const rangeButtons: { value: TimeRange; label: string }[] = [
    { value: 30, label: '1 Mes' },
    { value: 90, label: '3 Meses' },
    { value: 180, label: '6 Meses' },
    { value: 365, label: '1 Año' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-orange-500" />
          Evolución de Progreso
        </h1>
        <p className="text-gray-500 mt-1">Visualiza cómo has cambiado a lo largo del tiempo</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-4">
        {/* Metric Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Métrica a Visualizar</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {metricButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setSelectedMetric(btn.value)}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  selectedMetric === btn.value
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Rango Temporal</label>
          <div className="grid grid-cols-4 gap-2">
            {rangeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setSelectedRange(btn.value)}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  selectedRange === btn.value
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ChartWrapper
        title={
          selectedMetric === 'weight' ? 'Peso e Índice de Masa Corporal' :
          selectedMetric === 'body_fat' ? 'Composición Corporal' :
          selectedMetric === 'muscle_mass' ? 'Masa Muscular' :
          'Medidas Corporales'
        }
        subtitle={`Últimos ${selectedRange} días`}
        isLoading={loading}
        isEmpty={!loading && !hasData}
        emptyMessage="No hay datos suficientes para este período. Registra más mediciones para ver tu evolución."
      >
        {renderChart()}
      </ChartWrapper>

      {/* Info Box */}
      {hasData && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">💡 Interpreting Your Charts</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Las líneas conectan tus registros a lo largo del tiempo</li>
            <li>• Los puntos vacíos indican fechas sin datos para esa métrica</li>
            <li>• Haz hover sobre los puntos para ver valores exactos</li>
            <li>• La tendencia general es más importante que fluctuaciones diarias</li>
          </ul>
        </div>
      )}
    </div>
  );
}
