import styles from './AttendanceTable.module.css'

export default function AttendanceTable({ records }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className={r.status === 'Present' ? styles.present : styles.absent}>
              <td>{r.employee_id}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>
                <span className={`${styles.status} ${styles[r.status.toLowerCase()]}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
