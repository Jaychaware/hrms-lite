import { useState } from 'react'
import styles from './EmployeeForm.module.css'

export default function EmployeeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
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
    if (!formData.employee_id.trim()) return 'Employee ID is required'
    if (!formData.full_name.trim()) return 'Full Name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
    if (!formData.department.trim()) return 'Department is required'
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
      full_name: '',
      email: '',
      department: ''
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="employee_id">Employee ID *</label>
        <input
          id="employee_id"
          type="text"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          placeholder="e.g., EMP001"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="full_name">Full Name *</label>
        <input
          id="full_name"
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., john@example.com"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="department">Department *</label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g., Engineering"
          required
        />
      </div>

      {errors && <div className={styles.error}>{errors}</div>}

      <button type="submit" className={styles.submitBtn}>
        Add Employee
      </button>
    </form>
  )
}
