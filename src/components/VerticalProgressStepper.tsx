'use client'

import React from 'react'
import { File, ListChecks, Code2, CheckCircle, Puzzle } from 'lucide-react'
import styles from './VerticalProgressStepper.module.css'

export type StepStatus = 'completed' | 'in-progress' | 'not-started'

export interface Step {
  id: number
  label: string
  status: StepStatus
}

import { useRouter } from 'next/navigation'

export interface VerticalProgressStepperProps {
  activeStep?: number;
  isProposalReviewStage?: boolean;
}

export function VerticalProgressStepper({ activeStep = 2, isProposalReviewStage = false }: VerticalProgressStepperProps) {
  const router = useRouter()
  const furthestStep = isProposalReviewStage ? 5 : activeStep;

  const handleStepClick = (stepId: number) => {
    switch (stepId) {
      case 1:
        router.push('/know-your-client-v2?mode=review')
        break
      case 2:
        router.push('/solution-strategy-v2?mode=review')
        break
      case 3:
        router.push('/rfp-v2/RFP-001?mode=review')
        break
      case 4:
        router.push('/rfp-v2/RFP-002?mode=review')
        break
      case 5:
        router.push('/rfp-v2/RFP-003?mode=review')
        break
    }
  }
  const steps: Step[] = [
    { id: 1, label: 'Know Your Client' },
    { id: 2, label: 'Solution Strategy' },
    { id: 3, label: 'Business Scope' },
    { id: 4, label: 'Technical Solution' },
    { id: 5, label: 'Proposal Review' },
  ].map(step => {
    let status: StepStatus = 'not-started';
    if (isProposalReviewStage) {
      // In Proposal Review stage, previous steps are completed, while Proposal Review stays in-progress (lavender fill)
      status = step.id === 5 ? 'in-progress' : 'completed';
    } else {
      if (step.id < furthestStep) status = 'completed';
      else if (step.id === furthestStep) status = 'in-progress';
    }
    return { ...step, status };
  })

  return (
    <div className={styles.stepperContainer}>
      <h3 className={styles.stepperTitle}>Proposal Journey</h3>
      <div className={styles.stepperWrapper}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isActiveOrCompleted = step.status === 'completed' || step.status === 'in-progress'
          
          const isConnectorActive = step.status === 'completed'
          const isClickable = isProposalReviewStage && (step.status === 'completed' || step.status === 'in-progress') && step.id !== activeStep

          return (
            <div 
              key={step.id} 
              className={`${styles.stepItem} ${isClickable ? styles.clickable : ''}`}
              onClick={() => isClickable && handleStepClick(step.id)}
            >
              <div className={styles.stepIndicatorContainer}>
                <div className={`${styles.connector} ${styles.connectorTop} ${isActiveOrCompleted ? styles.connectorActive : ''}`} style={{ visibility: index === 0 ? 'hidden' : 'visible' }} />
                <div className={`${styles.iconContainer} ${styles[step.status]} ${step.id === activeStep && step.status === 'completed' ? styles.viewingCompleted : ''}`}>
                  {step.id === 1 && <File size={16} />}
                  {step.id === 2 && <Puzzle size={16} />}
                  {step.id === 3 && <ListChecks size={16} />}
                  {step.id === 4 && <Code2 size={16} />}
                  {step.id === 5 && <CheckCircle size={16} />}
                </div>
                <div className={`${styles.connector} ${styles.connectorBottom} ${isConnectorActive ? styles.connectorActive : ''}`} style={{ visibility: isLast ? 'hidden' : 'visible' }} />
              </div>
              <div className={styles.labelContainer}>
                <div className={`${styles.stepLabel} ${step.id === activeStep || step.status === 'in-progress' ? styles.labelActive : step.status === 'completed' ? styles.labelCompleted : ''}`}>
                  {step.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

