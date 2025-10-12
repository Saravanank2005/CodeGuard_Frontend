// src/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function uploadFile(studentId, file) {
  const formData = new FormData()
  formData.append('student_id', studentId)
  formData.append('file', file)

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to upload file')
  }

  return res.json()
}

export async function getSubmissions() {
  const res = await fetch(`${API_URL}/submissions`)

  if (!res.ok) {
    throw new Error('Failed to fetch submissions')
  }

  const data = await res.json()
  // Backend returns {submissions: [...], count: ...}
  // We only need the submissions array
  return data.submissions || []
}

export async function deleteSubmission(filename) {
  const res = await fetch(`${API_URL}/submissions/${filename}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete submission')
  }

  return res.json()
}

export async function getStatistics() {
  const res = await fetch(`${API_URL}/statistics`)

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
