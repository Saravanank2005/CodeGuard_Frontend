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
                  <div className="submission-icon">
                    <i className={sub.submission_mode === 'paste' ? 'fas fa-paste' : 'fas fa-folder'} />
                  </div>
                  <div className="submission-info">
                    <h4>
                      {sub.assignment_name}
                      {sub.language && (
                        <span style={{
                          marginLeft: '0.6rem',
                          fontSize: '0.72rem',
                          background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                          border: '1px solid rgba(102,126,234,0.2)',
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)',
                          color: '#5a67d8',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {sub.language}
                        </span>
                      )}
                      {sub.submission_mode === 'paste' && (
                        <span style={{
                          marginLeft: '0.4rem',
                          fontSize: '0.72rem',
                          background: 'linear-gradient(135deg, rgba(118,75,162,0.1), rgba(236,72,153,0.08))',
                          border: '1px solid rgba(118,75,162,0.2)',
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)',
                          color: '#764ba2',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}>
                          <i className="fas fa-paste" style={{ marginRight: '4px', fontSize: '0.7rem' }}></i> Pasted
                        </span>
                      )}
                    </h4>
                    <p>
                      <i className="fas fa-users" /> {sub.total_students || sub.files_count} student(s) | 
                      <i className="fas fa-calendar" /> {sub.timestamp} | 
                      <i className="fas fa-check-circle" /> {sub.status}
                    </p>
                    {sub.files && sub.files.length > 0 && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        <strong>Students:</strong><br/>
                        {sub.files.map((f, idx) => (
                          <div key={idx} style={{ marginLeft: '10px' }}>
                            • {f.student_id || `Student ${idx + 1}`}: {f.filename}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(sub.id)}
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
