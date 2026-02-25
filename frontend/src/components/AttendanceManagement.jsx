import { useState, useEffect } from 'react'
import { employeeAPI, attendanceAPI } from '../api'
import AttendanceForm from './AttendanceForm'
import AttendanceTable from './AttendanceTable'
import styles from './Attendance.module.css'

export default function AttendanceManagement() {
  const [employees, setEmployees] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')

  useEffect(() => {
    fetchEmployees()
    fetchAllRecords()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll()
      setEmployees(response.data)
    } catch (err) {
      setError('Failed to fetch employees')
    }
  }

  const fetchAllRecords = async () => {
    setLoading(true)
    try {
      const response = await attendanceAPI.getAll()
      setRecords(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance records')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (formData) => {
    try {
      setError('')
      await attendanceAPI.create(formData)
      setSuccess('Attendance marked successfully!')
      fetchAllRecords()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    }
  }

  const displayRecords = selectedEmployee
    ? records.filter(r => r.employee_id === selectedEmployee)
    : records

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Attendance Management</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {employees.length > 0 && (
        <AttendanceForm 
          employees={employees}
          onSubmit={handleMarkAttendance}
        />
      )}

      <div className={styles.filterSection}>
        <label htmlFor="employeeFilter">Filter by Employee: </label>
        <select
          id="employeeFilter"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className={styles.select}
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.employee_id}>
              {emp.employee_id} - {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading attendance records...</div>
      ) : displayRecords.length === 0 ? (
        <div className={styles.empty}>
          <p>No attendance records found. Mark attendance to get started!</p>
        </div>
      ) : (
        <AttendanceTable records={displayRecords} />
      )}
    </div>
  )
}
