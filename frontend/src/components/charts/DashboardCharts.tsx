import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RevenueChartProps {
  data: {
    labels: string[];
    revenues: number[];
  };
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Ingresos ($)',
        data: data.revenues,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ingresos Mensuales (Últimos 6 Meses)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return '$' + value;
          }
        }
      },
    },
  };

  return <Line data={chartData} options={options} height={300} />;
}

interface PaymentMethodsChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(6, 182, 212)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Métodos de Pago',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return <Pie data={chartData} options={options} height={300} />;
}
