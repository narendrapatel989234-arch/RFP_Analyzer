'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper } from '@/components/ProgressStepper'
import { UseCaseAccordion } from '@/components/UseCaseAccordion'
import styles from './page.module.css'

export default function RFPDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [isValidated, setIsValidated] = useState(false)

  const isStage3 = id === 'RFP-003'
  const activeStep = isStage3 ? 3 : 2

  const techStack = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 
    'Docker', 'Kubernetes', 'AWS', 'Terraform', 'GraphQL', 
    'Redis', 'Elasticsearch', 'Kafka', 'MongoDB', 'GitHub Actions'
  ]

  return (
    <div className={styles.page}>
      <TopNav showBack={false} />

      <main className={styles.content}>
        <Link href="/" className={styles.backBtn} aria-label="Go back">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>

        <section className={styles.section}>
          <ProgressStepper 
            activeStep={activeStep} 
            onStepClick={(stepId) => {
              if (stepId === 1) {
                router.push('/rfp-upload-review')
              }
            }}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.headerContainer}>
            <h2 className={styles.sectionTitle}>
              <div
                style={{
                  backgroundColor: 'var(--colors-neutral-900)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--colors-neutral-0)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              {isStage3 ? 'Validate Technical Requirements' : 'Validate Functional Requirements'}
            </h2>

            <p className={styles.sectionSubtitle}>
              {isStage3 
                ? 'Review the technical interpretation for each approved use case. Approve or request changes to continue to the next stage.'
                : 'This is the AI\'s interpretation of the RFP requirements—not the final solution. Only once all use cases are approved do we proceed.'}
            </p>

            {/* Example if you want to display the RFP ID */}
            {/* <p className={styles.rfpId}>RFP ID: {id}</p> */}
          </div>

          {isStage3 && (
            <div className={styles.techStackBlock}>
              <div className={styles.techStackHeader}>
                <div className={styles.techStackHeaderLeft}>
                  <div className={styles.techStackIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <h3 className={styles.techStackTitle}>Project Techstack</h3>
                </div>
              </div>
              <div className={styles.techStackContent}>
                <div className={styles.techStackChips}>
                  {techStack.map((tech, idx) => (
                    <span key={idx} className={styles.techChip}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <UseCaseAccordion isStage3={isStage3} />

          <div className={styles.validationContainer}>
            <h3 className={styles.validationSectionTitle}>Validate Use Cases</h3>
            <div className={styles.validationFooter}>
              <div className={styles.validationLeft}>
                <input
                  type="checkbox"
                  id="validation-checkbox"
                  className={styles.validationCheckbox}
                  checked={isValidated}
                  onChange={(e) => setIsValidated(e.target.checked)}
                />
                <label
                  htmlFor="validation-checkbox"
                  className={styles.validationLabel}
                >
                  All use cases validated and ready to proceed to the clarifying
                  questions and proposal generation.
                </label>
              </div>

              <button
                className={styles.proceedBtn}
                disabled={!isValidated}
              >
                Confirm
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}