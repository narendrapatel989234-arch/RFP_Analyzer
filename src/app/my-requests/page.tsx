'use client'

import React, { useState, useMemo } from 'react'
import { LeftNav } from '@/components/LeftNav'
import { Search, FileText, Clock, CheckCircle, Circle, ChevronRight } from 'lucide-react'
import styles from './page.module.css'

type StatusType = 'In Progress' | 'Completed' | 'Draft'
type StageType = 'Know Your Client' | 'Solution Strategy' | 'Business Scope' | 'Technical Solution' | 'Proposal Review'

interface RFPRequest {
  id: string
  name: string
  status: StatusType
  stage: StageType
  submittedDate: string
  lastModifiedDate: number
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const hours = Math.floor(diff / HOUR)
  const days = Math.floor(diff / DAY)

  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days === 1) return "Yesterday"
  
  return `${days} days ago`
}

const mockData: RFPRequest[] = [
  { id: 'RFP-1042', name: 'Global ERP Migration Project', status: 'In Progress', stage: 'Solution Strategy', submittedDate: '2024-03-15', lastModifiedDate: Date.now() - 2 * HOUR },
  { id: 'RFP-1043', name: 'Q3 Security Audit & Pen Testing', status: 'Draft', stage: 'Know Your Client', submittedDate: '2024-03-12', lastModifiedDate: Date.now() - 5 * HOUR },
  { id: 'RFP-1038', name: 'Data Center Consolidation', status: 'Completed', stage: 'Proposal Review', submittedDate: '2024-02-28', lastModifiedDate: Date.now() - 3 * DAY },
  { id: 'RFP-1045', name: 'AI Customer Support Implementation', status: 'In Progress', stage: 'Business Scope', submittedDate: '2024-03-18', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-1030', name: 'Cloud Infrastructure Upgrade', status: 'Completed', stage: 'Proposal Review', submittedDate: '2024-01-15', lastModifiedDate: Date.now() - 14 * DAY },
]

export default function MyRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className={`${styles.statusBadge} ${styles.statusInProgress}`}>
            <Clock size={12} strokeWidth={2.5} /> {status}
          </span>
        )
      case 'Completed':
        return (
          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            <CheckCircle size={12} strokeWidth={2.5} /> {status}
          </span>
        )
      case 'Draft':
        return (
          <span className={`${styles.statusBadge} ${styles.statusDraft}`}>
            <Circle size={12} strokeWidth={2.5} /> {status}
          </span>
        )
    }
  }

  return (
    <div className={styles.layout}>
      <LeftNav />
      
      <main className={styles.mainContent}>
        <div className={styles.contentMaxWidth}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>My Requests</h1>
          </header>

          <div className={styles.controlsRow}>
            <div className={styles.searchContainer}>
              <Search size={16} color="var(--Content-Primary-300)" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>RFP ID & Name</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Stage</th>
                  <th className={styles.th}>Submitted</th>
                  <th className={styles.th}>Modified</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.rfpInfoCell}>
                        <div className={styles.iconSquare}>
                          <FileText size={18} />
                        </div>
                        <div className={styles.rfpDetails}>
                          <span className={styles.rfpId}>{row.id}</span>
                          <span className={styles.rfpName}>{row.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      {renderStatusBadge(row.status)}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.stageText}>{row.stage}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{row.submittedDate}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{isMounted ? getRelativeTime(row.lastModifiedDate) : '...'}</span>
                    </td>
                    <td className={styles.tdActions}>
                      <ChevronRight className={styles.arrowIcon} size={18} />
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--Content-Primary-400)' }}>
                      No requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
