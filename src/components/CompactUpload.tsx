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
    <div className={styles.uploadWrapper}>
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <p className={styles.uploadText}>Drop your RFP here or Browse</p>
        <p className={styles.subText}>Format: PDF, DOCX — Max file size: 25 MB</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className={styles.hiddenInput} 
          multiple 
        />
      </div>

      <div className={styles.divider}>OR</div>

      <button className={styles.createBtn} onClick={() => router.push('/rfp/step4-demo')}>
        Create New Request
      </button>
    </div>
  )
}
