import { useState, useEffect } from 'react'
import { employeeAPI } from '../api'
import EmployeeForm from './EmployeeForm'
import EmployeeTable from './EmployeeTable'
import styles from './Employee.module.css'

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await employeeAPI.getAll()
      if (res.data && Array.isArray(res.data)) {
        setEmployees(res.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Employee fetch error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Error loading employees'
      setError(errorMsg)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (data) => {
    try {
      setError('')
      setSuccess('')
      const res = await employeeAPI.create(data)
      if (res.status === 201 || res.data) {
        setSuccess('Employee added!')
        setShowForm(false)
        await fetchEmployees()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('Add employee error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Error adding employee'
      setError(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      setError('')
      const res = await employeeAPI.delete(id)
      if (res.status === 200 || res.data) {
        setSuccess('Employee deleted!')
        await fetchEmployees()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('Delete employee error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Error deleting employee'
      setError(errorMsg)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Employees</h2>
        <button className={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && <EmployeeForm onSubmit={handleAddEmployee} />}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : employees.length === 0 ? (
        <div className={styles.empty}>No employees found</div>
      ) : (
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      )}
    </div>
  )
}
