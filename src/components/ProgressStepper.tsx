'use client'

import React from 'react'
import styles from './ProgressStepper.module.css'

export type StepStatus = 'completed' | 'in-progress' | 'not-started'

export interface Step {
  id: number
  label: string
  sublabel?: string
  status: StepStatus
}

export function ProgressStepper({ activeStep = 2 }: { activeStep?: number }) {
  const steps: Step[] = [
    { id: 1, label: 'Step 1', sublabel: 'RFP Initiation', status: activeStep > 1 ? 'completed' : 'in-progress' },
    { id: 2, label: 'Step 2', sublabel: 'Functional Confirmation', status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'in-progress' : 'not-started' },
    { id: 3, label: 'Step 3', sublabel: 'Technical Confirmation', status: activeStep > 3 ? 'completed' : activeStep === 3 ? 'in-progress' : 'not-started' },
    { id: 4, label: 'Step 4', sublabel: 'Proposal Review', status: activeStep > 4 ? 'completed' : activeStep === 4 ? 'in-progress' : 'not-started' },
  ]

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepperWrapper}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isActiveOrCompleted = step.status === 'completed' || step.status === 'in-progress'
          
          // Connectors should be active if the current step is completed (the line to the next step)
          // Wait, if step 1 is complete and step 2 is active, the line between them is green.
          const isConnectorActive = step.status === 'completed'

          return (
            <div key={step.id} className={styles.stepItem}>
              <div className={styles.stepIndicatorContainer}>
                <div className={`${styles.connector} ${styles.connectorLeft} ${isActiveOrCompleted ? styles.connectorActive : ''}`} style={{ visibility: index === 0 ? 'hidden' : 'visible' }} />
                <div className={`${styles.iconContainer} ${styles[step.status]}`}>
                  {step.status === 'completed' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : step.status === 'in-progress' ? (
                    <div className={styles.activeDot} />
                  ) : (
                    <div className={styles.inactiveDot} />
                  )}
                </div>
                <div className={`${styles.connector} ${styles.connectorRight} ${isConnectorActive ? styles.connectorActive : ''}`} style={{ visibility: isLast ? 'hidden' : 'visible' }} />
              </div>
              <div className={styles.labelContainer}>
                {step.sublabel && (
                  <div className={`${styles.stepLabel} ${isActiveOrCompleted ? styles.labelActive : ''}`}>{step.sublabel}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
