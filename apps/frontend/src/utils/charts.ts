import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
)

// Validated categorical palette (see dataviz skill) — fixed hue order, never cycled.
export const CATEGORICAL_COLORS = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
]

export const STATUS_COLORS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
}

export const CHART_INK = {
  text: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
}

export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: {
      labels: { color: CHART_INK.text, usePointStyle: true, boxWidth: 8 },
    },
    tooltip: {
      backgroundColor: '#18181b',
      titleColor: '#ffffff',
      bodyColor: '#f4f4f5',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: CHART_INK.muted },
      grid: { color: 'transparent' },
      border: { color: CHART_INK.baseline },
    },
    y: {
      ticks: { color: CHART_INK.muted },
      grid: { color: CHART_INK.grid },
      border: { display: false },
      beginAtZero: true,
    },
  },
}
