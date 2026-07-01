import React from 'react'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper } from '@/components/ProgressStepper'
import { UseCaseAccordion } from '@/components/UseCaseAccordion'
import styles from './page.module.css'

export default function RFPDetail({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <TopNav showBack={true} />

      <main className={styles.content}>
        <section className={styles.section}>
          <ProgressStepper />
        </section>

        <section className={styles.section}>
          <div className={styles.headerContainer}>
            <h2 className={styles.sectionTitle}>
              <div style={{
                backgroundColor: 'var(--action-primary-bg-default)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              Our understanding of your requirements
            </h2>
            <p className={styles.sectionSubtitle}>
              This is <strong>not</strong> the solution — it is how we have read each use case. Review every use case, comment on individual modules, then approve or request changes. Only once all use cases are approved do we proceed.
            </p>
          </div>
          
          <UseCaseAccordion />
        </section>
      </main>
    </div>
  )
}
