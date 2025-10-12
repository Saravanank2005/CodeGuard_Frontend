// src/app/statistics/page.js
'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getStatistics } from '@/lib/api'

export default function StatisticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('similarities')

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const data = await getStatistics()
      console.log('Statistics data:', data) // Debug log
      setStats(data)
    } catch (error) {
      alert(`Error loading statistics: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])

  const getRiskColor = (similarity) => {
    // similarity is percentage 0-100
    if (similarity >= 80) return '#ef4444'
    if (similarity >= 50) return '#f59e0b'
    return '#10b981'
  }

  const getRiskLevel = (similarity) => {
    // similarity is percentage 0-100
    if (similarity >= 80) return 'HIGH RISK'
    if (similarity >= 50) return 'MEDIUM RISK'
    return 'LOW RISK'
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="main-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading statistics...</p>
          </div>
        </div>
      </>
    )
  }

  if (!stats) {
    return (
      <>
        <Header />
        <div className="main-container">
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            No statistics available
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      
      <div className="main-container">
        <div className="stats-section">
          {/* Title Section - Match Home Page Style */}
          <div className="hero-section" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div className="hero-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h2 className="main-title">
              Plagiarism <span className="gradient-text">Statistics</span>
            </h2>
            <p className="hero-subtitle">
              Comprehensive analysis of code similarities and plagiarism patterns
            </p>
            <button 
              onClick={loadStatistics} 
              className="action-button"
              style={{ marginTop: '1rem' }}
            >
              <i className="fas fa-sync-alt"></i> Refresh Analysis
            </button>
          </div>

          {/* Overview Stats Cards - Match Home Page Theme */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>Total Students</h3>
                <div className="stat-value">{stats.total_students || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-file-code"></i>
              </div>
              <div className="stat-info">
                <h3>Submissions</h3>
                <div className="stat-value">{stats.total_submissions || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <h3>High Risk Pairs</h3>
                <div className="stat-value">{stats.high_risk_pairs?.length || 0}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>Comparisons</h3>
                <div className="stat-value">{stats.total_comparisons || 0}</div>
              </div>
            </div>
          </div>

          {/* Tabs - Match Home Page Style */}
          <div className="stats-tabs">
            <button 
              className={`stats-tab ${activeTab === 'similarities' ? 'active' : ''}`}
              onClick={() => setActiveTab('similarities')}
            >
              <i className="fas fa-code-branch"></i> Student Similarities
            </button>
            <button 
              className={`stats-tab ${activeTab === 'suspects' ? 'active' : ''}`}
              onClick={() => setActiveTab('suspects')}
            >
              <i className="fas fa-user-secret"></i> Top Suspects
            </button>
            <button 
              className={`stats-tab ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <i className="fas fa-tasks"></i> By Assignment
            </button>
          </div>

          {/* Tab Content - Similarities */}
          {activeTab === 'similarities' && (
            <div className="stats-tab-content active">
              {!stats.similarities || stats.similarities.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-info-circle"></i>
                  <p>No similarity data available yet. Upload at least 2 files to see comparisons.</p>
                </div>
              ) : (
                <div className="similarities-list">
                  {stats.similarities.slice(0, 50).map((sim, index) => (
                    <div key={index} className="similarity-card">
                      <div className="similarity-header">
                        <div className="student-pair">
                          <div className="student">
                            <i className="fas fa-user"></i>
                            <span>{sim.student1}</span>
                          </div>
                          <i className="fas fa-arrow-right"></i>
                          <div className="student">
                            <i className="fas fa-user"></i>
                            <span>{sim.student2}</span>
                          </div>
                        </div>
                        <div 
                          className="risk-badge"
                          style={{ background: getRiskColor(sim.similarity) }}
                        >
                          {getRiskLevel(sim.similarity)}
                        </div>
                      </div>
                      
                      <div className="assignment-info">
                        <i className="fas fa-tasks"></i>
                        <span>Assignment: <strong>{sim.assignment}</strong></span>
                      </div>
                      
                      <div className="similarity-score">
                        <span>{sim.similarity.toFixed(1)}% Match</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill"
                            style={{ 
                              width: `${Math.min(sim.similarity, 100)}%`,
                              background: getRiskColor(sim.similarity)
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Detailed Metrics */}
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <span className="metric-label">Lexical</span>
                          <span className="metric-value">{sim.sim_lex.toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">AST</span>
                          <span className="metric-value">{sim.sim_ast.toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Jaccard</span>
                          <span className="metric-value">{sim.jaccard.toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Sequence</span>
                          <span className="metric-value">{sim.seqmatch.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Suspects */}
          {activeTab === 'suspects' && (
            <div className="stats-tab-content active">
              {!stats.top_suspects || stats.top_suspects.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-info-circle"></i>
                  <p>No suspects identified yet.</p>
                </div>
              ) : (
                <div className="suspects-list">
                  {stats.top_suspects.map((suspect, index) => (
                    <div key={index} className="suspect-card">
                      <div className="suspect-rank">#{index + 1}</div>
                      <div className="suspect-info">
                        <h4>
                          <i className="fas fa-user"></i>
                          {suspect.student_id}
                        </h4>
                        <p>
                          <i className="fas fa-exclamation-circle"></i>
                          {suspect.high_risk_count} high-risk matches | 
                          {' '}{suspect.medium_risk_count} medium-risk | 
                          {' '}{suspect.total_submissions} submissions
                        </p>
                      </div>
                      <div 
                        className="risk-score"
                        style={{ background: getRiskColor(suspect.avg_similarity) }}
                      >
                        {suspect.avg_similarity.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Assignments */}
          {activeTab === 'assignments' && (
            <div className="stats-tab-content active">
              {!stats.assignment_stats || stats.assignment_stats.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-info-circle"></i>
                  <p>No assignment data available yet.</p>
                </div>
              ) : (
                <div className="assignments-list">
                  {stats.assignment_stats.map((assignment, index) => (
                    <div key={index} className="assignment-card">
                      <div className="assignment-header">
                        <h4>
                          <i className="fas fa-code"></i>
                          {assignment.assignment}
                        </h4>
                        <span className="submission-count">
                          {assignment.total_pairs} pairs analyzed
                        </span>
                      </div>
                      <div className="assignment-stats-grid">
                        <div className="stat-item green">
                          <span>Low Risk</span>
                          <strong>{assignment.low_risk}</strong>
                        </div>
                        <div className="stat-item orange">
                          <span>Medium Risk</span>
                          <strong>{assignment.medium_risk}</strong>
                        </div>
                        <div className="stat-item red">
                          <span>High Risk</span>
                          <strong>{assignment.high_risk}</strong>
                        </div>
                        <div className="stat-item purple">
                          <span>Avg Similarity</span>
                          <strong>{assignment.avg_similarity.toFixed(0)}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
