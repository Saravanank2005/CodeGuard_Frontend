// src/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

// Debug: Log the API URL being used
if (typeof window !== 'undefined') {
  console.log('🔗 API_URL:', API_URL)
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// ============= AUTHENTICATION FUNCTIONS =============

export async function register(userData) {
  console.log('📤 Registering to:', `${API_URL}/api/auth/register`)
  
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      full_name: userData.fullName,
      institution: userData.institution
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || 'Registration failed')
  }

  const data = await res.json()
  
  // Store token and user data
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  
  return data
}

export async function login(email, password) {
  // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
  const formData = new URLSearchParams()
  formData.append('username', email)  // OAuth2 uses 'username' field
  formData.append('password', password)

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || 'Login failed')
  }

  const data = await res.json()
  
  // Store token and user data
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }
  
  return data
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error('Failed to fetch user info')
  }

  return res.json()
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// ============= SUBMISSION FUNCTIONS =============

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
