import React from 'react'
import styles from './RFPTable.module.css'

type StatusType = 'Processing' | 'Pending Review' | 'Completed' | 'Finalised'

interface RFP {
  id: string
  name: string
  uploadedBy: string
  uploadedDate: string
  status: StatusType
  lastModifiedDate: string
}

const mockData: RFP[] = [
  {
    id: 'RFP-001',
    name: 'Cloud Migration RFP – ACME Corp',
    uploadedBy: 'Alice Smith',
    uploadedDate: '2023-10-15',
    status: 'Processing',
    lastModifiedDate: '2023-10-15',
  },
  {
    id: 'RFP-002',
    name: 'Security Audit Services – GlobalNet',
    uploadedBy: 'Bob Johnson',
    uploadedDate: '2023-10-12',
    status: 'Pending Review',
    lastModifiedDate: '2023-10-14',
  },
  {
    id: 'RFP-003',
    name: 'Q4 Marketing Agency Pitch',
    uploadedBy: 'Carol Lee',
    uploadedDate: '2023-10-05',
    status: 'Completed',
    lastModifiedDate: '2023-10-10',
  },
]

export function RFPTable() {
  const data = mockData

  const getStatusClass = (status: StatusType) => {
    switch (status) {
      case 'Processing':
        return styles.statusInfo
      case 'Pending Review':
        return styles.statusWarning
      case 'Completed':
        return styles.statusSuccess
      case 'Finalised':
        return styles.statusAi
      default:
        return ''
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarHeading}>RFP Tracker</h2>
        <div className={styles.toolbarRight}>
          <input type="text" placeholder="Search RFPs…" className={styles.searchInput} />
          <button className={styles.filterBtn} aria-label="Filter">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '100px' }}>
              RFP ID
            </th>
            <th scope="col" style={{ flex: 1 }}>
              RFP Name
            </th>
            <th scope="col" style={{ width: '140px' }}>
              Uploaded By
            </th>
            <th scope="col" style={{ width: '130px' }}>
              Uploaded Date
            </th>
            <th scope="col" style={{ width: '150px' }}>
              Status
            </th>
            <th scope="col" style={{ width: '160px' }}>
              Last Modified Date
            </th>
            <th scope="col" style={{ width: '80px', textAlign: 'center' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className={styles.emptyState}>
                  <svg
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className={styles.emptyIcon}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <h3 className={styles.emptyHeading}>No RFPs yet</h3>
                  <p className={styles.emptySubText}>Upload your first RFP above</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                <td className={styles.colId}>{row.id}</td>
                <td className={styles.colName}>{row.name}</td>
                <td className={styles.colText}>{row.uploadedBy}</td>
                <td className={styles.colText}>{row.uploadedDate}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className={styles.colText}>{row.lastModifiedDate}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className={styles.actionBtn} aria-label="View RFP">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
