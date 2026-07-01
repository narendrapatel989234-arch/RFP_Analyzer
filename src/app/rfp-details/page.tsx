'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import styles from './page.module.css'

interface ResizableTextareaProps {
  id?: string;
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  minHeight?: number;
  renderToolbar?: (handle: React.ReactNode) => React.ReactNode;
}

interface SingleUploadProps {
  onFileSelect: (file: File) => void;
}

function SingleUploadZone({ onFileSelect }: SingleUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    setError(null)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const ext = file.name.toLowerCase()
    const isValidExt = ext.endsWith('.pdf') || ext.endsWith('.docx') || ext.endsWith('.doc')

    if (!validTypes.includes(file.type) && !isValidExt) {
      setError('Only PDF, DOCX, or DOC files are supported')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size must be under 25 MB')
      return
    }

    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      validateFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateFile(e.target.files[0])
    }
    e.target.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <div>
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload Document"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleChange}
        />
        <div className={styles.uploadIconCircle}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className={styles.uploadText}>
          <span style={{ color: 'var(--text-primary)' }}>Drop file or </span>
          Browse
        </div>
        <div className={styles.uploadHint}>
          PDF, DOCX, DOC — single file allowed
        </div>
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}

function ResizableTextarea({ id, className, placeholder, value, onChange, readOnly, disabled, minHeight = 120, renderToolbar }: ResizableTextareaProps) {
  const [height, setHeight] = useState(minHeight)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = height
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      setHeight(Math.max(minHeight, startHeight + deltaY))
    }
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const HandleIcon = () => (
    <div 
      className={renderToolbar ? styles.resizeHandleInline : styles.resizeHandle} 
      onMouseDown={handleMouseDown}
      aria-hidden="true"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path d="M8 0L10 0L10 2L8 2L8 0Z M4 4L6 4L6 6L4 6L4 4Z M8 4L10 4L10 6L8 6L8 4Z M0 8L2 8L2 10L0 10L0 8Z M4 8L6 8L6 10L4 10L4 8Z M8 8L10 8L10 10L8 10L8 8Z" />
      </svg>
    </div>
  )

  return (
    <>
      <div className={styles.textareaWrapper} style={{ height: `${height}px` }}>
        <textarea
          id={id}
          ref={textareaRef}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          style={{ height: `${height}px`, display: 'block' }}
        />
        {!renderToolbar && <HandleIcon />}
      </div>
      {renderToolbar && renderToolbar(<HandleIcon />)}
    </>
  )
}

interface MultiUploadProps {
  label: string;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function MultiUploadZone({ label, files, setFiles }: MultiUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1) + ' MB'

