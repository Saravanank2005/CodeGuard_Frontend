// src/components/TopSuspectsTable.js
'use client'

export default function TopSuspectsTable({ suspects = [] }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontWeight: 800, marginBottom: 12 }}>Top Suspects</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Student ID</th>
              <th style={thStyle}>High-Risk</th>
              <th style={thStyle}>Medium-Risk</th>
              <th style={thStyle}>Avg Similarity</th>
              <th style={thStyle}>Comparisons</th>
            </tr>
          </thead>
          <tbody>
            {suspects.map((s, i) => (
              <tr key={i}>
                <td style={tdStyle}>#{i + 1}</td>
                <td style={tdStyle}>{s.student_id}</td>
                <td style={tdStyle}>{s.high_risk_count}</td>
                <td style={tdStyle}>{s.medium_risk_count}</td>
                <td style={tdStyle}>{s.avg_similarity?.toFixed(0)}%</td>
                <td style={tdStyle}>{s.total_submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #e5e7eb',
  background: '#f8fafc',
}

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #f1f5f9',
}
