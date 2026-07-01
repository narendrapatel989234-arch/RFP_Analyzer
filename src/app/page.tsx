import React from 'react'
import { TopNav } from '@/components/TopNav'
import { UploadZone } from '@/components/UploadZone'
import { StatCard } from '@/components/StatCard'
import { RFPTable } from '@/components/RFPTable'
import styles from './page.module.css'

export default function RFPResponderDashboard() {
  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.content}>
        <section className={styles.section}>
          <UploadZone />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Total RFPs Uploaded"
              count={20}
              trend={{ value: 15, direction: 'up' }}
              accentColor="var(--action-primary-bg-default)"
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
              count={7}
              trend={{ value: 8, direction: 'up' }}
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
              count={5}
              trend={{ value: 3, direction: 'down' }}
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
              count={8}
              trend={{ value: 12, direction: 'up' }}
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
          <RFPTable />
        </section>
      </main>
    </div>
  )
}
