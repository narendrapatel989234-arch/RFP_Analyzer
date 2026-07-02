'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './RFPTable.module.css'

type StatusType = 'Processing' | 'Pending Review' | 'Completed' | 'Finalised'

interface RFP {
  id: string
  name: string
  uploadedBy: string
  uploadedDate: string
  status: StatusType
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
  return `${d.getDate() < 10 ? '0' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const mockData: RFP[] = [
  { id: 'RFP-001', name: 'Cloud Migration RFP – ACME Corp', uploadedBy: 'Alice Smith', uploadedDate: '2023-10-15', status: 'Processing', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-002', name: 'Security Audit Services – GlobalNet', uploadedBy: 'Bob Johnson', uploadedDate: '2023-10-12', status: 'Pending Review', lastModifiedDate: Date.now() - 3 * HOUR },
  { id: 'RFP-003', name: 'Q4 Marketing Agency Pitch', uploadedBy: 'Carol Lee', uploadedDate: '2023-10-05', status: 'Completed', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-004', name: 'ERP Implementation – Falcon Industries', uploadedBy: 'David Kim', uploadedDate: '2023-09-28', status: 'Finalised', lastModifiedDate: Date.now() - 2 * DAY },
  { id: 'RFP-005', name: 'Data Analytics Platform – BrightEdge', uploadedBy: 'Alice Smith', uploadedDate: '2023-09-20', status: 'Processing', lastModifiedDate: Date.now() },
  { id: 'RFP-006', name: 'Cybersecurity Assessment – NovaTech', uploadedBy: 'Emma Davis', uploadedDate: '2023-09-15', status: 'Completed', lastModifiedDate: Date.now() - 5 * HOUR },
  { id: 'RFP-007', name: 'Digital Transformation – Horizon Group', uploadedBy: 'Bob Johnson', uploadedDate: '2023-09-10', status: 'Pending Review', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-008', name: 'Cloud Infrastructure – PeakSystems', uploadedBy: 'Carol Lee', uploadedDate: '2023-09-05', status: 'Finalised', lastModifiedDate: Date.now() - 3 * DAY },
  { id: 'RFP-009', name: 'AI Integration – Vertex Corp', uploadedBy: 'David Kim', uploadedDate: '2023-08-30', status: 'Processing', lastModifiedDate: Date.now() },
  { id: 'RFP-010', name: 'Managed Services – BlueStar Ltd', uploadedBy: 'Emma Davis', uploadedDate: '2023-08-25', status: 'Completed', lastModifiedDate: Date.now() - 2 * HOUR },
  { id: 'RFP-011', name: 'Network Upgrade – Crestline Partners', uploadedBy: 'Alice Smith', uploadedDate: '2023-08-20', status: 'Pending Review', lastModifiedDate: Date.now() - 6 * DAY },
  { id: 'RFP-012', name: 'DevOps Consulting – Ironclad Solutions', uploadedBy: 'Bob Johnson', uploadedDate: '2023-08-15', status: 'Processing', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-013', name: 'SAP Migration – Quantum Enterprises', uploadedBy: 'Carol Lee', uploadedDate: '2023-08-10', status: 'Finalised', lastModifiedDate: Date.now() - 4 * HOUR },
  { id: 'RFP-014', name: 'IT Strategy Review – Meridian Group', uploadedBy: 'David Kim', uploadedDate: '2023-08-05', status: 'Completed', lastModifiedDate: Date.now() },
  { id: 'RFP-015', name: 'Helpdesk Outsourcing – SilverTech', uploadedBy: 'Emma Davis', uploadedDate: '2023-07-30', status: 'Pending Review', lastModifiedDate: Date.now() - 3 * HOUR },
  { id: 'RFP-016', name: 'Blockchain Pilot – Apex Ventures', uploadedBy: 'Alice Smith', uploadedDate: '2023-07-25', status: 'Processing', lastModifiedDate: Date.now() - 2 * DAY },
  { id: 'RFP-017', name: 'IoT Platform – Connected Systems', uploadedBy: 'Bob Johnson', uploadedDate: '2023-07-20', status: 'Completed', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-018', name: 'CRM Implementation – Orion Retail', uploadedBy: 'Carol Lee', uploadedDate: '2023-07-15', status: 'Finalised', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-019', name: 'Automation Framework – DeltaSoft', uploadedBy: 'David Kim', uploadedDate: '2023-07-10', status: 'Pending Review', lastModifiedDate: Date.now() },
  { id: 'RFP-020', name: 'Cloud Security – Nexus Financial', uploadedBy: 'Emma Davis', uploadedDate: '2023-07-05', status: 'Processing', lastModifiedDate: Date.now() - 5 * DAY },
]

const FILTER_OPTIONS = {
  status: ['Processing', 'Pending Review', 'Completed', 'Finalised'],
  uploadedDate: ['Today', 'Last 7 days', 'Last 30 days', 'Last 3 months'],
  uploadedBy: ['Alice Smith', 'Bob Johnson', 'Carol Lee', 'David Kim', 'Emma Davis'],
}

export function RFPTable() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    uploadedBy: '',
    uploadedDate: '',
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const filterRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRowRef.current && !filterRowRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const CheckIcon = () => (
    <svg
      className={styles.dropdownCheckIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const selectFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }))
    setOpenDropdown(null)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters({
      status: '',
      uploadedBy: '',
      uploadedDate: '',
    })
    setOpenDropdown(null)
  }

  const isFilterActive = searchQuery !== '' || Object.values(filters).some((val) => val !== '')

  const filteredData = mockData.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status ? row.status === filters.status : true
    const matchesUploadedBy = filters.uploadedBy ? row.uploadedBy === filters.uploadedBy : true
    
    const matchesUploadedDate = filters.uploadedDate ? (() => {
      const rowTime = new Date(row.uploadedDate).getTime();
      const now = Date.now();
      const diffDays = (now - rowTime) / (1000 * 60 * 60 * 24);
      if (filters.uploadedDate === 'Today') return diffDays < 1;
      if (filters.uploadedDate === 'Last 7 days') return diffDays <= 7;
      if (filters.uploadedDate === 'Last 30 days') return diffDays <= 30;
      if (filters.uploadedDate === 'Last 3 months') return diffDays <= 90;
      return true;
    })() : true;

    return matchesSearch && matchesStatus && matchesUploadedBy && matchesUploadedDate
  })

  const totalItems = filteredData.length
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentRows = filteredData.slice(startIndex, endIndex)

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>All Requests</h2>
      </div>

      <div className={styles.filterRow} ref={filterRowRef}>
        <div className={styles.filterGroup}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search RFP names"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.dropdownContainer}>
            <button
              className={`${styles.filterDropdown} ${filters.status ? styles.filterDropdownActive : ''}`}
              aria-haspopup="listbox"
              style={{ width: '150px' }}
              onClick={() => toggleDropdown('status')}
            >
              <span>{filters.status || 'Status'}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.chevronIcon}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openDropdown === 'status' && (
              <div className={styles.dropdownPopover}>
                {FILTER_OPTIONS.status.map((option) => (
                  <button
                    key={option}
                    className={styles.dropdownOption}
                    onClick={() => selectFilter('status', option)}
                  >
                    <span>{option}</span>
                    {filters.status === option && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dropdownContainer}>
            <button
              className={`${styles.filterDropdown} ${filters.uploadedBy ? styles.filterDropdownActive : ''}`}
              aria-haspopup="listbox"
              style={{ width: '150px' }}
              onClick={() => toggleDropdown('uploadedBy')}
            >
              <span>{filters.uploadedBy ? filters.uploadedBy.split(' ')[0] : 'Uploaded By'}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.chevronIcon}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openDropdown === 'uploadedBy' && (
              <div className={styles.dropdownPopover}>
                {FILTER_OPTIONS.uploadedBy.map((option) => (
                  <button
                    key={option}
                    className={styles.dropdownOption}
                    onClick={() => selectFilter('uploadedBy', option)}
                  >
                    <span>{option}</span>
                    {filters.uploadedBy === option && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dropdownContainer}>
            <button
              className={`${styles.filterDropdown} ${filters.uploadedDate ? styles.filterDropdownActive : ''}`}
              aria-haspopup="listbox"
              style={{ width: '160px' }}
              onClick={() => toggleDropdown('uploadedDate')}
            >
              <div className={styles.dropdownLeftContent}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.calendarIcon}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{filters.uploadedDate || 'Uploaded Date'}</span>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.chevronIcon}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openDropdown === 'uploadedDate' && (
              <div className={styles.dropdownPopover}>
                {FILTER_OPTIONS.uploadedDate.map((option) => (
                  <button
                    key={option}
                    className={styles.dropdownOption}
                    onClick={() => selectFilter('uploadedDate', option)}
                  >
                    <span>{option}</span>
                    {filters.uploadedDate === option && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isFilterActive && (
            <button className={styles.clearBtn} onClick={clearAllFilters}>
              &times; Clear filters
            </button>
          )}
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" style={{ width: '100px' }}>
                RFP ID
              </th>
              <th scope="col" style={{ width: 'auto' }}>
                RFP NAME
              </th>
              <th scope="col" style={{ width: '150px' }}>
                UPLOADED BY
              </th>
              <th scope="col" style={{ width: '140px' }}>
                UPLOADED DATE
              </th>
              <th scope="col" style={{ width: '150px' }}>
                STATUS
              </th>
              <th scope="col" style={{ width: '170px' }}>
                LAST MODIFIED DATE
              </th>
              <th scope="col" style={{ width: '60px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
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
                    <h3 className={styles.emptyHeading}>No RFPs match</h3>
                    <p className={styles.emptySubText}>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentRows.map((row) => (
                <tr key={row.id} onClick={() => {
                  if (row.id === 'RFP-002') {
                    router.push('/rfp/step4-demo')
                  } else {
                    router.push(`/rfp/${row.id}`)
                  }
                }}>
                  <td className={styles.colId}>{row.id}</td>
                  <td className={styles.colName}>{row.name}</td>
                  <td className={styles.colText}>{row.uploadedBy}</td>
                  <td className={styles.colText}>{row.uploadedDate}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={styles.colText}>{getRelativeTime(row.lastModifiedDate)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className={styles.actionBtn} aria-label="Open RFP">
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
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.paginationFooter}>
          <div className={styles.paginationLeft}>
            <span className={styles.paginationLabel}>Rows per page:</span>
            <div className={styles.dropdownContainer} style={{ marginLeft: 'var(--space-2)' }}>
              <button
                className={styles.rowsSelect}
                aria-haspopup="listbox"
                onClick={() => toggleDropdown('rowsPerPage')}
                style={{ width: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 0 }}
              >
                <span>{rowsPerPage}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.chevronIcon}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openDropdown === 'rowsPerPage' && (
                <div className={styles.dropdownPopover} style={{ top: 'auto', bottom: 'calc(100% + var(--space-1))', minWidth: '100%' }}>
                  {[5, 10, 15, 20].map((option) => (
                    <button
                      key={option}
                      className={styles.dropdownOption}
                      style={{ padding: '0 var(--space-2)' }}
                      onClick={() => {
                        setRowsPerPage(option)
                        setCurrentPage(1)
                        setOpenDropdown(null)
                      }}
                    >
                      <span>{option}</span>
                      {rowsPerPage === option && <CheckIcon />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.paginationRight}>
            <span className={styles.paginationLabel}>
              Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, totalItems)} of{' '}
              {totalItems} results
            </span>
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className={styles.pageBtn}
              disabled={endIndex >= totalItems}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
