'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './RFPTable.module.css'

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
  return `${d.getDate() < 10 ? '0' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const mockData: RFP[] = [
  { id: 'RFP-001', name: 'Cloud Migration RFP – ACME Corp', uploadedBy: 'Alice Smith', uploadedDate: '2023-10-15', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-002', name: 'Q4 Marketing Agency Pitch', uploadedBy: 'Carol Lee', uploadedDate: '2023-10-12', status: 'Approved', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 3 * HOUR },
  { id: 'RFP-003', name: 'Security Audit Services – GlobalNet', uploadedBy: 'Bob Johnson', uploadedDate: '2023-10-05', status: 'In Progress', stage: 'Proposal Review', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-004', name: 'ERP Implementation – Falcon Industries', uploadedBy: 'David Kim', uploadedDate: '2023-09-28', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 2 * DAY },
  { id: 'RFP-005', name: 'Data Analytics Platform – BrightEdge', uploadedBy: 'Alice Smith', uploadedDate: '2023-09-20', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() },
  { id: 'RFP-006', name: 'Cybersecurity Assessment – NovaTech', uploadedBy: 'Emma Davis', uploadedDate: '2023-09-15', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 5 * HOUR },
  { id: 'RFP-007', name: 'Digital Transformation – Horizon Group', uploadedBy: 'Bob Johnson', uploadedDate: '2023-09-10', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-008', name: 'Cloud Infrastructure – PeakSystems', uploadedBy: 'Carol Lee', uploadedDate: '2023-09-05', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 3 * DAY },
  { id: 'RFP-009', name: 'AI Integration – Vertex Corp', uploadedBy: 'David Kim', uploadedDate: '2023-08-30', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() },
  { id: 'RFP-010', name: 'Managed Services – BlueStar Ltd', uploadedBy: 'Emma Davis', uploadedDate: '2023-08-25', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 2 * HOUR },
  { id: 'RFP-011', name: 'Network Upgrade – Crestline Partners', uploadedBy: 'Alice Smith', uploadedDate: '2023-08-20', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 6 * DAY },
  { id: 'RFP-012', name: 'DevOps Consulting – Ironclad Solutions', uploadedBy: 'Bob Johnson', uploadedDate: '2023-08-15', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-013', name: 'SAP Migration – Quantum Enterprises', uploadedBy: 'Carol Lee', uploadedDate: '2023-08-10', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 4 * HOUR },
  { id: 'RFP-014', name: 'IT Strategy Review – Meridian Group', uploadedBy: 'David Kim', uploadedDate: '2023-08-05', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() },
  { id: 'RFP-015', name: 'Helpdesk Outsourcing – SilverTech', uploadedBy: 'Emma Davis', uploadedDate: '2023-07-30', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() - 3 * HOUR },
  { id: 'RFP-016', name: 'Blockchain Pilot – Apex Ventures', uploadedBy: 'Alice Smith', uploadedDate: '2023-07-25', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() - 2 * DAY },
  { id: 'RFP-017', name: 'IoT Platform – Connected Systems', uploadedBy: 'Bob Johnson', uploadedDate: '2023-07-20', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 1 * DAY },
  { id: 'RFP-018', name: 'CRM Implementation – Orion Retail', uploadedBy: 'Carol Lee', uploadedDate: '2023-07-15', status: 'Approved', stage: 'Proposal Review', lastModifiedDate: Date.now() - 1 * HOUR },
  { id: 'RFP-019', name: 'Automation Framework – DeltaSoft', uploadedBy: 'David Kim', uploadedDate: '2023-07-10', status: 'In Progress', stage: 'Technical Confirmation', lastModifiedDate: Date.now() },
  { id: 'RFP-020', name: 'Cloud Security – Nexus Financial', uploadedBy: 'Emma Davis', uploadedDate: '2023-07-05', status: 'In Progress', stage: 'Functional Confirmation', lastModifiedDate: Date.now() - 5 * DAY },
]

const FILTER_OPTIONS = {
  status: ['In Progress', 'Approved'],
  uploadedBy: ['Alice Smith', 'Bob Johnson', 'Carol Lee', 'David Kim', 'Emma Davis'],
  stage: ['All', 'Functional Confirmation', 'Technical Confirmation', 'Proposal Review'],
}

interface RFPTableProps {
  dateFilterValue?: string
  customDateRange?: { start: Date | null, end: Date | null }
  onDateFilterChange?: (value: string, range?: { start: Date | null, end: Date | null }) => void
}

export function RFPTable({ dateFilterValue = '', customDateRange, onDateFilterChange }: RFPTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    uploadedBy: '',
    stage: '',
  })
  const [sortConfig, setSortConfig] = useState<{ key: keyof RFP, direction: 'asc' | 'desc' } | null>(null)

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const filterRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters, dateFilterValue, customDateRange])

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
      case 'In Progress':
        return styles.statusInfo
      case 'Approved':
        return styles.statusSuccess
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

  const selectFilter = (type: 'status' | 'uploadedBy' | 'stage', value: string) => {
    if (value === 'All') {
      setFilters((prev) => ({ ...prev, [type]: '' }))
    } else if (filters[type] === value) {
      setFilters((prev) => ({ ...prev, [type]: '' }))
    } else {
      setFilters((prev) => ({ ...prev, [type]: value }))
    }
    setOpenDropdown(null)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilters({ status: '', uploadedBy: '', stage: '' })
  }

  const handleSort = (key: keyof RFP) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const SortIcon = ({ columnKey }: { columnKey: keyof RFP }) => {
    const isActive = sortConfig?.key === columnKey
    const isDesc = isActive && sortConfig?.direction === 'desc'
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          marginLeft: '4px',
          opacity: isActive ? 1 : 0.3,
          transform: isDesc ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s, opacity 0.2s',
          display: 'inline-block',
          verticalAlign: 'middle'
        }}
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    )
  }

  const isFilterActive = searchQuery !== '' || filters.status !== '' || filters.uploadedBy !== '' || filters.stage !== ''

  const filteredData = mockData.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status ? row.status === filters.status : true
    const matchesUploadedBy = filters.uploadedBy ? row.uploadedBy === filters.uploadedBy : true
    const matchesStage = filters.stage ? row.stage === filters.stage : true
    
    const matchesUploadedDate = (() => {
      if (!dateFilterValue) return true;
      const rowTime = row.lastModifiedDate;
      const now = Date.now();
      const diffDays = (now - rowTime) / (1000 * 60 * 60 * 24);
      if (dateFilterValue === 'Today') return diffDays < 1;
      if (dateFilterValue === 'Last 7 days') return diffDays <= 7;
      if (dateFilterValue === 'Last 30 days') return diffDays <= 30;
      if (dateFilterValue === 'Last 3 months') return diffDays <= 90;
      if (dateFilterValue === 'Custom Range' && customDateRange?.start && customDateRange?.end) {
        const rowDate = new Date(rowTime)
        const start = new Date(customDateRange.start)
        start.setHours(0, 0, 0, 0)
        const end = new Date(customDateRange.end)
        end.setHours(23, 59, 59, 999)
        return rowDate >= start && rowDate <= end
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesUploadedBy && matchesStage && matchesUploadedDate
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) {
      return direction === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalItems = sortedData.length
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentRows = sortedData.slice(startIndex, endIndex)

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
              placeholder="Search by RFP name or client"
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
              className={`${styles.filterDropdown} ${filters.stage ? styles.filterDropdownActive : ''}`}
              aria-haspopup="listbox"
              style={{ width: '150px' }}
              onClick={() => toggleDropdown('stage')}
            >
              <span>{filters.stage || 'Stage'}</span>
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
            {openDropdown === 'stage' && (
              <div className={styles.dropdownPopover}>
                {FILTER_OPTIONS.stage.map((option) => (
                  <button
                    key={option}
                    className={styles.dropdownOption}
                    onClick={() => selectFilter('stage', option)}
                  >
                    <span>{option}</span>
                    {((filters.stage === option) || (!filters.stage && option === 'All')) && <CheckIcon />}
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
              <th scope="col" style={{ width: '100px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('id')}>
                RFP ID <SortIcon columnKey="id" />
              </th>
              <th scope="col" style={{ width: 'auto', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('name')}>
                RFP NAME <SortIcon columnKey="name" />
              </th>
              <th scope="col" style={{ width: '150px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('uploadedBy')}>
                UPLOADED BY <SortIcon columnKey="uploadedBy" />
              </th>
              <th scope="col" style={{ width: '140px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('uploadedDate')}>
                UPLOADED DATE <SortIcon columnKey="uploadedDate" />
              </th>
              <th scope="col" style={{ width: '130px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('status')}>
                STATUS <SortIcon columnKey="status" />
              </th>
              <th scope="col" style={{ width: '180px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('stage')}>
                STAGE <SortIcon columnKey="stage" />
              </th>
              <th scope="col" style={{ width: '170px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('lastModifiedDate')}>
                LAST MODIFIED DATE <SortIcon columnKey="lastModifiedDate" />
              </th>
              <th scope="col" style={{ width: '60px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={8}>
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
                  if (row.id === 'RFP-003') {
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
                  <td className={styles.colText}>{row.stage}</td>
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
