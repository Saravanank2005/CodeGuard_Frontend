// src/components/UploadForm.js
'use client'

import { useState } from 'react'
import { uploadFile } from '@/lib/api'

export default function UploadForm({ onUploadStart, onUploadComplete, onUploadError }) {
  const [studentId, setStudentId] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a Python file')
      return
    }

    onUploadStart()

    try {
      // Simulate loading steps
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const data = await uploadFile(studentId, file)
      onUploadComplete(data)
      
      // Reset form
      setStudentId('')
      setFile(null)
      setFileName('')
      e.target.reset()
    } catch (error) {
      alert(`Error: ${error.message}`)
      onUploadError()
    }
  }

  return (
    <div className="upload-section">
      <div className="upload-card">
        <div className="card-header">
          <i className="fas fa-upload"></i>
          <h2>Upload File</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="studentId">
              <i className="fas fa-user"></i>
              Student ID
            </label>
            <input 
              type="text" 
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g., STU2024001" 
              required 
            />
          </div>

          <div className="file-upload-wrapper">
            <input 
              type="file" 
              id="fileInput"
              onChange={handleFileChange}
              accept=".py" 
              required 
            />
            <label 
              htmlFor="fileInput" 
              className="file-upload-label"
              style={{
                borderColor: fileName ? 'var(--primary)' : '',
                background: fileName ? '#f0f4ff' : ''
              }}
            >
              <i className="fas fa-cloud-upload-alt"></i>
              <span className="file-text">
                {fileName ? 'Selected:' : 'Choose File'}
              </span>
              {fileName && <span className="file-name">{fileName}</span>}
            </label>
          </div>

          <button type="submit" className="submit-btn">
            <span className="btn-text">Analyze Code</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  )
}
