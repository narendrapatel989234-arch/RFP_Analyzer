'use client'

import React, { useState } from 'react'
import styles from './UploadZone.module.css'

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)

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
    console.log('Files dropped', e.dataTransfer.files)
  }

  const handleClick = () => {
    console.log('Upload clicked')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Upload RFP — click or drag and drop"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.primaryText}>
        Drop file or <span className={styles.browseLink}>Browse</span>
      </div>
      <div className={styles.hintText}>
        Format: PDF, DOCX, DOC &amp; Max file size: 25 MB
      </div>
    </div>
  )
}
