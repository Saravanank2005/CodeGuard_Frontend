// src/components/DashboardCards.js
'use client'

export default function DashboardCards({
  totalStudents = 0,
  totalSubmissions = 0,
  totalComparisons = 0,
  highRiskCount = 0
}) {
  const cards = [
    { label: 'Students', value: totalStudents, icon: 'fa-users', color: 'purple' },
    { label: 'Submissions', value: totalSubmissions, icon: 'fa-file-code', color: 'blue' },
    { label: 'Comparisons', value: totalComparisons, icon: 'fa-chart-line', color: 'green' },
    { label: 'High-Risk Pairs', value: highRiskCount, icon: 'fa-exclamation-triangle', color: 'red' },
  ]

  return (
    <div className="stats-overview">
      {cards.map((c, idx) => (
        <div key={idx} className="stat-card">
          <div className={`stat-icon ${c.color}`}>
            <i className={`fas ${c.icon}`}></i>
          </div>
          <div className="stat-info">
            <h3>{c.label}</h3>
            <div className="stat-value">{c.value || 0}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
