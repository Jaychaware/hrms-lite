import { useState } from 'react'
import styles from './AttendanceForm.module.css'

export default function AttendanceForm({ employees, onSubmit }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    status: 'Present'
  })
  const [errors, setErrors] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors('')
  }

  const validateForm = () => {
    if (!formData.employee_id.trim()) return 'Employee is required'
    if (!formData.date.trim()) return 'Date is required'
    if (!formData.status) return 'Status is required'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const error = validateForm()
    if (error) {
      setErrors(error)
      return
    }
    onSubmit(formData)
    setFormData({
      employee_id: '',
      date: '',
      status: 'Present'
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors && <div className={styles.error}>{errors}</div>}
      <div>
        <div className={styles.formGroup}>
          <label htmlFor="employee_id">Employee *</label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">Select an employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Mark Attendance
        </button>
      </div>
    </form>
  )
}
