import { useState } from 'react'
import styles from './EmployeeForm.module.css'

export default function EmployeeForm({ onSubmit }) {
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validate = () => {
    if (!form.employee_id.trim()) return 'Employee ID required'
    if (!form.full_name.trim()) return 'Full Name required'
    if (!form.email.trim()) return 'Email required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email'
    if (!form.department.trim()) return 'Department required'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    onSubmit(form)
    setForm({ employee_id: '', full_name: '', email: '', department: '' })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Employee ID</label>
        <input
          type="text"
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="EMP001"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Department</label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Engineering"
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.submitBtn}>Add Employee</button>
    </form>
  )
}
