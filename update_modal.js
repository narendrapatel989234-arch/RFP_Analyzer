const fs = require('fs');
const path = require('path');

const tsxContent = `import React, { useState, useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
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
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

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
          <h2 className={styles.boldText}>We're building your RFP insights</h2>

          <div className={styles.statusContainer}>
            {/* Uploading Status */}
            <div className={styles.statusItem}>
              <div className={styles.statusIcon}>
                {isUploadingComplete ? (
                  <CheckCircle2 size={24} fill="var(--Lavender-600, #7673E0)" color="white" />
                ) : (
                  <div className={styles.smallSpinner}></div>
                )}
              </div>
              <span className={\`\${styles.statusText} \${!isUploadingComplete ? styles.active : ''}\`}>
                Uploading the document
              </span>
            </div>

            {/* Extracting Status */}
            <div className={styles.statusItem}>
              <div className={styles.statusIcon}>
                {isExtractingComplete ? (
                  <CheckCircle2 size={24} fill="var(--Lavender-600, #7673E0)" color="white" />
                ) : isExtractingActive ? (
                  <div className={styles.smallSpinner}></div>
                ) : (
                  <div className={styles.pendingCircle}></div>
                )}
              </div>
              <span className={\`\${styles.statusText} \${isExtractingActive ? styles.active : ''}\`}>
                Extracting Insights
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
`;

const cssContent = `.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modalContainer {
  background-color: var(--Background-Plain-White, #FFFFFF);
  border-radius: var(--radius-lg, 12px);
  width: 90%;
  max-width: 480px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: var(--space-6, 24px) var(--space-10, 40px) var(--space-10, 40px);
  position: relative;
}

.modalHeader {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4, 16px);
}

.closeBtn {
  background: none;
  border: none;
  color: var(--Content-Primary-400, #999999);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: color var(--duration-std, 0.2s) var(--ease-calm, ease);
}

.closeBtn:hover {
  color: var(--Content-Primary-900, #1A1A1A);
}

.modalBody {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinnerWrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinnerRing {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 3px solid var(--Background-Plain-300, #EDEDED);
  border-top-color: var(--Lavender-600, #7673E0);
  animation: spin 1s linear infinite;
}

.waveform {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 32px;
  z-index: 1;
}

.waveBar {
  width: 4px;
  background-color: var(--Lavender-600, #7673E0);
  border-radius: 2px;
  animation: pulseHeight 0.8s ease-in-out infinite alternate;
}

.waveBar:nth-child(1) { animation-delay: 0s; height: 16px; }
.waveBar:nth-child(2) { animation-delay: 0.2s; height: 28px; }
.waveBar:nth-child(3) { animation-delay: 0.4s; height: 20px; }
.waveBar:nth-child(4) { animation-delay: 0.1s; height: 24px; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulseHeight {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1); }
}

.smallText {
  text-align: center;
  font-size: var(--text-sm, 14px);
  color: var(--Content-Primary-400, #999999);
  margin: 0 0 8px 0;
}

.boldText {
  text-align: center;
  font-size: var(--text-xl, 20px);
  font-weight: 600;
  color: var(--Content-Primary-900, #1A1A1A);
  margin: 0 0 32px 0;
}

.statusContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
}

.statusItem {
  display: flex;
  align-items: center;
  gap: 16px;
}

.statusIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.smallSpinner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--Background-Plain-300, #EDEDED);
  border-top-color: var(--Lavender-600, #7673E0);
  animation: spin 1s linear infinite;
}

.pendingCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--Background-Plain-300, #EDEDED);
}

.statusText {
  font-size: var(--text-base, 16px);
  color: var(--Content-Primary-400, #999999);
  font-weight: 500;
  transition: color var(--duration-std, 0.2s) var(--ease-calm, ease);
}

.statusText.active {
  color: var(--Content-Primary-900, #1A1A1A);
  font-weight: 600;
}
`;

fs.writeFileSync('src/components/ProcessingRFPModal.tsx', tsxContent, 'utf-8');
fs.writeFileSync('src/components/ProcessingRFPModal.module.css', cssContent, 'utf-8');
console.log("Updated files");
