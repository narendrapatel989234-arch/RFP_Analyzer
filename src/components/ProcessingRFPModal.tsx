import React, { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
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

  // Status flags based on progress threshold (50%)
  const isUploadingComplete = progress >= 50
  const isExtractingComplete = progress >= 100
  const isExtractingActive = progress >= 50 && progress < 100

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalBody}>
          
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.waveform}>
              <div className={styles.waveBar}></div>
              <div className={styles.waveBar}></div>
              <div className={styles.waveBar}></div>
              <div className={styles.waveBar}></div>
            </div>
          </div>

          <p className={styles.smallText}>Just a moment...</p>
          <h2 className={styles.boldText}>We&apos;re building your RFP insights</h2>

          <div className={styles.statusContainer}>
            {/* Uploading Status */}
            <div className={styles.statusItem}>
              <div className={styles.statusIcon}>
                {isUploadingComplete ? (
                  <CheckCircle2 size={24} fill="var(--Lavender-600, #7673E0)" color="white" />
                ) : (
                  <div className={styles.pulseCircle}></div>
                )}
              </div>
              <span className={`${styles.statusText} ${!isUploadingComplete ? styles.active : ''}`}>
                Uploading the document
              </span>
            </div>

            {/* Extracting Status */}
            <div className={styles.statusItem}>
              <div className={styles.statusIcon}>
                {isExtractingComplete ? (
                  <CheckCircle2 size={24} fill="var(--Lavender-600, #7673E0)" color="white" />
                ) : isExtractingActive ? (
                  <div className={styles.pulseCircle}></div>
                ) : (
                  <div className={styles.pendingCircle}></div>
                )}
              </div>
              <span className={`${styles.statusText} ${isExtractingActive ? styles.active : ''}`}>
                Extracting Insights
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
