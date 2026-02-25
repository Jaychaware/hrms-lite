import { useEffect, useState } from 'react'
import { employeeAPI, attendanceAPI } from '../api'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRecords: 0,
    presentCount: 0,
    presentRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll()
      ])

      const employees = empRes.data || []
      const records = attRes.data || []
      const presentCount = records.filter(r => r.status === 'Present').length

      setStats({
        totalEmployees: employees.length,
        totalRecords: records.length,
        presentCount: presentCount,
        presentRate: records.length > 0 ? ((presentCount / records.length) * 100).toFixed(1) : 0
      })
    } catch (err) {
      console.error('Stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard Summary</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.label}>Total Employees</div>
          <div className={styles.value}>{stats.totalEmployees}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Total Records</div>
          <div className={styles.value}>{stats.totalRecords}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Present Days</div>
          <div className={styles.value}>{stats.presentCount}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Present Rate</div>
          <div className={styles.value}>{stats.presentRate}%</div>
        </div>
      </div>
    </div>
  )
}
