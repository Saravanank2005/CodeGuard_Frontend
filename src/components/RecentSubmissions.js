// src/components/RecentSubmissions.js
'use client'

export default function RecentSubmissions({ submissions = [] }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, border: '1px solid rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontWeight: 800, marginBottom: 12 }}>Recent Submissions</h3>
      {(!submissions || submissions.length === 0) ? (
        <p style={{ color: '#64748b' }}>No recent submissions.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {submissions.map((s, i) => (
            <li key={i} style={{ padding: '10px 0', borderBottom: i < submissions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ fontWeight: 700 }}>{s.assignment_name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {s.total_students} students • {new Date(s.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
