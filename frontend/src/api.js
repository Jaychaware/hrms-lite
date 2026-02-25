import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').toString().trim()

if (!API_BASE_URL || typeof API_BASE_URL !== 'string') {
  console.warn('API URL not configured, using localhost')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No response:', error.request)
    } else {
      console.error('Axios error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  create: (data) => api.post('/employees', data),
  delete: (id) => api.delete(`/employees/${id}`),
}

export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getByEmployee: (id) => api.get(`/attendance/employee/${id}`),
  create: (data) => api.post('/attendance', data),
}

export default api
