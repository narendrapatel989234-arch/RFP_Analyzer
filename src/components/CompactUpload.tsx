'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'
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
      <div className={styles.topSection}>
        <div className={styles.titleArea}>
          <div className={styles.titleLine}>
            <span className={styles.titleText}>Start From Here</span>
          </div>
        </div>
      </div>

      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className={styles.iconWrapper}>
          <UploadCloud size={24} strokeWidth={2} />
        </div>
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
