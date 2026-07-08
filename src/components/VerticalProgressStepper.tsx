'use client'

import React from 'react'
import { File, ListChecks, Code2, CheckCircle } from 'lucide-react'
import styles from './VerticalProgressStepper.module.css'

export type StepStatus = 'completed' | 'in-progress' | 'not-started'

export interface Step {
  id: number
  label: string
  status: StepStatus
}

export interface VerticalProgressStepperProps {
  activeStep?: number;
  onStepClick?: (stepId: number) => void;
}

export function VerticalProgressStepper({ activeStep = 2, onStepClick }: VerticalProgressStepperProps) {
  const steps: Step[] = [
    { id: 1, label: 'RFP Upload', status: activeStep > 1 ? 'completed' : 'in-progress' },
    { id: 2, label: 'Functional Confirmation', status: activeStep > 2 ? 'completed' : activeStep === 2 ? 'in-progress' : 'not-started' },
    { id: 3, label: 'Technical Confirmation', status: activeStep > 3 ? 'completed' : activeStep === 3 ? 'in-progress' : 'not-started' },
    { id: 4, label: 'Proposal Review', status: activeStep > 4 ? 'completed' : activeStep === 4 ? 'in-progress' : 'not-started' },
  ]

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepperWrapper}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isActiveOrCompleted = step.status === 'completed' || step.status === 'in-progress'
          
          const isConnectorActive = step.status === 'completed'
          const isClickable = step.status === 'completed' && !!onStepClick

          return (
            <div 
              key={step.id} 
              className={styles.stepItem}
              onClick={() => isClickable && onStepClick(step.id)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div className={styles.stepIndicatorContainer}>
                <div className={`${styles.connector} ${styles.connectorTop} ${isActiveOrCompleted ? styles.connectorActive : ''}`} style={{ visibility: index === 0 ? 'hidden' : 'visible' }} />
                <div className={`${styles.iconContainer} ${styles[step.status]}`}>
                  {step.id === 1 && <File size={20} />}
                  {step.id === 2 && <ListChecks size={20} />}
                  {step.id === 3 && <Code2 size={20} />}
                  {step.id === 4 && <CheckCircle size={20} />}
                </div>
                <div className={`${styles.connector} ${styles.connectorBottom} ${isConnectorActive ? styles.connectorActive : ''}`} style={{ visibility: isLast ? 'hidden' : 'visible' }} />
              </div>
              <div className={styles.labelContainer}>
                <div className={`${styles.stepLabel} ${isActiveOrCompleted ? styles.labelActive : ''}`}>
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

