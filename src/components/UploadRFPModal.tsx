'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, File as FileIcon, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react'
import styles from './UploadRFPModal.module.css'

interface UploadRFPModalProps {
  isOpen: boolean
  onClose: () => void
  mainDocument: File | null
}

export function UploadRFPModal({ isOpen, onClose, mainDocument }: UploadRFPModalProps) {
  const router = useRouter()
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'complete'>('idle')
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && mainDocument) {
      setUploadStatus('uploading')
      
      const extractingTimer = setTimeout(() => {
        setUploadStatus('extracting')
      }, 1500)
      
      const completeTimer = setTimeout(() => {
        setUploadStatus('complete')
      }, 2500)
      
      return () => {
        clearTimeout(extractingTimer)
        clearTimeout(completeTimer)
      }
    } else if (!isOpen) {
      setUploadStatus('idle')
      setSupportingDocs([])
    }
  }, [isOpen, mainDocument])

  if (!isOpen || !mainDocument) return null

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setSupportingDocs(prev => [...prev, ...newFiles])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setSupportingDocs(prev => [...prev, ...newFiles])
    }
    e.target.value = ''
  }

  const handleRemoveDoc = (index: number) => {
    setSupportingDocs(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    // Navigate to Know Your Client
    router.push('/know-your-client')
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload RFP</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className={styles.divider}></div>
        
        <div className={styles.modalBody}>
          {/* Section 1: Main Document */}
          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>RFP Document</h3>
            <div className={styles.pendingStatusCard}>
              <div className={styles.pendingStatusRow}>
                <div className={styles.pendingStatusLeft}>
                  <div className={styles.pendingStatusIcon}>
                    <FileIcon size={20} strokeWidth={2.5} />
                  </div>
                  <div className={styles.pendingStatusFileInfo}>
                    <span className={styles.pendingStatusFileName}>{mainDocument.name}</span>
                    <span className={styles.pendingStatusFileSize}>({formatSize(mainDocument.size)})</span>
                  </div>
                </div>
                
                <div className={styles.pendingStatusRight}>
                  {uploadStatus === 'uploading' && <span className={styles.statusText}>Uploading...</span>}
                  {uploadStatus === 'extracting' && <span className={styles.statusText}>Extracting...</span>}
                  {uploadStatus === 'complete' && <CheckCircle2 size={18} color="var(--status-success-icon)" />}
                  
                  {(uploadStatus === 'uploading' || uploadStatus === 'extracting') && (
                    <div className={styles.spinnerIcon}></div>
                  )}
                </div>
              </div>
              
              {(uploadStatus === 'uploading' || uploadStatus === 'extracting') && (
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Section 2: Supporting Documents */}
          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>Supporting Documents</h3>
            
            <div 
              className={`${styles.extractionDropzone} ${isDragging ? styles.isDragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={24} className={styles.extractionDropIcon} strokeWidth={2} />
              <div className={styles.extractionDropText}>Drop files or Browse</div>
              <div className={styles.extractionDropHint}>PDF, DOCX & Max file size: 25 MB &mdash; multiple files allowed</div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInput}
                accept=".pdf,.docx,.doc"
              />
            </div>
            
            {supportingDocs.length > 0 && (
              <div className={styles.extractedCardsList}>
                {supportingDocs.map((doc, idx) => (
                  <div key={idx} className={styles.extractedCard}>
                    <FileIcon size={16} color="var(--text-secondary)" />
                    <div className={styles.extractedCardInfo}>
                      <span className={styles.extractedCardName}>{doc.name}</span>
                      <span className={styles.extractedCardSize}>{formatSize(doc.size)}</span>
                    </div>
                    <button 
                      className={styles.extractedCardDeleteBtn} 
                      onClick={() => handleRemoveDoc(idx)}
                      aria-label="Remove supporting document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.divider}></div>
        <div className={styles.modalFooter}>
          <button className={styles.nextBtn} onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
