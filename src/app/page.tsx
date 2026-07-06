'use client'

import React, { useState, useMemo } from 'react'
import { File, ListChecks, Code2, CheckCircle } from 'lucide-react'
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
              icon={<File />}
            />
            <StatCard
              title="Functional Pending"
              count={stats.funcPending}
              trend={{ value: stats.funcTrend, direction: 'up' }}
              trendLabel={trendLabel}
              trendColor="var(--status-warning-text)"
              accentColor="var(--status-warning-icon)"
              icon={<ListChecks />}
            />
            <StatCard
              title="Technical Pending"
              count={stats.techPending}
              trend={{ value: stats.techTrend, direction: 'down' }}
              trendLabel={trendLabel}
              trendColor="var(--status-info-text)"
              accentColor="var(--status-info-icon)"
              icon={<Code2 />}
            />
            <StatCard
              title="Completed"
              count={stats.completed}
              trend={{ value: stats.completedTrend, direction: 'up' }}
              trendLabel={trendLabel}
              trendColor="var(--status-success-text)"
              accentColor="var(--status-success-icon)"
              icon={<CheckCircle />}
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
