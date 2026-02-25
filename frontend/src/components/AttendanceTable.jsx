import styles from './AttendanceTable.module.css'

export default function AttendanceTable({ records }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Recorded Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className={record.status === 'Present' ? styles.present : styles.absent}>
              <td>{record.employee_id}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>
                <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                  {record.status}
                </span>
              </td>
              <td>{new Date(record.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