  const validateFiles = (selectedFiles: FileList | File[]) => {
    setError(null)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const newFiles: File[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const ext = file.name.toLowerCase()
      const isValidExt = ext.endsWith('.pdf') || ext.endsWith('.docx') || ext.endsWith('.doc')

      if (!validTypes.includes(file.type) && !isValidExt) {
        setError('Only PDF, DOCX, or DOC files are supported')
        return
      }

      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be under 25 MB')
        return
      }

      newFiles.push(file)
    }

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      validateFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section>
      <label className={styles.sectionLabel}>{label}</label>
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple={true}
          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleChange}
        />
        <div className={styles.uploadIconCircle}>
          <svg
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
        </div>
        <div className={styles.uploadText}>
          <span style={{ color: 'var(--text-primary)' }}>Drop files or </span>
          Browse
        </div>
        <div className={styles.uploadHint}>
          PDF, DOCX, DOC — multiple files allowed
        </div>
      </div>
      {error && <div className={styles.errorText}>{error}</div>}

      {files.length > 0 && (
        <div className={styles.fileListStandalone}>
          {files.map((file, i) => (
            <div key={i} className={styles.fileListItem}>
              <div className={styles.fileListIconWrapper}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className={styles.fileListName}>{file.name}</span>
              <span className={styles.fileListSize}>{formatSize(file.size)}</span>
              <button
                className={styles.trashBtnList}
                onClick={(e) => removeFile(i, e)}
                aria-label={`Remove ${file.name}`}
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function RFPDetailsPage() {
  const router = useRouter()
  const [uploadedDoc, setUploadedDoc] = useState<{ name: string; size: string } | null>({ name: 'RFP_Document.pdf', size: '2.4 MB' })
  const [promptText, setPromptText] = useState('')
  const [capabilityDocs, setCapabilityDocs] = useState<File[]>([])
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [formatType, setFormatType] = useState<'ai' | 'manual-text' | 'manual-upload' | null>('ai')
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  
  // Format state
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [isAiGenerated, setIsAiGenerated] = useState(false)
  const [aiFormatText, setAiFormatText] = useState('')
  const [manualFormatText, setManualFormatText] = useState('')
  
  // Upload Format state
  const [uploadFormatFile, setUploadFormatFile] = useState<File | null>(null)
  const [isUploadExtracting, setIsUploadExtracting] = useState(false)
  const [isUploadExtracted, setIsUploadExtracted] = useState(false)
  const [uploadFormatText, setUploadFormatText] = useState('')
  
  const handleGenerateAi = () => {
    setIsAiGenerating(true)
    setTimeout(() => {
      setIsAiGenerating(false)
      setIsAiGenerated(true)
      setAiFormatText("1. Executive Summary\n2. Understanding of Requirements\n3. Proposed Solution\n4. Technical Architecture\n5. Project Timeline\n6. Team & Credentials\n7. Commercials & Pricing\n8. Appendix")
    }, 4000)
  }

  const handleFormatFileSelect = (file: File) => {
    setUploadFormatFile(file)
    setIsUploadExtracting(true)
    
    setTimeout(() => {
      setIsUploadExtracting(false)
      setIsUploadExtracted(true)
      setUploadFormatText("1. Executive Summary\n2. Scope of Work\n3. Proposed Methodology\n4. Team Structure & CVs\n5. Project Timeline\n6. Pricing & Commercials\n7. Compliance & Certifications\n8. Appendix")
    }, 3000)
  }

  const handleClearAll = () => {
    setUploadedDoc(null)
    setPromptText('')
    setCapabilityDocs([])
    setSupportingDocs([])
    setFormatType('ai')
    setHasAttemptedSubmit(false)
    setIsAiGenerating(false)
    setIsAiGenerated(false)
    setAiFormatText('')
    setManualFormatText('')
    setUploadFormatFile(null)
    setIsUploadExtracting(false)
    setIsUploadExtracted(false)
    setUploadFormatText('')
  }

  const handleSubmit = () => {
    setHasAttemptedSubmit(true)
    if (formatType === null) return
    
    console.log({
      uploadedDoc,
      promptText,
      capabilityDocs,
      supportingDocs,
      formatType,
      aiFormatText: formatType === 'ai' ? aiFormatText : undefined,
      manualFormatText: formatType === 'manual-text' ? manualFormatText : undefined,
      uploadFormatFile: formatType === 'manual-upload' ? uploadFormatFile : undefined,
      uploadFormatText: formatType === 'manual-upload' ? uploadFormatText : undefined
    })
  }

  return (
    <div className={styles.page}>
      <TopNav />

      <main className={styles.container}>
        <div>
          <button className={styles.backButton} onClick={() => router.push('/')}>
            <svg
              className={styles.backButtonIcon}
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </button>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>RFP Configuration</h1>
            <p className={styles.pageSubText}>Provide context and documents to help AI generate the best response for your RFP.</p>
            <hr className={styles.pageDivider} />
          </div>
        </div>

        {/* Section 1 - Uploaded Document */}
        <section>
          <label className={styles.sectionLabel}>Uploaded Document</label>
          {uploadedDoc ? (
            <div className={styles.fileCard}>
              <div className={styles.fileListItem}>
                <div className={styles.fileListIconWrapper}>
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <span className={styles.fileListName}>{uploadedDoc.name}</span>
                <span className={styles.fileListSize}>{uploadedDoc.size}</span>
                <button
                  className={styles.trashBtnList}
                  onClick={() => setUploadedDoc(null)}
                  aria-label="Remove document"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <SingleUploadZone
              onFileSelect={(file) => {
                setUploadedDoc({
                  name: file.name,
                  size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                })
              }}
            />
          )}
        </section>

        {/* Section 2 - Prompt */}
        <section>
          <label htmlFor="promptInput" className={styles.sectionLabel}>Prompt</label>
          <div className={styles.promptCard}>
            <ResizableTextarea
              id="promptInput"
              className={styles.promptTextarea}
              placeholder="Add any specific instructions, context, or direction for the AI before it starts generating the RFP response…"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              minHeight={120}
              renderToolbar={(handle) => (
                <div className={styles.toolbarRowPrompt}>
                  <div className={styles.toolbarRight}>
                    <div className={styles.charCount}>{promptText.length} / 2000</div>
                    {handle}
                  </div>
                </div>
              )}
            />
          </div>
        </section>

        {/* Section 3 - Upload Documents */}
        <MultiUploadZone
          label="Capability Documents"
          files={capabilityDocs}
          setFiles={setCapabilityDocs}
        />
        <MultiUploadZone
          label="Supporting Documents"
          files={supportingDocs}
          setFiles={setSupportingDocs}
        />

        {/* Section 4 - Suggested Format */}
        <section>
          <label className={styles.sectionLabel}>
            Suggested Format <span style={{ color: '#ff4d4d' }}>*</span>
          </label>
          <div className={styles.formatGrid}>
            <label className={`${styles.radioCard} ${formatType === 'ai' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="formatType"
                value="ai"
                checked={formatType === 'ai'}
                onChange={() => setFormatType('ai')}
                style={{ display: 'none' }}
              />
              <div className={styles.radioTopRow}>
                <div className={styles.radioIconWrapper}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                    <path d="M5 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
                  </svg>
                </div>
                <div className={styles.radioCircle}>
                  {formatType === 'ai' && <div className={styles.radioInner} />}
                </div>
              </div>
              <div className={styles.radioBottomRow}>
                <span className={styles.radioLabel}>AI to Generate</span>
                <span className={styles.radioSubText}>Let AI analyze the RFP and suggest a response format</span>
              </div>
            </label>
            <label className={`${styles.radioCard} ${formatType === 'manual-text' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="formatType"
                value="manual-text"
                checked={formatType === 'manual-text'}
                onChange={() => setFormatType('manual-text')}
                style={{ display: 'none' }}
              />
              <div className={styles.radioTopRow}>
                <div className={styles.radioIconWrapper}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div className={styles.radioCircle}>
                  {formatType === 'manual-text' && <div className={styles.radioInner} />}
                </div>
              </div>
              <div className={styles.radioBottomRow}>
                <span className={styles.radioLabel}>Write Manually</span>
                <span className={styles.radioSubText}>Type your preferred response format in a text field</span>
              </div>
            </label>
            <label className={`${styles.radioCard} ${formatType === 'manual-upload' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="formatType"
                value="manual-upload"
                checked={formatType === 'manual-upload'}
                onChange={() => setFormatType('manual-upload')}
                style={{ display: 'none' }}
              />
              <div className={styles.radioTopRow}>
                <div className={styles.radioIconWrapper}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
                <div className={styles.radioCircle}>
                  {formatType === 'manual-upload' && <div className={styles.radioInner} />}
                </div>
              </div>
              <div className={styles.radioBottomRow}>
                <span className={styles.radioLabel}>Upload Format</span>
                <span className={styles.radioSubText}>Upload a document that defines your response format</span>
              </div>
            </label>
          </div>

          {formatType === null && hasAttemptedSubmit && (
            <div className={styles.errorText} style={{ marginTop: '0', marginBottom: 'var(--space-4)' }}>
              Please select a format to continue
            </div>
          )}

          {formatType === 'ai' && (
            <div className={styles.promptCard}>
              <label htmlFor="aiFormatTextarea" className="sr-only" style={{ display: 'none' }}>AI Format Text</label>
              <ResizableTextarea
                id="aiFormatTextarea"
                className={styles.promptTextarea}
                placeholder="AI-generated format will appear here after you click Generate..."
                readOnly={!isAiGenerated}
                disabled={!isAiGenerated}
                value={aiFormatText}
                onChange={(e) => setAiFormatText(e.target.value)}
                minHeight={160}
                renderToolbar={(handle) => (
                  <div className={styles.toolbarRowDividedEnd}>
                    {!isAiGenerated && (
                      <button
                        className={styles.smallGenerateBtn}
                        onClick={handleGenerateAi}
                        disabled={isAiGenerating}
                      >
                        {isAiGenerating && <div className={styles.buttonSpinner} />}
                        {isAiGenerating ? 'Generating...' : 'Generate'}
                      </button>
                    )}
                    <div className={styles.charCount}>{aiFormatText.length} / 2000</div>
                    {handle}
                  </div>
                )}
              />
            </div>
          )}
          
          {formatType === 'manual-text' && (
            <div className={styles.promptCard}>
              <label htmlFor="manualFormatTextarea" className="sr-only" style={{ display: 'none' }}>Manual Format Text</label>
              <ResizableTextarea
                id="manualFormatTextarea"
                className={styles.promptTextarea}
                placeholder="Describe the format you want the solution to follow..."
                value={manualFormatText}
                onChange={(e) => setManualFormatText(e.target.value)}
                minHeight={160}
                renderToolbar={(handle) => (
                  <div className={styles.toolbarRowPrompt}>
                    <div className={styles.toolbarRight}>
                      <div className={styles.charCount}>{manualFormatText.length} / 2000</div>
                      {handle}
                    </div>
                  </div>
                )}
              />
            </div>
          )}

          {formatType === 'manual-upload' && (
            <div>
              {!uploadFormatFile && (
                <SingleUploadZone onFileSelect={handleFormatFileSelect} />
              )}
              {uploadFormatFile && isUploadExtracting && (
                <div className={styles.formatSpinnerContainer}>
                  <div className={styles.largeSpinner}></div>
                  <div className={styles.spinnerText}>Extracting format from document...</div>
                </div>
              )}
              {uploadFormatFile && isUploadExtracted && (
                <div className={styles.promptCard}>
                  <ResizableTextarea
                    id="uploadFormatTextarea"
                    className={styles.promptTextarea}
                    value={uploadFormatText}
                    onChange={(e) => setUploadFormatText(e.target.value)}
                    minHeight={160}
                    renderToolbar={(handle) => (
                      <div className={styles.toolbarRowDividedBetween}>
                        <div className={styles.extractedToolbarFile}>
                          <div className={styles.extractedToolbarIcon}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10 9 9 9 8 9" />
                            </svg>
                          </div>
                          <span className={styles.extractedToolbarName}>{uploadFormatFile.name}</span>
                          <span className={styles.extractedToolbarSize}>{(uploadFormatFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <button
                            className={styles.extractedToolbarTrash}
                            onClick={() => {
                              setUploadFormatFile(null)
                              setIsUploadExtracted(false)
                              setUploadFormatText('')
                            }}
                            aria-label="Remove format document"
                          >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div className={styles.charCount}>{uploadFormatText.length} / 2000</div>
                          {handle}
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Action Row */}
        <div className={styles.actionRow}>
          <button className={styles.clearBtn} onClick={handleClearAll} aria-label="Clear all fields">
            Clear
          </button>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit} 
            disabled={formatType === null}
            aria-label="Submit RFP details"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  )
}
