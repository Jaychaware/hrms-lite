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
  const [selected, setSelected] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    fetchEmployees()
    fetchRecords()
  }, [])

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll()
      if (res.data && Array.isArray(res.data)) {
        setEmployees(res.data)
      } else {
        throw new Error('Invalid employees response')
      }
    } catch (err) {
      console.error('Employees fetch error:', err)
      setError('Error loading employees')
      setEmployees([])
    }
  }

  const fetchRecords = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await attendanceAPI.getAll()
      if (res.data && Array.isArray(res.data)) {
        setRecords(res.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Attendance fetch error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Error loading records'
      setError(errorMsg)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const handleMark = async (data) => {
    try {
      setError('')
      const res = await attendanceAPI.create(data)
      if (res.status === 201 || res.data) {
        setSuccess('Marked!')
        await fetchRecords()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('Mark attendance error:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Error marking attendance'
      setError(errorMsg)
      setSuccess('')
    }
  }

  const display = records.filter(r => {
    const matchEmployee = !selected || r.employee_id === selected
    const recordDate = new Date(r.date)
    const fromDate = dateFrom ? new Date(dateFrom) : null
    const toDate = dateTo ? new Date(dateTo) : null
    
    const matchDateFrom = !fromDate || recordDate >= fromDate
    const matchDateTo = !toDate || recordDate <= toDate
    
    return matchEmployee && matchDateFrom && matchDateTo
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Attendance</h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {employees.length > 0 && <AttendanceForm employees={employees} onSubmit={handleMark} />}

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Employee: </label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className={styles.select}>
            <option value="">All</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>From Date: </label>
          <input 
            type="date" 
            value={dateFrom} 
            onChange={(e) => setDateFrom(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>To Date: </label>
          <input 
            type="date" 
            value={dateTo} 
            onChange={(e) => setDateTo(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <button 
          onClick={() => { setSelected(''); setDateFrom(''); setDateTo('') }}
          className={styles.clearBtn}
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : display.length === 0 ? (
        <div className={styles.empty}>No records found</div>
      ) : (
        <AttendanceTable records={display} />
      )}
    </div>
  )
}
