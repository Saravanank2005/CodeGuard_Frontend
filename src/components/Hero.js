// src/components/Hero.js
'use client'

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-icon">
        <i className="fas fa-code"></i>
      </div>
      <h1 className="main-title">
        <span className="gradient-text">AI-Powered</span> Plagiarism Detection
      </h1>
      <p className="hero-subtitle">
        Advanced machine learning algorithms to detect code similarity and plagiarism with 95%+ accuracy
      </p>
      <div className="features-grid">
        <div className="feature-item">
          <i className="fas fa-brain"></i>
          <span>ML-Based</span>
        </div>
        <div className="feature-item">
          <i className="fas fa-bolt"></i>
          <span>Real-time</span>
        </div>
        <div className="feature-item">
          <i className="fas fa-chart-line"></i>
          <span>Multi-metric</span>
        </div>
        <div className="feature-item">
          <i className="fas fa-lock"></i>
          <span>Secure</span>
        </div>
      </div>
    </div>
  )
}
