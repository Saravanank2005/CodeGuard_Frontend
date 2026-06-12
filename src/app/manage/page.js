// src/app/manage/page.js
'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getSubmissions, deleteSubmission } from '@/lib/api'

export default function ManagePage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 })

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const data = await getSubmissions()
      setSubmissions(data)
      
      // Calculate total files and size from all submissions
      let totalFilesCount = 0
      let totalSize = 0
      
      data.forEach(sub => {
        totalFilesCount += sub.files_count || 0
        if (sub.files) {
          sub.files.forEach(file => {
            totalSize += file.size || 0
          })
        }
      })
      
      setStats({
        totalFiles: totalFilesCount,
        totalSize: (totalSize / 1024).toFixed(2)
      })
    } catch (error) {
      alert(`Error loading submissions: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return

    try {
      await deleteSubmission(filename)
      alert('File deleted successfully!')
      loadSubmissions()
    } catch (error) {
      alert(`Error deleting file: ${error.message}`)
    }
  }

  return (
    <>
      <Header />
      
      <div className="main-container">
        <div className="manage-section">
          {/* Title Section - Match Home Page Style */}
          <div className="hero-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div className="hero-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h2 className="main-title">
              Manage <span className="gradient-text">Submissions</span>
            </h2>
            <p className="hero-subtitle">
              View and delete all submissions — uploaded files and pasted code
            </p>
            <button 
              onClick={loadSubmissions}
              className="action-button"
              style={{ marginTop: '1rem' }}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>

          {/* Stats Cards - Match Statistics Page */}
          <div className="submissions-stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-file-code"></i>
              </div>
              <div className="stat-info">
                <h3>Total Files</h3>
                <div className="stat-value">{stats.totalFiles}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-hdd"></i>
              </div>
              <div className="stat-info">
                <h3>Storage Used</h3>
                <div className="stat-value">{stats.totalSize} KB</div>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="submissions-list">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                No submissions found
              </p>
            ) : (
              submissions.map((sub, index) => (
                <div key={sub.id || index} className="submission-card">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(sub.id)}
                    title="Delete submission"
                  >
                    <i className="fas fa-trash" />
                  </button>

                  <div className="submission-icon">
                    <i className={sub.submission_mode === 'paste' ? 'fas fa-paste' : 'fas fa-folder'} />
                  </div>

                  <div className="submission-info">
                    <h4>
                      {sub.assignment_name}
                      {sub.language && (
                        <span className="submission-badge">
                          {sub.language}
                        </span>
                      )}
                      {sub.submission_mode === 'paste' && (
                        <span className="submission-badge pasted">
                          <i className="fas fa-paste" /> Pasted
                        </span>
                      )}
                    </h4>

                    <div className="submission-meta">
                      <span>
                        <i className="fas fa-users" /> 
                        <strong>{sub.total_students || sub.files_count}</strong> student(s)
                      </span>
                      <span>
                        <i className="fas fa-calendar" /> 
                        {sub.timestamp}
                      </span>
                      <span>
                        <i className="fas fa-check-circle" /> 
                        <strong style={{ color: '#22c55e' }}>{sub.status}</strong>
                      </span>
                    </div>

                    {sub.files && sub.files.length > 0 && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#666', paddingTop: '0.75rem', borderTop: '1px solid rgba(226, 232, 240, 0.4)' }}>
                        <strong style={{ color: 'var(--dark)' }}>Students:</strong>
                        {sub.files.map((f, idx) => (
                          <div key={idx} style={{ marginLeft: '0', marginTop: '0.3rem', color: 'var(--gray)' }}>
                            • {f.student_id || `Student ${idx + 1}`}: <code style={{ fontSize: '0.8rem', background: 'rgba(102, 126, 234, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>{f.filename}</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
