// src/components/UploadForm.js
'use client'

import { useState } from 'react'
import { uploadFile, pasteSubmit } from '@/lib/api'

// ── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { value: 'py',   label: 'Python',     ext: '.py',               icon: '🐍' },
  { value: 'java', label: 'Java',       ext: '.java',             icon: '☕' },
  { value: 'c',    label: 'C',          ext: '.c',                icon: '⚙️' },
  { value: 'cpp',  label: 'C++',        ext: '.cpp,.cc,.cxx,.h',  icon: '⚙️' },
  { value: 'js',   label: 'JavaScript', ext: '.js,.mjs,.cjs',     icon: '⚡' },
]

function getLang(value) {
  return LANGUAGES.find(l => l.value === value) || LANGUAGES[0]
}

// ── Shared subcomponent: Assignment name + Language picker ───────────────────
function FormHeader({ assignmentName, setAssignmentName, language, setLanguage }) {
  return (
    <div className="form-header-row">
      <div className="input-group flex-1">
        <label htmlFor="assignmentName">
          <i className="fas fa-folder" /> Assignment Name
        </label>
        <input
          type="text"
          id="assignmentName"
          value={assignmentName}
          onChange={e => setAssignmentName(e.target.value)}
          placeholder="e.g., Lab 3 – Sorting Algorithms"
          required
        />
      </div>

      <div className="input-group lang-group">
        <label htmlFor="langSelect">
          <i className="fas fa-code" /> Language
        </label>
        <select
          id="langSelect"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="lang-select"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>
              {l.icon} {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ── Tab 1: File Upload ───────────────────────────────────────────────────────
function FileUploadTab({ language, onUploadStart, onUploadComplete, onUploadError, assignmentName }) {
  const [filesWithIds, setFilesWithIds] = useState([])
  const lang = getLang(language)

  const handleFileChange = e => {
    const selected = Array.from(e.target.files)
    if (selected.length > 0) {
      setFilesWithIds(selected.map((file, idx) => ({
        file,
        studentId: `Student${idx + 1}`,
        originalName: file.name
      })))
    }
  }

  const updateStudentId = (idx, val) => {
    const updated = [...filesWithIds]
    updated[idx].studentId = val
    setFilesWithIds(updated)
  }

  const removeFile = idx => setFilesWithIds(filesWithIds.filter((_, i) => i !== idx))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!assignmentName.trim()) { alert('Please enter an assignment name'); return }
    if (filesWithIds.length < 2) { alert('Please select at least 2 files to compare'); return }
    if (filesWithIds.some(f => !f.studentId.trim())) { alert('Please fill in all student IDs'); return }

    onUploadStart()
    try {
      const files = filesWithIds.map(f => f.file)
      const studentIds = filesWithIds.map(f => f.studentId.trim()).join(', ')
      const data = await uploadFile(assignmentName, studentIds, files)
      onUploadComplete(data)
      setFilesWithIds([])
    } catch (err) {
      alert(`Error: ${err.message}`)
      onUploadError()
    }
  }

  const comparisons = (filesWithIds.length * (filesWithIds.length - 1)) / 2

  return (
    <form onSubmit={handleSubmit}>
      {/* Drop zone */}
      <div className="file-upload-wrapper">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          accept={lang.ext}
          multiple
          style={{ display: 'none' }}
        />
        <label
          htmlFor="fileInput"
          className="file-upload-label"
          style={{
            borderColor: filesWithIds.length > 0 ? 'var(--primary)' : '',
            background: filesWithIds.length > 0 ? 'rgba(102,126,234,0.06)' : ''
          }}
        >
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }} />
          <span className="file-text">
            {filesWithIds.length > 0
              ? `${filesWithIds.length} file(s) selected — click to change`
              : `Click or drag to select ${lang.label} files (${lang.ext})`}
          </span>
          <span className="file-hint">Minimum 2 files required for comparison</span>
        </label>
      </div>

      {/* File → Student ID mapping */}
      {filesWithIds.length > 0 && (
        <div className="files-list-section">
          <div className="section-header">
            <i className="fas fa-users" />
            <h3>Map Files to Student IDs</h3>
          </div>

          <div className="files-mapping-list">
            {filesWithIds.map((item, idx) => (
              <div key={idx} className="file-mapping-item">
                <div className="file-info">
                  <span className="lang-badge">{lang.icon}</span>
                  <span className="file-name">{item.originalName}</span>
                </div>
                <div className="student-id-input">
                  <input
                    type="text"
                    value={item.studentId}
                    onChange={e => updateStudentId(idx, e.target.value)}
                    placeholder="Student ID"
                    required
                  />
                </div>
                <button type="button" className="remove-file-btn" onClick={() => removeFile(idx)} title="Remove">
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
          </div>

          <div className="info-message">
            <i className="fas fa-info-circle" />
            <span>{filesWithIds.length} files → <strong>{comparisons}</strong> pair comparison{comparisons !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="submit-btn"
        disabled={filesWithIds.length < 2}
        style={{ opacity: filesWithIds.length < 2 ? 0.5 : 1, cursor: filesWithIds.length < 2 ? 'not-allowed' : 'pointer' }}
      >
        <i className="fas fa-search" />
        <span className="btn-text">Analyse Uploaded Files</span>
      </button>
    </form>
  )
}

// ── Tab 2: Paste Code ────────────────────────────────────────────────────────
const EMPTY_STUDENT = () => ({ studentId: '', code: '' })

function PasteTab({ language, onUploadStart, onUploadComplete, onUploadError, assignmentName }) {
  const [students, setStudents] = useState([EMPTY_STUDENT(), EMPTY_STUDENT()])
  const lang = getLang(language)

  const addStudent = () => setStudents([...students, EMPTY_STUDENT()])
  const removeStudent = idx => {
    if (students.length <= 2) { alert('Minimum 2 students required'); return }
    setStudents(students.filter((_, i) => i !== idx))
  }
  const updateField = (idx, field, val) => {
    const updated = [...students]
    updated[idx][field] = val
    setStudents(updated)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!assignmentName.trim()) { alert('Please enter an assignment name'); return }
    if (students.some(s => !s.studentId.trim())) { alert('Please fill in all student IDs'); return }
    if (students.some(s => !s.code.trim())) { alert('Please paste code for all students'); return }

    const ids = students.map(s => s.studentId.trim())
    if (ids.length !== new Set(ids).size) { alert('Student IDs must be unique'); return }

    onUploadStart()
    try {
      const payload = students.map(s => ({ student_id: s.studentId.trim(), code: s.code }))
      const data = await pasteSubmit(assignmentName, lang.value, payload)
      onUploadComplete(data)
      setStudents([EMPTY_STUDENT(), EMPTY_STUDENT()])
    } catch (err) {
      alert(`Error: ${err.message}`)
      onUploadError()
    }
  }

  const comparisons = (students.length * (students.length - 1)) / 2

  return (
    <form onSubmit={handleSubmit}>
      <div className="paste-students-list">
        {students.map((stu, idx) => (
          <div key={idx} className="paste-student-card">
            <div className="paste-student-header">
              <div className="paste-student-title">
                <span className="student-num">#{idx + 1}</span>
                <input
                  type="text"
                  className="paste-student-id-input"
                  value={stu.studentId}
                  onChange={e => updateField(idx, 'studentId', e.target.value)}
                  placeholder="Student ID (e.g. 23IT042)"
                  required
                />
              </div>
              <button
                type="button"
                className="remove-student-btn"
                onClick={() => removeStudent(idx)}
                title="Remove student"
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>

            <div className="paste-code-wrapper">
              <div className="paste-code-header">
                <div className="mac-dots">
                  <span className="mac-dot red"></span>
                  <span className="mac-dot yellow"></span>
                  <span className="mac-dot green"></span>
                </div>
                <span className="lang-badge-small">{lang.icon} {lang.label}</span>
                <span className="char-count">{stu.code.length} chars</span>
              </div>
              <textarea
                className="paste-code-area"
                value={stu.code}
                onChange={e => updateField(idx, 'code', e.target.value)}
                placeholder={`Paste ${lang.label} code here...`}
                rows={8}
                spellCheck={false}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-student-btn" onClick={addStudent}>
        <i className="fas fa-plus-circle" />
        Add Another Student
      </button>

      <div className="info-message" style={{ marginTop: '1rem' }}>
        <i className="fas fa-info-circle" />
        <span>{students.length} students → <strong>{comparisons}</strong> pair comparison{comparisons !== 1 ? 's' : ''} · No files stored</span>
      </div>

      <button type="submit" className="submit-btn" style={{ marginTop: '1rem' }}>
        <i className="fas fa-search" />
        <span className="btn-text">Analyse Pasted Code</span>
      </button>
    </form>
  )
}

// ── Main UploadForm ──────────────────────────────────────────────────────────
export default function UploadForm({ onUploadStart, onUploadComplete, onUploadError }) {
  const [tab, setTab] = useState('file')           // 'file' | 'paste'
  const [assignmentName, setAssignmentName] = useState('')
  const [language, setLanguage] = useState('py')

  const sharedProps = { language, onUploadStart, onUploadComplete, onUploadError, assignmentName }

  return (
    <div className="upload-section">
      <div className="upload-card">
        {/* Card header */}
        <div className="card-header">
          <i className="fas fa-shield-alt" />
          <h2>Check for Plagiarism</h2>
        </div>

        {/* Shared fields */}
        <FormHeader
          assignmentName={assignmentName}
          setAssignmentName={setAssignmentName}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Mode tabs */}
        <div className="mode-tabs">
          <button
            type="button"
            className={`mode-tab ${tab === 'file' ? 'active' : ''}`}
            onClick={() => setTab('file')}
            id="tab-file-upload"
          >
            <i className="fas fa-upload" /> Upload Files
          </button>
          <button
            type="button"
            className={`mode-tab ${tab === 'paste' ? 'active' : ''}`}
            onClick={() => setTab('paste')}
            id="tab-paste-code"
          >
            <i className="fas fa-paste" /> Paste Code
          </button>
        </div>

        <div className="tab-content">
          {tab === 'file'
            ? <FileUploadTab {...sharedProps} />
            : <PasteTab {...sharedProps} />
          }
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        /* ── Header row ── */
        .form-header-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 1.25rem;
        }
        .flex-1 { flex: 1; }
        .lang-group { min-width: 160px; }
        .lang-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .lang-select:focus {
          outline: none;
          border-color: #667eea;
        }

        /* ── Mode tabs ── */
        .mode-tabs {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 2rem;
          border: none;
        }
        .mode-tab {
          flex: 1;
          padding: 0.85rem 1rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 8px;
        }
        .mode-tab.active {
          background: white;
          color: #667eea;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }
        .mode-tab:not(.active):hover {
          color: #475569;
          background: rgba(255,255,255,0.5);
        }

        /* ── File upload zone ── */
        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          border: 2.5px dashed #c5cae9;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          gap: 0.25rem;
        }
        .file-upload-label:hover { border-color: #667eea; background: rgba(102,126,234,0.04); }
        .file-text { font-size: 1rem; font-weight: 500; color: #555; }
        .file-hint { font-size: 0.82rem; color: #9e9e9e; margin-top: 0.25rem; }

        /* ── Files mapping list ── */
        .files-list-section {
          margin: 1.5rem 0;
          padding: 1.25rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #667eea;
        }
        .section-header {
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 1rem; color: #667eea;
        }
        .section-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
        .files-mapping-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .file-mapping-item {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 0.75rem;
          align-items: center;
          background: white;
          padding: 0.9rem 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          transition: all 0.2s;
        }
        .file-mapping-item:hover { border-color: #667eea; box-shadow: 0 2px 8px rgba(102,126,234,0.1); }
        .file-info { display: flex; align-items: center; gap: 0.5rem; }
        .lang-badge { font-size: 1.1rem; }
        .file-name { font-weight: 500; word-break: break-word; font-size: 0.9rem; }
        .student-id-input input {
          width: 100%; padding: 0.6rem 0.75rem;
          border: 2px solid #e0e0e0; border-radius: 6px;
          font-size: 0.9rem; transition: border-color 0.2s;
        }
        .student-id-input input:focus { outline: none; border-color: #667eea; }
        .remove-file-btn {
          background: #ff4757; color: white; border: none;
          width: 34px; height: 34px; border-radius: 6px;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .remove-file-btn:hover { background: #e84118; transform: scale(1.1); }

        /* ── Info message ── */
        .info-message {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 1rem; padding: 0.75rem 1rem;
          background: #e7f0ff; border-radius: 8px;
          color: #667eea; font-size: 0.88rem;
        }

        /* ── Paste mode ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .paste-students-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .paste-student-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          animation: slideUp 0.4s ease-out forwards;
        }
        .paste-student-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }
        .paste-student-card:focus-within { 
          border-color: #667eea; 
          box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
          transform: translateY(-2px);
        }
        .paste-student-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1.2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          gap: 0.75rem;
        }
        .paste-student-title { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
        .student-num {
          font-weight: 700; color: #667eea;
          font-size: 0.9rem; white-space: nowrap;
        }
        .paste-student-id-input {
          flex: 1; padding: 0.5rem 0.75rem;
          border: 2px solid #e0e0e0; border-radius: 6px;
          font-size: 0.9rem; font-weight: 600;
          transition: border-color 0.2s;
          max-width: 260px;
        }
        .paste-student-id-input:focus { outline: none; border-color: #667eea; }
        .remove-student-btn {
          background: transparent; color: #ff4757; border: 1.5px solid #ff4757;
          width: 32px; height: 32px; border-radius: 6px;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
        }
        .remove-student-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; transform: scale(1.05); }
        .paste-code-wrapper { padding: 0; }
        .paste-code-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.6rem 1rem;
          background: #1e1e2e;
          border-bottom: 1px solid #313244;
        }
        .mac-dots {
          display: flex; gap: 6px;
          margin-right: auto; /* Push to the left */
        }
        .mac-dot {
          width: 12px; height: 12px; border-radius: 50%;
        }
        .mac-dot.red { background: #ff5f56; }
        .mac-dot.yellow { background: #ffbd2e; }
        .mac-dot.green { background: #27c93f; }
        
        .lang-badge-small { font-size: 0.8rem; color: #a9b1d6; font-family: monospace; margin: 0 auto; padding-right: 1.5rem; }
        .char-count { font-size: 0.75rem; color: #565f89; font-family: monospace; }
        .paste-code-area {
          width: 100%; padding: 1.25rem;
          background: #1e1e2e; color: #cdd6f4;
          border: none; resize: vertical;
          font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
          font-size: 0.9rem; line-height: 1.6;
          display: block;
          transition: all 0.2s;
          tab-size: 4;
        }
        .paste-code-area:focus { outline: none; background: #181825; }
        .paste-code-area::placeholder { color: #45475a; }
        .add-student-btn {
          width: 100%; padding: 0.85rem;
          margin-top: 1rem;
          background: transparent;
          border: 2px dashed #667eea;
          border-radius: 10px;
          color: #667eea;
          font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .add-student-btn:hover { background: rgba(102,126,234,0.08); }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%; padding: 1rem;
          margin-top: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 10px;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
          box-shadow: 0 4px 15px rgba(102,126,234,0.4);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102,126,234,0.5);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .form-header-row { flex-direction: column; }
          .lang-group { min-width: unset; width: 100%; }
          .file-mapping-item { grid-template-columns: 1fr; }
          .remove-file-btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
