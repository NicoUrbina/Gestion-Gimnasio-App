import { useEffect, useState } from 'react';
import { TrendingUp, Scale, Activity, Ruler, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { progressService } from '../../services/progress';
import type { EvolutionData } from '../../types/progress';
import Spinner from '../../components/Spinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EvolutionChartsPage() {
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(90);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'composition' | 'measurements'>('weight');

  useEffect(() => {
    loadEvolution();
  }, [selectedPeriod]);

  const loadEvolution = async () => {
    try {
      setLoading(true);
      const data = await progressService.getEvolution(selectedPeriod);
      setEvolutionData(data);
    } catch (error) {
      console.error('Error loading evolution:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!evolutionData || evolutionData.dates.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-orange-500" />
            Mi Evolución Física
          </h1>
          <p className="text-gray-500 mt-1">Visualiza tu progreso a lo largo del tiempo</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No hay datos de evolución</h3>
          <p className="text-gray-500 mb-6">Registra tus medidas para ver tu progreso</p>
          <button
            onClick={() => window.location.href = '/progress/log'}
            className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold inline-flex items-center gap-2"
          >
            Registrar Medidas
          </button>
        </div>
      </div>
    );
  }

  const labels = evolutionData.dates.map(formatDate);

  // Chart configurations
  const weightChartData = {
    labels,
    datasets: [
      {
        label: 'Peso (kg)',
        data: evolutionData.weight,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const compositionChartData = {
    labels,
    datasets: [
      {
        label: '% Grasa Corporal',
        data: evolutionData.body_fat,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Masa Muscular (kg)',
        data: evolutionData.muscle_mass,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const measurementsChartData = {
    labels,
    datasets: [
      {
        label: 'Pecho (cm)',
        data: evolutionData.chest,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Cintura (cm)',
        data: evolutionData.waist,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Cadera (cm)',
        data: evolutionData.hips,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: '#334155',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Latest values
  const latestIndex = evolutionData.dates.length - 1;
  const latestWeight = evolutionData.weight[latestIndex];
  const latestBMI = evolutionData.bmi[latestIndex];
  const latestBodyFat = evolutionData.body_fat[latestIndex];

  // Changes
  const firstWeight = evolutionData.weight.find(w => w !== null);
  const weightChange = latestWeight && firstWeight ? latestWeight - firstWeight : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-orange-500" />
          Mi Evolución Física
        </h1>
        <p className="text-gray-500 mt-1">Visualiza tu progreso a lo largo del tiempo</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value={30}>Últimos 30 días</option>
            <option value={60}>Últimos 2 meses</option>
            <option value={90}>Últimos 3 meses</option>
            <option value={180}>Últimos 6 meses</option>
            <option value={365}>Último año</option>
          </select>
        </div>

        {/* Metric Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric('weight')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedMetric === 'weight'
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            }`}
          >
            Peso
          </button>
          <button
            onClick={() => setSelectedMetric('composition')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedMetric === 'composition'
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            }`}
          >
            Composición
          </button>
          <button
            onClick={() => setSelectedMetric('measurements')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedMetric === 'measurements'
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
            }`}
          >
            Medidas
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">Peso Actual</div>
              <div className="font-black text-2xl text-slate-900">{latestWeight?.toFixed(1)} kg</div>
              <div className={`text-xs font-medium ${weightChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">IMC</div>
              <div className="font-black text-2xl text-slate-900">{latestBMI?.toFixed(1)}</div>
              <div className="text-xs text-gray-500">
                {latestBMI && latestBMI < 18.5 ? 'Bajo peso' :
                 latestBMI && latestBMI < 25 ? 'Normal' :
                 latestBMI && latestBMI < 30 ? 'Sobrepeso' : 'Obesidad'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium">% Grasa</div>
              <div className="font-black text-2xl text-slate-900">
                {latestBodyFat ? `${latestBodyFat.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Composición corporal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
        <div style={{ height: '400px' }}>
          {selectedMetric === 'weight' && <Line data={weightChartData} options={chartOptions} />}
          {selectedMetric === 'composition' && <Line data={compositionChartData} options={chartOptions} />}
          {selectedMetric === 'measurements' && <Line data={measurementsChartData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
}
