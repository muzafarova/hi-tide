'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)
import { Chart } from "react-chartjs-2";

type ChartProps = {
  data: ChartData<'line' | 'scatter', {x: string, y: number}[]>
}

export default function LevelChart({ data }: ChartProps) {
   const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    elements: {
      line: {
        tension: 0.5,
        borderDash: [10, 5],
        cubicInterpolationMode: 'monotone' as const,
      },
    },
    scales: {
      x: {

      }
    }
  };

    return (
      <Chart
        type="line"
        options={options}
        data={data}
      />
    )
  }