import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, Scale, Calendar, Plus, BarChart3, History, GitCompare } from 'lucide-react';
import ProgressStatsCard from '../../components/progress/ProgressStatsCard';
import EmptyProgressState from '../../components/progress/EmptyProgressState';
import ChartWrapper from '../../components/progress/ChartWrapper';
import { progressService } from '../../services/progress';
import type { ProgressLog } from '../../types/progress';
import toast from 'react-hot-toast';
import MemberSelector from '../../components/progress/MemberSelector';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [latestLog, setLatestLog] = useState<ProgressLog | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // Filter logs by selected member
  const filteredLogs = useMemo(() => {
    if (!selectedMemberId) return logs;
    return logs.filter(log => log.member === selectedMemberId);
  }, [logs, selectedMemberId]);

  useEffect(() => {
    loadData();
  }, []);

  // Update latest log when filtered logs change
  useEffect(() => {
    if (filteredLogs.length > 0) {
      const sorted = [...filteredLogs].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setLatestLog(sorted[0]);
    } else {
      setLatestLog(null);
    }
  }, [filteredLogs]);

  const loadData = async () => {
    try {
      console.log('🔍 Loading progress logs...');
      setLoading(true);
      const logsData = await progressService.getLogs();
      console.log('📊 Logs received:', logsData);
      // Handle paginated response: if logsData has a 'results' property, use it; otherwise use logsData as-is
      const actualLogs = (logsData as any).results || logsData;
      console.log('📊 Actual logs array:', actualLogs);
      console.log('📊 Logs count:', actualLogs.length);
      setLogs(actualLogs);


    } catch (error: any) {
      console.error('❌ Error loading progress data:', error);
      toast.error('Error al cargar datos de progreso');
    } finally {
      setLoading(false);
    }
  };

  // Calculate change from first log to latest
  const getChange = (metric: keyof ProgressLog) => {
    if (filteredLogs.length < 2 || !latestLog) return null;

    const firstLog = [...filteredLogs].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

    const firstValue = firstLog[metric] as number | null;
    const latestValue = latestLog[metric] as number | null;

    if (firstValue && latestValue) {
      return latestValue - firstValue;
    }
    return null;
  };

  // Prepare mini chart data (last 7 entries)
  const getMiniChartData = () => {
    const sorted = [...filteredLogs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    return sorted.map(log => ({
      date: new Date(log.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      peso: log.weight || null,
      grasa: log.body_fat_percentage || null,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!latestLog) {
    return (
      <EmptyProgressState onAction={() => navigate('/progress/update')} />
    );
  }

  const weightChange = getChange('weight');
  const bodyFatChange = getChange('body_fat_percentage');
  const muscleMassChange = getChange('muscle_mass');
  const miniChartData = getMiniChartData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Member Selector (only for trainers/admins) */}
      <MemberSelector
        selectedMemberId={selectedMemberId}
        onMemberChange={setSelectedMemberId}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-orange-500" />
            Mi Progreso
          </h1>
          <p className="text-gray-500 mt-1">
            Último registro: {new Date(latestLog.date).toLocaleDateString('es-ES', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/progress/update')}
          className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Registro
        </button>
      </div>

      {/* Current Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestLog.weight && (
          <ProgressStatsCard
            title="Peso Actual"
            value={parseFloat(latestLog.weight).toFixed(1)}
            unit="kg"
            change={weightChange}
            changeLabel="desde inicio"
            icon={Scale}
            color="blue"
          />
        )}

        {latestLog.bmi && (
          <ProgressStatsCard
            title="IMC"
            value={parseFloat(latestLog.bmi).toFixed(1)}
            icon={Activity}
            color="purple"
          />
        )}

        {latestLog.body_fat_percentage && (
          <ProgressStatsCard
            title="Grasa Corporal"
            value={parseFloat(latestLog.body_fat_percentage).toFixed(1)}
            unit="%"
            change={bodyFatChange}
            changeLabel="desde inicio"
            icon={TrendingUp}
            color="orange"
          />
        )}

        {latestLog.muscle_mass && (
          <ProgressStatsCard
            title="Masa Muscular"
            value={parseFloat(latestLog.muscle_mass).toFixed(1)}
            unit="kg"
            change={muscleMassChange}
            changeLabel="desde inicio"
            icon={Activity}
            color="emerald"
          />
        )}
      </div>

      {/* Quick Chart - Last 7 entries */}
      {miniChartData.length > 1 && (
        <ChartWrapper
          title="Evolución Reciente"
          subtitle="Últimos 7 registros"
          isEmpty={false}
          isLoading={false}
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={miniChartData}>
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
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Peso (kg)"
              />
              <Line
                type="monotone"
                dataKey="grasa"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 5 }}
                name="Grasa (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/progress/evolution')}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white group-hover:text-orange-400 transition-colors">
                Ver Evolución
              </p>
              <p className="text-xs text-gray-500">Gráficas detalladas</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/progress/history')}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white group-hover:text-orange-400 transition-colors">
                Historial
              </p>
              <p className="text-xs text-gray-500">{logs.length} registros</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/progress/compare')}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-orange-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white group-hover:text-orange-400 transition-colors">
                Comparar
              </p>
              <p className="text-xs text-gray-500">Antes vs Después</p>
            </div>
          </div>
        </button>
      </div>

      {/* Summary Card */}
      {weightChange !== null && (
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase font-medium tracking-wide mb-1">
                Progreso Total
              </p>
              <p className="text-2xl font-black text-white">
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Desde tu primer registro el {new Date(logs[0].date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Last Entry Notes */}
      {latestLog.notes && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Notas del Último Registro
          </h3>
          <p className="text-gray-400 leading-relaxed">{latestLog.notes}</p>
        </div>
      )}
    </div>
  );
}
