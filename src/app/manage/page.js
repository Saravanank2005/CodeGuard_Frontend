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
      
      const totalSize = data.reduce((sum, sub) => sum + (sub.size || 0), 0)
      setStats({
        totalFiles: data.length,
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
                <div key={index} className="submission-card">
                  <div className="submission-icon">
                    <i className="fas fa-file-code"></i>
                  </div>
                  <div className="submission-info">
                    <h4>{sub.filename}</h4>
                    <p>
                      <i className="fas fa-calendar"></i> {sub.timestamp || 'N/A'} | 
                      <i className="fas fa-hdd"></i> {((sub.size || 0) / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(sub.filename)}
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
