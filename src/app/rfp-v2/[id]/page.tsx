'use client'
// Force recompile to clear HMR cache 2

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { VerticalProgressStepper } from '@/components/VerticalProgressStepper'
import { UseCaseAccordion } from '@/components/UseCaseAccordion'
import { ListChecks, Code2 } from 'lucide-react'
import { LeftNav } from '@/components/LeftNav'
import { ProposalReviewV2 } from '@/components/ProposalReviewV2'
import styles from './page.module.css'

export default function RFPDetailV2() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [isValidated, setIsValidated] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      router.push('/dashboard-v2')
    }, 2500)
  }

  const handleConfirm = () => {
    const msg = isStage3 ? "Technical details approved successfully." : "Functional details approved successfully."
    triggerToast(msg)
  }

  const isStage3 = id === 'RFP-002'
  const isStage4 = id === 'RFP-003'
  const activeStep = isStage4 ? 5 : isStage3 ? 4 : 3

  const techStack = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 
    'Docker', 'Kubernetes', 'AWS', 'Terraform', 'GraphQL', 
    'Redis', 'Elasticsearch', 'Kafka', 'MongoDB', 'GitHub Actions'
  ]

  return (
    <div className={styles.layout}>
      <LeftNav />
      <main className={styles.mainContent}>
        <div style={{ marginBottom: '8px', flexShrink: 0 }}>
          <Link href="/dashboard-v2" className={styles.backBtn} aria-label="Go back">
            <svg className={styles.backBtnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </Link>
        </div>
        <div className={styles.contentMaxWidth}>
          <aside className={styles.stepperSidebar}>
            <VerticalProgressStepper activeStep={activeStep} isProposalReviewStage={isStage4} />
          </aside>

          <div className={styles.rightContent}>
            {isStage4 ? (
              <ProposalReviewV2 />
            ) : (
              <>
                <div className={styles.headerContainer}>
                  <h2 className={styles.sectionTitle}>
                    <div className={styles.titleIcon}>
                      {isStage3 ? <Code2 size={20} strokeWidth={2.5} /> : <ListChecks size={20} strokeWidth={2.5} />}
                    </div>
                    {isStage3 ? 'Validate Technical Requirements' : 'Validate Functional Requirements'}
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    {isStage3 
                      ? 'Review the technical interpretation for each approved use case. Approve or request changes to continue to the next stage.'
                      : 'This is the AI\'s interpretation of the RFP requirements—not the final solution. Only once all use cases are approved do we proceed.'}
                  </p>
                </div>



              <UseCaseAccordion isStage3={isStage3} />

                <div className={styles.validationContainer}>
                  <div className={styles.validationFooter}>
                    <h3 className={styles.validationSectionTitle}>Validate Use Cases</h3>
                    <div className={styles.validationActionRow}>
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
                        onClick={handleConfirm}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
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
                        <h3 className={styles.techStackTitle}>Project Tech Stack</h3>
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
              </>
            )}
          </div>
        </div>
      </main>

      {showToast && (
        <div className={styles.toast}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}
    </div>
  )
}

