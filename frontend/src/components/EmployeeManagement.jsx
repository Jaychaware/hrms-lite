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
      setError(err.response?.data?.message || 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (formData) => {
    try {
      setError('')
      await employeeAPI.create(formData)
      setSuccess('Employee added successfully!')
      setShowForm(false)
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee')
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        setError('')
        await employeeAPI.delete(employeeId)
        setSuccess('Employee deleted successfully!')
        fetchEmployees()
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete employee')
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Employee Management</h2>
        <button 
          className={styles.primaryBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && (
        <EmployeeForm onSubmit={handleAddEmployee} />
      )}

      {loading ? (
        <div className={styles.loading}>Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className={styles.empty}>
          <p>No employees found. Add one to get started!</p>
        </div>
      ) : (
        <EmployeeTable 
          employees={employees} 
          onDelete={handleDeleteEmployee}
        />
      )}
    </div>
  )
}
