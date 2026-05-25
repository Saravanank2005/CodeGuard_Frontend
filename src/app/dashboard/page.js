// src/app/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import DashboardCards from '@/components/DashboardCards'
import RiskDistributionChart from '@/components/charts/RiskDistributionChart'
import SimilarityHistogram from '@/components/charts/SimilarityHistogram'
import AssignmentRiskBar from '@/components/charts/AssignmentRiskBar'
import TopSuspectsTable from '@/components/TopSuspectsTable'
import RecentSubmissions from '@/components/RecentSubmissions'
import { getStatistics } from '@/lib/api'
import '../statistics-enhancements.css'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getStatistics()
        setStats(data)
      } catch (e) {
        console.error(e)
        alert('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])


  return (
    <>
      <Header />
      <div className="main-container">
        <div className="stats-section">
          <div className="hero-section" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div className="hero-icon"><i className="fas fa-tachometer-alt"></i></div>
            <h2 className="main-title">Instructor <span className="gradient-text">Dashboard</span></h2>
            <p className="hero-subtitle">Overview of risk, similarities, and recent activity</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              <button className="action-button" onClick={() => location.reload()}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          )}

          {(!loading && stats) && (
            <>
              <DashboardCards
                totalStudents={stats.total_students}
                totalSubmissions={stats.total_submissions}
                totalComparisons={stats.total_comparisons}
                highRiskCount={stats.high_risk_count}
              />

              {/* Charts grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <RiskDistributionChart
                  high={stats.high_risk_count}
                  medium={stats.medium_risk_count}
                  low={stats.low_risk_count}
                />
                <SimilarityHistogram similarities={stats.similarities || []} />
              </div>

              <div style={{ marginTop: 16 }}>
                <AssignmentRiskBar assignmentStats={stats.assignment_stats || []} />
              </div>

              {/* Tables grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 16 }}>
                <TopSuspectsTable suspects={stats.top_suspects || []} />
                <RecentSubmissions submissions={stats.recent_submissions || []} />
              </div>
            </>
          )}

          {(!loading && (!stats || ((stats.high_risk_count||0)+(stats.medium_risk_count||0)+(stats.low_risk_count||0))===0)) && (
            <div className="empty-state" style={{ textAlign: 'center' }}>
              <i className="fas fa-info-circle"></i>
              <p>Your dashboard is empty. Upload files in <strong>Manage Files</strong> or use the home page to generate statistics.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
