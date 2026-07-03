'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { Plus } from 'lucide-react'

import styles from '../app/rfp-details/page.module.css'

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

export function SingleUploadZone({ onFileSelect }: SingleUploadProps) {
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
          PDF, DOCX, DOC â€” single file allowed
        </div>
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}

export function ResizableTextarea({ id, className, placeholder, value, onChange, readOnly, disabled, minHeight = 120, renderToolbar }: ResizableTextareaProps) {
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

export function MultiUploadZone({ label, files, setFiles }: MultiUploadProps) {
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
          PDF, DOCX, DOC â€” multiple files allowed
        </div>
      </div>
      {error && <div className={styles.errorText}>{error}</div>}

      {files.length > 0 && (
        <>
          {files.map((file, i) => (
            <div key={i} className={styles.extractedCard}>
              <div className={styles.extractedCardHeader} style={{ cursor: 'default' }}>
                <div className={styles.extractedCardIcon}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className={styles.extractedCardInfo}>
                  <span className={styles.extractedCardName}>{file.name}</span>
                  <span className={styles.extractedCardSize}>{formatSize(file.size)}</span>
                </div>
                <button
                  className={styles.extractedCardDeleteBtn}
                  onClick={(e) => removeFile(i, e)}
                  aria-label={`Remove ${file.name}`}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  )
}

export interface OutlineNode {
  id: string;
  prefix: string;
  label: string;
  children?: OutlineNode[];
}

export const DUMMY_OUTLINE_DATA: OutlineNode[] = [
  { id: '1', prefix: '1', label: 'Table of Contents' },
  { id: '2', prefix: '2', label: 'Leadership Letter' },
  { id: '3', prefix: '3', label: 'Executive Summary' },
  { id: '4', prefix: '4', label: 'Why Inception' },
  {
    id: '5', prefix: '5', label: 'Our Understanding',
    children: [
      { id: '5a', prefix: '5a', label: 'Background' },
      { id: '5b', prefix: '5b', label: 'Objectives' },
      { id: '5c', prefix: '5c', label: 'Scope' }
    ]
  },
  {
    id: '6', prefix: '6', label: 'Solution Approach',
    children: [
      { id: '6a', prefix: '6a', label: 'Methodology' },
      { id: '6b', prefix: '6b', label: 'Key Deliverables' },
      { id: '6c', prefix: '6c', label: 'Assumptions' }
    ]
  },
  {
    id: '7', prefix: '7', label: 'Tech Approach',
    children: [
      { id: '7a', prefix: '7a', label: 'Architecture' }
    ]
  },
  { id: '8', prefix: '8', label: 'Team Structure & CVs' },
  { id: '9', prefix: '9', label: 'Pricing & Commercials' },
  { id: '10', prefix: '10', label: 'Appendix' }
]

export function ParsedOutlineTree({ data, onUpdate }: { data: OutlineNode[], onUpdate: (data: OutlineNode[]) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(collapsedNodes)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCollapsedNodes(next)
  }

  const updateNodeLabel = (nodes: OutlineNode[], id: string, newLabel: string): OutlineNode[] => {
    return nodes.map(node => {
      if (node.id === id) return { ...node, label: newLabel }
      if (node.children) return { ...node, children: updateNodeLabel(node.children, id, newLabel) }
      return node
    })
  }

  const handleEditSave = (id: string, newLabel: string) => {
    setEditingId(null)
    onUpdate(updateNodeLabel(data, id, newLabel))
  }

  const totalSections = 39 // Hardcoded to match prompt request

  const renderNode = (node: OutlineNode, isChild = false) => {
    const isEditing = editingId === node.id
    const hasChildren = node.children && node.children.length > 0
    const isNodeCollapsed = collapsedNodes.has(node.id)

    return (
      <div key={node.id} className={`${isChild ? styles.outlineChild : styles.outlineParent}`}>
        <div className={styles.outlineNodeRow}>
          <div className={styles.outlineNodeLeft}>
            {hasChildren && (
              <div className={styles.outlineChevron} onClick={(e) => toggleNode(node.id, e)}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isNodeCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}
          </div>
          <div className={styles.outlineTextWrapper}>
            <span className={styles.outlinePrefix}>{node.prefix}.</span>
            {isEditing ? (
              <input
                className={styles.inlineInput}
                defaultValue={node.label}
                autoFocus
                onBlur={(e) => handleEditSave(node.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSave(node.id, e.currentTarget.value)
                }}
              />
            ) : (
              <>
                <span className={styles.outlineLabel}>{node.label}</span>
                <button className={styles.inlineEditBtn} onClick={() => setEditingId(node.id)} aria-label="Edit section">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {hasChildren && !isNodeCollapsed && (
          <div className={styles.outlineList}>
            {node.children!.map(child => renderNode(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.outlineCard}>
      <div className={`${styles.outlineHeader} ${!isCollapsed ? styles.outlineHeaderExpanded : ''}`} onClick={() => setIsCollapsed(!isCollapsed)}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform var(--duration-fast)' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>Parsed Outline ({totalSections} sections)</span>
      </div>
      {!isCollapsed && (
        <div className={styles.outlineList}>
          {data.map(node => renderNode(node))}
        </div>
      )}
    </div>
  )
}

export interface TableRow {
  id: string;
  name: string;
  description: string;
}

export interface ExtractedDocument {
  id: string;
  file: File;
  description: string;
  tableData: TableRow[];
  isExpanded: boolean;
}

export interface PendingExtraction {
  id: string;
  file: File;
  type: 'components' | 'partner' | 'format';
  stage: 1 | 2;
}

export function ExtractionDropzone({ label: _label, onDrop }: { label: string, onDrop: (f: File) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      onDrop(e.dataTransfer.files[0])
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onDrop(e.target.files[0])
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
    <div
      className={`${styles.uploadZone} ${isDragging ? styles.isDragging : ''}`}
      role="button"
      tabIndex={0}
      aria-label={_label}
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
        Format: PDF, DOCX, DOC &amp; Max file size: 25 MB
      </div>
    </div>
  )
}
