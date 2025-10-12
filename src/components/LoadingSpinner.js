// src/components/LoadingSpinner.js
'use client'

import { useEffect, useState } from 'react'

export default function LoadingSpinner() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    'Tokenizing',
    'AST Analysis',
    'ML Prediction',
    'Generating Report'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) return prev + 1
        return prev
      })
    }, 500)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Analyzing code patterns...</p>
        <div className="loading-steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index <= activeStep ? 'active' : ''}`}
            >
              <i className={`fas ${index <= activeStep ? 'fa-check-circle' : 'fa-circle'}`}></i>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
