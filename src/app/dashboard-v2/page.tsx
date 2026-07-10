'use client'
// Force recompile to fix hydration mismatch

import React from 'react'
import { LeftNav } from '@/components/LeftNav'
import { PortfolioStats } from '@/components/PortfolioStats'
import { CompactUpload } from '@/components/CompactUpload'
import { RFPTableV2 } from '@/components/RFPTableV2'
import { InsightsSection } from '@/components/InsightsSection'
import { DateFilterDropdown } from '@/components/DateFilterDropdown'
import styles from './page.module.css'

export default function DashboardV2() {
  const [dateFilterValue, setDateFilterValue] = React.useState('')

  return (
    <div className={styles.layout}>
      <LeftNav />
      
      <main className={styles.mainContent}>
        <div className={styles.contentMaxWidth}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <DateFilterDropdown dateFilterValue={dateFilterValue} onDateFilterChange={setDateFilterValue} />
          </header>

          <div className={styles.topRow}>
            <section className={styles.statsSection}>
              <PortfolioStats allRequests={1248} functionalPending={312} technicalPending={184} completed={752} />
            </section>
            
            <section className={styles.uploadSection}>
              <CompactUpload />
            </section>
          </div>

          <div className={styles.bottomRow}>
            <section className={styles.tableSection}>
              <RFPTableV2 />
            </section>

            <section className={styles.insightsSection}>
              <InsightsSection />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
