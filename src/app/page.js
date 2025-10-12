// src/app/page.js
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import UploadForm from '@/components/UploadForm'
import LoadingSpinner from '@/components/LoadingSpinner'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleUploadComplete = (data) => {
    setResults(data)
    setLoading(false)
  }

  return (
    <>
      <Header />
      
      <div className="main-container">
        <Hero />
        
        <UploadForm 
          onUploadStart={() => setLoading(true)}
          onUploadComplete={handleUploadComplete}
          onUploadError={() => setLoading(false)}
        />

        {loading && <LoadingSpinner />}
        
        {results && <ResultsDisplay data={results} />}
      </div>
    </>
  )
}
