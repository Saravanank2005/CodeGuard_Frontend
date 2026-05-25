// src/components/charts/SimilarityHistogram.js
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

function buildHistogram(similarities = [], binSize = 10) {
  const bins = Array.from({ length: Math.ceil(100 / binSize) }, () => 0)
  similarities.forEach(s => {
    const v = Math.max(0, Math.min(99.999, s.similarity)) // 0-100
    const idx = Math.floor(v / binSize)
    bins[idx]++
  })
  const labels = bins.map((_, i) => `${i * binSize}-${i * binSize + binSize}%`)
  return { bins, labels }
}

export default function SimilarityHistogram({ similarities = [] }) {
  const { bins, labels } = buildHistogram(similarities, 10)

  const data = {
    labels,
    datasets: [
      {
        label: 'Pairs',
        data: bins,
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: '1rem' }}>Similarity Histogram</h3>
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
