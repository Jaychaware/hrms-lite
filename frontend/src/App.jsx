import { useState } from 'react'
import EmployeeManagement from './components/EmployeeManagement'
import AttendanceManagement from './components/AttendanceManagement'
import styles from './App.module.css'

function App() {
  const [activeTab, setActiveTab] = useState('employees')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>HRMS Lite</h1>
        <p className={styles.subtitle}>HR Management System</p>
      </header>

      <nav className={styles.nav}>
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
      </nav>

      <main className={styles.main}>
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 HRMS Lite</p>
      </footer>
    </div>
  )
}

export default App
