'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './CompactUpload.module.css'

export function CompactUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      router.push('/rfp/step4-demo')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      router.push('/rfp/step4-demo')
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div 
      className={`${styles.uploadContainer} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.uploadContent}>
        <p className={styles.uploadText}>
          Drop your RFP here or <span className={styles.browseLink} onClick={handleButtonClick}>Browse</span>
        </p>
        <p className={styles.subText}>Format: PDF, DOCX — Max file size: 25 MB</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className={styles.hiddenInput} 
        multiple 
      />
    </div>
  )
}
