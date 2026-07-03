'use client'

import React, { useState, useMemo } from 'react'
import { TopNav } from '@/components/TopNav'
import { UploadZone } from '@/components/UploadZone'
import { StatCard } from '@/components/StatCard'
import { RFPTable } from '@/components/RFPTable'
import { DateFilterDropdown } from '@/components/DateFilterDropdown'
import styles from './page.module.css'

export default function RFPResponderDashboard() {
  const [dateFilter, setDateFilter] = useState('Last 30 days')
  const [customRange, setCustomRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })

  const getMultiplier = (filter: string) => {
    switch (filter) {
      case 'Today': return 0.15
      case 'Last 7 days': return 0.3
      case 'Last 30 days': return 0.6
      case 'Last 3 months': return 0.8
      case 'Custom Range': return 0.4
      default: return 1
    }
  }

  const getTrendLabel = (filter: string) => {
    switch (filter) {
      case 'Today': return 'vs yesterday'
      case 'Last 7 days': return 'vs previous 7 days'
      case 'Last 30 days': return 'vs previous 30 days'
      case 'Last 3 months': return 'vs previous 3 months'
      case 'Custom Range': return 'vs previous period'
      default: return 'vs last month'
    }
  }

  const mult = getMultiplier(dateFilter)
  const trendLabel = getTrendLabel(dateFilter)

  const stats = useMemo(() => ({
    total: Math.ceil(20 * mult),
    totalTrend: Math.ceil(15 * mult),
    funcPending: Math.ceil(7 * mult),
    funcTrend: Math.ceil(8 * mult),
    techPending: Math.ceil(5 * mult),
    techTrend: Math.ceil(3 * mult),
    completed: Math.ceil(8 * mult),
    completedTrend: Math.ceil(12 * mult)
  }), [mult])

  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.content}>
        <section className={styles.section}>
          <UploadZone />
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Request Summary</h2>
            <DateFilterDropdown
              dateFilterValue={dateFilter}
              onDateFilterChange={(val, range) => {
                setDateFilter(val)
                if (range) setCustomRange(range)
              }}
            />
          </div>
          <div className={styles.statsGrid}>
            <StatCard
              title="Total RFPs Uploaded"
              count={stats.total}
              trend={{ value: stats.totalTrend, direction: 'up' }}
              trendLabel={trendLabel}
              accentColor="var(--action-ai-bg-default)"
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              }
            />
            <StatCard
              title="Functional Pending"
              count={stats.funcPending}
              trend={{ value: stats.funcTrend, direction: 'up' }}
              trendLabel={trendLabel}
              trendColor="var(--status-warning-text)"
              accentColor="var(--status-warning-icon)"
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
            <StatCard
              title="Technical Pending"
              count={stats.techPending}
              trend={{ value: stats.techTrend, direction: 'down' }}
              trendLabel={trendLabel}
              trendColor="var(--status-info-text)"
              accentColor="var(--status-info-icon)"
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              }
            />
            <StatCard
              title="Completed"
              count={stats.completed}
              trend={{ value: stats.completedTrend, direction: 'up' }}
              trendLabel={trendLabel}
              trendColor="var(--status-success-text)"
              accentColor="var(--status-success-icon)"
              icon={
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
          </div>
        </section>

        <section className={styles.section}>
          <RFPTable 
            dateFilterValue={dateFilter} 
            customDateRange={customRange} 
          />
        </section>
      </main>
    </div>
  )
}
