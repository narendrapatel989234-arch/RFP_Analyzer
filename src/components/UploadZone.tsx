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
        className={styles.icon}
        width="40"
        height="40"
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
      <h2 className={styles.heading}>Click to upload or drag & drop</h2>
      <p className={styles.subLabel}>Supports PDF and DOCX</p>
      <button className={styles.browseBtn} tabIndex={-1}>
        Browse Files
      </button>
    </div>
  )
}
