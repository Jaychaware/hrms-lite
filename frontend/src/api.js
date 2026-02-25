import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

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
