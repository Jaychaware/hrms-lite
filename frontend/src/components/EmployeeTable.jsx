import styles from './EmployeeTable.module.css'

export default function EmployeeTable({ employees, onDelete }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{new Date(emp.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(emp.employee_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
