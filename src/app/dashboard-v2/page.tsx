'use client'

import React from 'react'
import { LeftNav } from '@/components/LeftNav'
import { PortfolioStats } from '@/components/PortfolioStats'
import { CompactUpload } from '@/components/CompactUpload'
import { RFPTableV2 } from '@/components/RFPTableV2'
import { InsightsSection } from '@/components/InsightsSection'
import styles from './page.module.css'

export default function DashboardV2() {
  return (
    <div className={styles.layout}>
      <LeftNav />
      
      <main className={styles.mainContent}>
        <div className={styles.contentMaxWidth}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
          </header>

          <div className={styles.topRow}>
            <section className={styles.statsSection}>
              <h2 className={styles.sectionTitle}>Statistics</h2>
              <PortfolioStats allRequests={330} inProgress={27} approved={8} />
            </section>
            
            <section className={styles.uploadSection}>
              <h2 className={styles.sectionTitle}>Upload RFP</h2>
              <CompactUpload />
            </section>
          </div>

          <div className={styles.bottomRow}>
            <section className={styles.tableSection}>
              <RFPTableV2 />
            </section>

            <section className={styles.insightsSection}>
              <h2 className={styles.sectionTitle}>Insights</h2>
              <InsightsSection />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
