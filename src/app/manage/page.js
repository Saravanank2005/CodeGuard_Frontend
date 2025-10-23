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
              Manage <span className="gradient-text">Uploaded Files</span>
            </h2>
            <p className="hero-subtitle">
              View, manage and delete all uploaded submissions
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
              <i className="fas fa-file-code"></i>
              <div>
                <h3>{stats.totalFiles}</h3>
                <p>Total Files</p>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-hdd"></i>
              <div>
                <h3>{stats.totalSize} KB</h3>
                <p>Storage Used</p>
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
                    <i className="fas fa-folder"></i>
                  </div>
                  <div className="submission-info">
                    <h4>{sub.assignment_name}</h4>
                    <p>
                      <i className="fas fa-users"></i> {sub.total_students || sub.files_count} student(s) | 
                      <i className="fas fa-calendar"></i> {sub.timestamp} | 
                      <i className="fas fa-check-circle"></i> {sub.status}
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
                    <i className="fas fa-trash"></i>
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
