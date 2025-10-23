// src/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export async function uploadFile(assignmentName, studentIds, files) {
  const formData = new FormData()
  formData.append('assignment_name', assignmentName)
  formData.append('student_ids', studentIds)  // Comma-separated string
  
  // Append multiple files
  if (Array.isArray(files)) {
    files.forEach(file => {
      formData.append('files', file)
    })
  } else {
    formData.append('files', files)
  }

  const res = await fetch(`${API_URL}/api/submissions/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || 'Failed to upload files')
  }

  return res.json()
}

export async function getSubmissions() {
  const res = await fetch(`${API_URL}/api/submissions`, {
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error('Failed to fetch submissions')
  }

  const data = await res.json()
  // Backend returns array of submissions
  return Array.isArray(data) ? data : []
}

export async function deleteSubmission(submissionId) {
  const res = await fetch(`${API_URL}/api/submissions/${submissionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error('Failed to delete submission')
  }

  return res.json()
}

export async function getStatistics() {
  const res = await fetch(`${API_URL}/api/statistics`, {
    headers: getAuthHeaders()
  })

  if (res.status === 503) {
    // Model not available on backend - use mock endpoint
    console.warn('Backend statistics endpoint unavailable - falling back to mock_statistics')
    const mockRes = await fetch(`${API_URL}/mock_statistics`)
    if (!mockRes.ok) throw new Error('Failed to fetch mock statistics')
    return mockRes.json()
  }

  if (!res.ok) {
    throw new Error('Failed to fetch statistics')
  }

  return res.json()
}
