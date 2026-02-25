import { useState } from 'react'
import styles from './AttendanceForm.module.css'

export default function AttendanceForm({ employees, onSubmit }) {
  const [form, setForm] = useState({
    employee_id: '',
    date: '',
    status: 'Present'
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.employee_id || !form.date) {
      setError('All fields required')
      return
    }
    onSubmit(form)
    setForm({ employee_id: '', date: '', status: 'Present' })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      <div>
        <div className={styles.formGroup}>
          <label>Employee</label>
          <select name="employee_id" value={form.employee_id} onChange={handleChange}>
            <option value="">Select</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>Mark</button>
      </div>
    </form>
  )
}
