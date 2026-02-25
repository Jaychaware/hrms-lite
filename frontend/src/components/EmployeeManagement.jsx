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
      const response = await employeeAPI.getAll()
      setEmployees(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading employees')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (data) => {
    try {
      await employeeAPI.create(data)
      setSuccess('Employee added!')
      setShowForm(false)
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error adding employee')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await employeeAPI.delete(id)
      setSuccess('Employee deleted!')
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error deleting employee')
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
