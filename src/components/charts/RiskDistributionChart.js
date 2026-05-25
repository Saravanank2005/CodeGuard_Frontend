// src/components/charts/RiskDistributionChart.js
'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function RiskDistributionChart({ high = 0, medium = 0, low = 0 }) {
  const data = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [high, medium, low],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
    },
    cutout: '60%'
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: '1rem' }}>Risk Distribution</h3>
      <div style={{ position: 'relative', height: '220px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Doughnut data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
