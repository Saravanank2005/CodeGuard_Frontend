// src/components/ResultsDisplay.js
'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function ResultsDisplay({ data }) {
  const matchesChartRef = useRef(null)
  const metricsChartRef = useRef(null)
  const matchesChartInstance = useRef(null)
  const metricsChartInstance = useRef(null)

  useEffect(() => {
    if (!data || !data.top_matches) return

    // Destroy previous charts
    if (matchesChartInstance.current) matchesChartInstance.current.destroy()
    if (metricsChartInstance.current) metricsChartInstance.current.destroy()

    const matches = data.top_matches.slice(0, 10)

    // Bar Chart - Top Matches
    if (matchesChartRef.current && matches.length > 0) {
      const ctx = matchesChartRef.current.getContext('2d')
      const top5 = matches.slice(0, 5)
      
      matchesChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top5.map(m => m.filename.split('_').slice(-1)[0].replace('.py', '')),
          datasets: [{
            label: 'Plagiarism Probability (%)',
            data: top5.map(m => (m.probability * 100).toFixed(1)),
            backgroundColor: top5.map(m => 
              m.probability >= 0.8 ? '#ef4444' :
              m.probability >= 0.5 ? '#f59e0b' : '#10b981'
            ),
            borderWidth: 0,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderRadius: 8,
            }
          },
          scales: {
            y: { 
              beginAtZero: true, 
              max: 100,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { callback: value => value + '%' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      })
    }

    // Radar Chart - Average Metrics
    if (metricsChartRef.current && matches.length > 0) {
      const avgMetrics = {
        lexical: matches.reduce((sum, m) => sum + m.sim_lex, 0) / matches.length,
        ast: matches.reduce((sum, m) => sum + m.sim_ast, 0) / matches.length,
        jaccard: matches.reduce((sum, m) => sum + m.jaccard, 0) / matches.length,
        seqmatch: matches.reduce((sum, m) => sum + m.seqmatch, 0) / matches.length
      }

      const ctx = metricsChartRef.current.getContext('2d')
      metricsChartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Lexical', 'AST', 'Jaccard', 'Sequence'],
          datasets: [{
            label: 'Average Similarity Metrics',
            data: [
              (avgMetrics.lexical * 100).toFixed(1),
              (avgMetrics.ast * 100).toFixed(1),
              (avgMetrics.jaccard * 100).toFixed(1),
              (avgMetrics.seqmatch * 100).toFixed(1)
            ],
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointRadius: 5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { callback: value => value + '%' }
            }
          }
        }
      })
    }

    return () => {
      if (matchesChartInstance.current) matchesChartInstance.current.destroy()
      if (metricsChartInstance.current) metricsChartInstance.current.destroy()
    }
  }, [data])

  if (!data || !data.top_matches || data.top_matches.length === 0) {
    return (
      <div className="result-container">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
          <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
          <h3>No Similar Code Found</h3>
          <p>This submission appears to be original!</p>
        </div>
      </div>
    )
  }

  const getRiskLevel = (prob) => {
    if (prob >= 0.8) return { label: 'HIGH RISK', color: '#ef4444', icon: 'fa-exclamation-triangle' }
    if (prob >= 0.5) return { label: 'MEDIUM RISK', color: '#f59e0b', icon: 'fa-exclamation-circle' }
    return { label: 'LOW RISK', color: '#10b981', icon: 'fa-check-circle' }
  }

  const avgProb = data.top_matches.reduce((sum, m) => sum + m.probability, 0) / data.top_matches.length
  const maxProb = Math.max(...data.top_matches.map(m => m.probability))

  return (
    <div className="result-container">
      <div className="results-header">
        <div className="header-left">
          <i className="fas fa-chart-pie"></i>
          <h2>Analysis Results</h2>
        </div>
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-value">{data.top_matches.length}</div>
            <div className="stat-label">Matches Found</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{(maxProb * 100).toFixed(1)}%</div>
            <div className="stat-label">Highest Match</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{(avgProb * 100).toFixed(1)}%</div>
            <div className="stat-label">Average</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3><i className="fas fa-chart-bar"></i> Top Matches Overview</h3>
          <canvas ref={matchesChartRef} style={{ maxHeight: '300px' }}></canvas>
        </div>
        <div className="chart-card">
          <h3><i className="fas fa-chart-radar"></i> Similarity Metrics</h3>
          <canvas ref={metricsChartRef} style={{ maxHeight: '300px' }}></canvas>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="results-list">
        <h3><i className="fas fa-list-ul"></i> Detailed Match Analysis</h3>
        {data.top_matches.map((match, index) => {
          const risk = getRiskLevel(match.probability)
          return (
            <div key={index} className="result-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="result-header">
                <div className="result-filename">
                  <i className="fas fa-file-code"></i>
                  {match.filename}
                </div>
                <div className="result-score" style={{ color: risk.color }}>
                  {(match.probability * 100).toFixed(2)}%
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div className="result-badge" style={{ background: risk.color }}>
                  <i className={`fas ${risk.icon}`}></i>
                  {risk.label}
                </div>
              </div>

              <div className="result-probability">
                <div className="probability-bar">
                  <div 
                    className="probability-fill" 
                    style={{ 
                      width: `${match.probability * 100}%`,
                      background: risk.color
                    }}
                  ></div>
                </div>
              </div>

              <div className="result-metrics">
                <div className="metric-item">
                  <i className="fas fa-font"></i>
                  <span>Lexical: {(match.sim_lex * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-sitemap"></i>
                  <span>AST: {(match.sim_ast * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-layer-group"></i>
                  <span>Jaccard: {(match.jaccard * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                  <i className="fas fa-align-left"></i>
                  <span>Sequence: {(match.seqmatch * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
