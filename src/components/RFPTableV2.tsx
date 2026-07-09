'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronsUpDown, FileText } from 'lucide-react'
import styles from './RFPTableV2.module.css'

type StatusType = 'In Progress' | 'Approved'
type StageType = 'Functional Confirmation' | 'Technical Confirmation' | 'Proposal Review'

interface RFP {
  id: string
  name: string
  uploadedBy: string
  uploadedDate: string
  status: StatusType
  stage: StageType
  lastModifiedDate: number
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / HOUR);
  const days = Math.floor(diff / DAY);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return "Yesterday";
  
  const d = new Date(timestamp);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate() < 10 ? '0' : ''}${d.getDate()} ${months[d.getMonth()]}, ${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

const mockData: RFP[] = [
  { id: 'RFP-001', name: 'Cloud Migration RFP – ACME Corp', uploadedBy: 'Alice Smith', uploadedDate: '2023-10-15', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-002', name: 'Q4 Marketing Agency Pitch', uploadedBy: 'Carol Lee', uploadedDate: '2023-10-12', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 3 * HOUR },
  { id: 'RFP-003', name: 'Security Audit Services – GlobalNet', uploadedBy: 'Bob Johnson', uploadedDate: '2023-10-05', status: 'In Progress', stage: 'Proposal Review', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-004', name: 'ERP Implementation – Falcon Industries', uploadedBy: 'David Kim', uploadedDate: '2023-09-28', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 2 * DAY },
  { id: 'RFP-005', name: 'Data Analytics Platform – BrightEdge', uploadedBy: 'Alice Smith', uploadedDate: '2023-09-20', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() },
  { id: 'RFP-006', name: 'Cybersecurity Assessment – NovaTech', uploadedBy: 'Emma Davis', uploadedDate: '2023-09-15', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 5 * HOUR },
  { id: 'RFP-007', name: 'Digital Transformation – Horizon Group', uploadedBy: 'Bob Johnson', uploadedDate: '2023-09-10', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-008', name: 'Cloud Infrastructure – PeakSystems', uploadedBy: 'Carol Lee', uploadedDate: '2023-09-05', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 3 * DAY },
  { id: 'RFP-009', name: 'AI Integration – Vertex Corp', uploadedBy: 'David Kim', uploadedDate: '2023-08-30', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() },
  { id: 'RFP-010', name: 'Managed Services – BlueStar Ltd', uploadedBy: 'Emma Davis', uploadedDate: '2023-08-25', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 2 * HOUR },
]

export function RFPTableV2() {
  const router = useRouter()
  const [isMounted, setIsMounted] = React.useState(false)
  const recentData = mockData.slice(0, 5)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleRowClick = (id: string) => {
    router.push(`/rfp-v2/${id}`)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>
                <div className={styles.thContent}>RFP ID & Name <ChevronsUpDown size={14} className={styles.sortIcon}/></div>
              </th>
              <th className={styles.th}>
                <div className={styles.thContent}>Status <ChevronsUpDown size={14} className={styles.sortIcon}/></div>
              </th>
              <th className={styles.th}>
                <div className={styles.thContent}>Modified <ChevronsUpDown size={14} className={styles.sortIcon}/></div>
              </th>
              <th className={styles.th}>
                <div className={styles.thContent}>Uploaded <ChevronsUpDown size={14} className={styles.sortIcon}/></div>
              </th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {recentData.map((row) => (
              <tr key={row.id} className={styles.tr} onClick={() => handleRowClick(row.id)} style={{ cursor: 'pointer' }}>
                <td className={styles.td}>
                  <div className={styles.rfpInfoCell}>
                    <div className={styles.placeholderSquare}>
                      <FileText size={18} className={styles.rfpIcon} />
                    </div>
                    <div className={styles.rfpDetails}>
                      <span className={styles.rfpId}>{row.id}</span>
                      <span className={styles.rfpName}>{row.name}</span>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.statusText} ${row.status === 'In Progress' ? styles.statusPending : styles.statusActive}`}>
                    {row.stage}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={styles.dateText}>{isMounted ? getRelativeTime(row.lastModifiedDate) : '...'}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.dateText}>{row.uploadedDate}</span>
                </td>
                <td className={styles.tdActions}>
                  <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.viewAllRow}>
          <span className={styles.viewAllText}>View All</span>
        </div>
      </div>
    </div>
  )
}
