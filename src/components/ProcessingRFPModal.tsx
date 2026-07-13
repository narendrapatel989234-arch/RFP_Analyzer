import React, { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import styles from './ProcessingRFPModal.module.css'

interface ProcessingRFPModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function ProcessingRFPModal({ isOpen, onClose, onComplete }: ProcessingRFPModalProps) {
  const [progress, setProgress] = useState(10)
  const [completedProgress, setCompletedProgress] = useState(10)

  useEffect(() => {
    if (!isOpen) {
      setProgress(10)
      setCompletedProgress(10)
      return
    }

    const milestones = [10, 33, 42, 64, 100];
    let currentIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const runStep = () => {
      if (currentIdx < milestones.length - 1) {
        currentIdx++;
        const targetValue = milestones[currentIdx];
        setProgress(targetValue);
        
        // Wait for the CSS transition (800ms) to complete before updating checkmarks
        timeoutId = setTimeout(() => {
          setCompletedProgress(targetValue);
          
          if (targetValue === 100) {
            // The moment 100% happens and checkmark appears, navigate immediately
            // A tiny 50ms delay ensures React paints the checkmark frame before router takeover
            timeoutId = setTimeout(() => onComplete(), 50)
          } else {
            // Pause before advancing to the next milestone
            timeoutId = setTimeout(runStep, 800)
          }
        }, 800)
      }
    }

    // Initial pause at 10% before starting
    timeoutId = setTimeout(runStep, 800)

    return () => clearTimeout(timeoutId)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  // Status flags based on completedProgress (synchronized with visual animation finish)
  const isUploadingComplete = completedProgress >= 64
  const isExtractingComplete = completedProgress >= 100
  const isExtractingActive = completedProgress >= 64 && completedProgress < 100

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalBody}>
          
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.counterWrapper}>
              <div 
                className={styles.counterList}
                style={{ transform: `translateY(-${Math.floor(progress) * 32}px)` }}
              >
                {Array.from({ length: 101 }).map((_, i) => (
                  <div key={i} className={styles.counterNumber}>{i}</div>
                ))}
              </div>
              <span className={styles.percentSign}>%</span>
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
