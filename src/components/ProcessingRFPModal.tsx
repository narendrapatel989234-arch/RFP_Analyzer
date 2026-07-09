import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, UploadCloud, Search } from 'lucide-react'
import styles from './ProcessingRFPModal.module.css'

interface ProcessingRFPModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function ProcessingRFPModal({ isOpen, onClose, onComplete }: ProcessingRFPModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      return
    }

    let currentProgress = 0
    // Total progress takes ~4.5s (2s + 2.5s from previous requirements, or we can just use 100ms * 45 steps)
    // Let's do 45 steps of 100ms each, so ~4.5 seconds for 100%
    // 100 / 45 ≈ 2.22 per step
    const interval = setInterval(() => {
      currentProgress += 2.22
      if (currentProgress >= 100) {
        currentProgress = 100
        setProgress(100)
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 500)
      } else {
        setProgress(currentProgress)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  const isExtracting = progress > 50
  const isComplete = progress >= 100

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.modalTitle}>Processing your RFP</h2>
            <p className={styles.modalSubtitle}>Please wait while we process and analyse your documents.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.stepContainer}>
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div>
            
            <div className={styles.stepHeader}>
              <div className={`${styles.iconWrapper} ${isComplete ? styles.complete : styles.active}`}>
                {isComplete ? (
                  <CheckCircle2 size={20} fill="currentColor" color="white" />
                ) : isExtracting ? (
                  <Search size={20} />
                ) : (
                  <UploadCloud size={20} />
                )}
              </div>
              <span className={`${styles.stepLabel} ${styles.active}`}>
                {isExtracting ? 'Extracting Insights' : 'Uploading Documents'}
              </span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

