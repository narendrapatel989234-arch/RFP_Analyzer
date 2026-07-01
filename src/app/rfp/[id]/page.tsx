'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper } from '@/components/ProgressStepper'
import { UseCaseAccordion } from '@/components/UseCaseAccordion'
import styles from './page.module.css'

export default function RFPDetail({ params }: { params: { id: string } }) {
  const [isValidated, setIsValidated] = useState(false)

  return (
    <div className={styles.page}>
      <TopNav showBack={false} />

      <main className={styles.content}>
        <Link href="/" className={styles.backBtn} aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>
        <section className={styles.section}>
          <ProgressStepper />
        </section>

        <section className={styles.section}>
          <div className={styles.headerContainer}>
            <h2 className={styles.sectionTitle}>
              <div style={{
                backgroundColor: 'var(--colors-neutral-900)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--colors-neutral-0)'
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
          
          <div className={styles.validationFooter}>
            <div className={styles.validationLeft}>
              <input 
                type="checkbox" 
                id="validation-checkbox" 
                className={styles.validationCheckbox} 
                checked={isValidated}
                onChange={(e) => setIsValidated(e.target.checked)}
              />
              <label htmlFor="validation-checkbox" className={styles.validationLabel}>
                All use cases validated and ready to proceed to the clarifying questions and proposal generation.
              </label>
            </div>
            <button className={styles.proceedBtn} disabled={!isValidated}>Proceed</button>
          </div>
        </section>
      </main>
    </div>
  )
}
