// src/components/UploadForm.js
'use client'

import { useState } from 'react'
import { uploadFile } from '@/lib/api'

export default function UploadForm({ onUploadStart, onUploadComplete, onUploadError }) {
  const [assignmentName, setAssignmentName] = useState('')
  const [filesWithIds, setFilesWithIds] = useState([]) // Array of {file, studentId}

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      // Create array with file and auto-suggested student ID
      const newFilesWithIds = selectedFiles.map((file, idx) => ({
        file,
        studentId: `Student${idx + 1}`,
        originalName: file.name
      }))
      setFilesWithIds(newFilesWithIds)
    }
  }

  const updateStudentId = (index, newId) => {
    const updated = [...filesWithIds]
    updated[index].studentId = newId
    setFilesWithIds(updated)
  }

  const removeFile = (index) => {
    const updated = filesWithIds.filter((_, idx) => idx !== index)
    setFilesWithIds(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (filesWithIds.length === 0) {
      alert('Please select at least one Python file')
      return
    }

    if (!assignmentName.trim()) {
      alert('Please enter an assignment name')
      return
    }

    // Validate all student IDs are filled
    const emptyIds = filesWithIds.filter(item => !item.studentId.trim())
    if (emptyIds.length > 0) {
      alert('Please enter student ID for all files')
      return
    }

    onUploadStart()

    try {
      // Convert to format expected by API
      const files = filesWithIds.map(item => item.file)
      const studentIds = filesWithIds.map(item => item.studentId.trim()).join(', ')
      
      const data = await uploadFile(assignmentName, studentIds, files)
      onUploadComplete(data)
      
      // Reset form
      setAssignmentName('')
      setFilesWithIds([])
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
          <h2>Upload Student Submissions</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Assignment Name */}
          <div className="input-group">
            <label htmlFor="assignmentName">
              <i className="fas fa-folder"></i>
              Assignment Name
            </label>
            <input 
              type="text" 
              id="assignmentName"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="e.g., Assignment 1 - Recursion" 
              required 
            />
          </div>

          {/* File Upload Button */}
          <div className="file-upload-wrapper">
            <input 
              type="file" 
              id="fileInput"
              onChange={handleFileChange}
              accept=".py" 
              multiple
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="fileInput" 
              className="file-upload-label"
              style={{
                borderColor: filesWithIds.length > 0 ? 'var(--primary)' : '',
                background: filesWithIds.length > 0 ? '#f0f4ff' : ''
              }}
            >
              <i className="fas fa-cloud-upload-alt"></i>
              <span className="file-text">
                {filesWithIds.length > 0 
                  ? `${filesWithIds.length} file(s) selected - Click to change` 
                  : 'Click to Select Student Files (.py)'}
              </span>
            </label>
          </div>

          {/* Individual File-Student ID Mapping */}
          {filesWithIds.length > 0 && (
            <div className="files-list-section">
              <div className="section-header">
                <i className="fas fa-users"></i>
                <h3>Enter Student ID for Each File</h3>
              </div>
              
              <div className="files-mapping-list">
                {filesWithIds.map((item, index) => (
                  <div key={index} className="file-mapping-item">
                    <div className="file-info">
                      <i className="fas fa-file-code"></i>
                      <span className="file-name">{item.originalName}</span>
                    </div>
                    
                    <div className="student-id-input">
                      <input
                        type="text"
                        value={item.studentId}
                        onChange={(e) => updateStudentId(index, e.target.value)}
                        placeholder="Enter Student ID"
                        required
                      />
                    </div>
                    
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                      title="Remove this file"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="info-message">
                <i className="fas fa-info-circle"></i>
                <span>
                  {filesWithIds.length} file(s) will be compared. 
                  Total comparisons: {(filesWithIds.length * (filesWithIds.length - 1)) / 2}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={filesWithIds.length === 0}
            style={{
              opacity: filesWithIds.length === 0 ? 0.5 : 1,
              cursor: filesWithIds.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="btn-text">Upload & Detect Plagiarism</span>
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Add CSS for new elements */}
      <style jsx>{`
        .files-list-section {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #667eea;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #667eea;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .files-mapping-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .file-mapping-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          transition: all 0.2s;
        }
        
        .file-mapping-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
        }
        
        .file-info i {
          color: #667eea;
          font-size: 1.2rem;
        }
        
        .file-name {
          font-weight: 500;
          word-break: break-word;
        }
        
        .student-id-input input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        
        .student-id-input input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .remove-file-btn {
          background: #ff4757;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .remove-file-btn:hover {
          background: #e84118;
          transform: scale(1.1);
        }
        
        .info-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #e7f0ff;
          border-radius: 6px;
          color: #667eea;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .file-mapping-item {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .remove-file-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
