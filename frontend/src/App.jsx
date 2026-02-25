import { useState } from 'react'
import Dashboard from './components/Dashboard'
import EmployeeManagement from './components/EmployeeManagement'
import AttendanceManagement from './components/AttendanceManagement'
import EmployeeSummary from './components/EmployeeSummary'
import styles from './App.module.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>HRMS Lite</h1>
        <p className={styles.subtitle}>HR Management System</p>
      </header>

      <nav className={styles.nav}>
        <button
          className={`${styles.navBtn} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`${styles.navBtn} ${activeTab === 'employees' ? styles.active : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
        <button
          className={`${styles.navBtn} ${activeTab === 'attendance' ? styles.active : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`${styles.navBtn} ${activeTab === 'summary' ? styles.active : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
        {activeTab === 'summary' && <EmployeeSummary />}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 HRMS Lite</p>
      </footer>
    </div>
  )
}

export default App
