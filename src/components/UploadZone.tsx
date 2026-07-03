'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './UploadZone.module.css'

interface UploadZoneProps {
  onFileSelect?: (file: File | null) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isUploading && !uploadComplete) {
      const startTime = Date.now()
      const duration = 8000
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const pct = Math.min(Math.floor((elapsed / duration) * 100), 100)
        setProgress(pct)
        
        if (pct >= 100) {
          clearInterval(interval)
          setUploadComplete(true)
          setTimeout(() => {
            // Hard navigation on purpose: router.push() uses Next's client
            // router cache, which can serve a stale RSC payload for this
            // route in dev mode (especially while the target page is being
            // edited), causing intermittent failed transitions. A full
            // navigation always requests a fresh render.
            window.location.href = '/rfp-details'
          }, 1000)
        }
      }, 50)
      
      return () => clearInterval(interval)
    } else if (!isUploading) {
      setProgress(0)
    }
  }, [isUploading, uploadComplete])

  const validateFile = (selectedFile: File) => {
    setError(null)
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const ext = selectedFile.name.toLowerCase()
    const isValidExt = ext.endsWith('.pdf') || ext.endsWith('.docx') || ext.endsWith('.doc')
    
    if (!validTypes.includes(selectedFile.type) && !isValidExt) {
      setError('Only PDF, DOCX, or DOC files are supported')
      return false
    }
    
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size must be under 25 MB')
      return false
    }
    
    return true
  }

  const handleFile = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
      if (onFileSelect) onFileSelect(selectedFile)
      setIsUploading(true)
      setProgress(0)
      setUploadComplete(false)
    }
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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.clearBtn}`)) return
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
    e.target.value = ''
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setError(null)
    if (onFileSelect) onFileSelect(null)
  }
  
  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <>
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''} ${file ? styles.hasFile : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload RFP — click or drag and drop"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleFileInputChange}
        />
        
        {file ? (
          <div className={styles.previewRow}>
            <svg
              className={styles.fileIcon}
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>({formatSize(file.size)})</span>
            </div>
            <button className={styles.clearBtn} onClick={handleClear} aria-label="Remove file">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg
              className={styles.uploadIcon}
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className={styles.primaryText}>
              Drop your RFP here or <span className={styles.browseLink}>Browse</span>
            </div>
            <div className={styles.hintText}>
              Format: PDF, DOCX &mdash; Max file size: 25 MB
            </div>
          </>
        )}
        
        {error && <div className={styles.errorText}>{error}</div>}
      </div>

      {isUploading && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.spinner}></div>
            <h3 className={styles.modalHeading}>
              {uploadComplete ? "Processing complete" : "Uploading your document"}
            </h3>
            <p className={styles.modalSubText}>
              {uploadComplete ? "Taking you to the next step…" : file?.name}
            </p>
            <div className={styles.progressBarTrack}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 80ms linear' }}
              ></div>
            </div>
            <div className={styles.progressText}>{progress}%</div>
          </div>
        </div>
      )}
    </>
  )
}
