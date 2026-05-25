// src/components/charts/AssignmentRiskBar.js
'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function AssignmentRiskBar({ assignmentStats = [] }) {
  const labels = assignmentStats.map(a => a.assignment)
  const high = assignmentStats.map(a => a.high_risk)
  const medium = assignmentStats.map(a => a.medium_risk)
  const low = assignmentStats.map(a => a.low_risk)

  const data = {
    labels,
    datasets: [
      { label: 'High', data: high, backgroundColor: '#ef4444' },
      { label: 'Medium', data: medium, backgroundColor: '#f59e0b' },
      { label: 'Low', data: low, backgroundColor: '#10b981' }
    ]
  }

  const options = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } }
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: '1rem' }}>Risk by Assignment</h3>
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
