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
        Drop file or <span className={styles.browseLink}>Browse</span>
      </div>
      <div className={styles.hintText}>
        Format: PDF, DOCX, DOC &amp; Max file size: 25 MB
      </div>
    </div>
  )
}
