import { useEffect, useState } from 'react'
import { employeeAPI, attendanceAPI } from '../api'
import styles from './EmployeeSummary.module.css'

export default function EmployeeSummary() {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll()
      ])

      const employees = empRes.data || []
      const records = attRes.data || []

      const summaryData = employees.map(emp => {
        const empRecords = records.filter(r => r.employee_id === emp.employee_id)
        const presentDays = empRecords.filter(r => r.status === 'Present').length
        return {
          id: emp.id,
          employeeId: emp.employee_id,
          name: emp.full_name,
          totalDays: empRecords.length,
          presentDays: presentDays,
          absentDays: empRecords.length - presentDays,
          rate: empRecords.length > 0 ? ((presentDays / empRecords.length) * 100).toFixed(1) : 0
        }
      })

      setSummary(summaryData)
    } catch (err) {
      console.error('Summary fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Employee Attendance Summary</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Present Days</th>
              <th>Absent Days</th>
              <th>Total Days</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(emp => (
              <tr key={emp.id}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td className={styles.present}>{emp.presentDays}</td>
                <td className={styles.absent}>{emp.absentDays}</td>
                <td>{emp.totalDays}</td>
                <td>
                  <span className={`${styles.rate} ${emp.rate >= 80 ? styles.good : ''}`}>
                    {emp.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
