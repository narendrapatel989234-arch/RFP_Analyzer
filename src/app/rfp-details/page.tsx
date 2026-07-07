'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { Plus, File, RefreshCw, AlertTriangle } from 'lucide-react'
import { CapabilitiesModal } from '../../components/CapabilitiesModal'
import modalStyles from '../../components/CapabilitiesModal.module.css'
import {
  SingleUploadZone,
  ResizableTextarea,
  MultiUploadZone,
  OutlineNode,
  ParsedOutlineTree,
  TableRow,
  ExtractedDocument,
  PendingExtraction,
  ExtractionDropzone,
  DUMMY_OUTLINE_DATA
} from '@/components/rfp-components'
import styles from './page.module.css'

export default function RFPDetailsPage() {
  const router = useRouter()
  const [uploadedDoc, setUploadedDoc] = useState<{ name: string; size: string } | null>({ name: 'RFP_Document.pdf', size: '2.4 MB' })
  const [promptText, setPromptText] = useState('')
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] = useState(false)
  const [activeCapabilityTab, setActiveCapabilityTab] = useState(0)
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [addComponentsDocs, setAddComponentsDocs] = useState<ExtractedDocument[]>([])
  const [partnerCapabilitiesDocs, setPartnerCapabilitiesDocs] = useState<ExtractedDocument[]>([])
  const [pendingExtractions, setPendingExtractions] = useState<PendingExtraction[]>([])
  const [editingCell, setEditingCell] = useState<{ docId: string, rowId: string, field: 'name' | 'description' | 'docDescription' } | null>(null)
  const [dummySupportingDocs, setDummySupportingDocs] = useState(['Compliance.pdf', 'Main_Features.pdf'])
  const [activeSummaryTab, setActiveSummaryTab] = useState(0)
  const supportingDocsInputRef = useRef<HTMLInputElement>(null)
  const [isSummaryRefreshing, setIsSummaryRefreshing] = useState(false)
  const [documentsChanged, setDocumentsChanged] = useState(false)

  const handleRefreshSummary = () => {
    setIsSummaryRefreshing(true)
    setTimeout(() => {
      setIsSummaryRefreshing(false)
      setDocumentsChanged(false)
    }, 2500)
  }

  const handleAddSupportingDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFileNames = Array.from(e.target.files).map(f => f.name)
      setDummySupportingDocs(prev => [...prev, ...newFileNames])
      setDocumentsChanged(true)
    }
    e.target.value = ''
  }

  // Snapshot state for Cancel/Save functionality
  const [capabilitiesSnapshot, setCapabilitiesSnapshot] = useState<{
    addComponentsDocs: ExtractedDocument[],
    partnerCapabilitiesDocs: ExtractedDocument[],
    formatPromptText: string,
    formatAttachedFile: File | null,
    outlineVisible: boolean,
    outlineData: OutlineNode[]
  } | null>(null)

  const openCapabilitiesModal = () => {
    setCapabilitiesSnapshot({
      addComponentsDocs,
      partnerCapabilitiesDocs,
      formatPromptText,
      formatAttachedFile,
      outlineVisible,
      outlineData
    })
    setIsCapabilitiesModalOpen(true)
  }

  const handleCancelCapabilitiesModal = () => {
    if (capabilitiesSnapshot) {
      setAddComponentsDocs(capabilitiesSnapshot.addComponentsDocs)
      setPartnerCapabilitiesDocs(capabilitiesSnapshot.partnerCapabilitiesDocs)
      setFormatPromptText(capabilitiesSnapshot.formatPromptText)
      setFormatAttachedFile(capabilitiesSnapshot.formatAttachedFile)
      setOutlineVisible(capabilitiesSnapshot.outlineVisible)
      setOutlineData(capabilitiesSnapshot.outlineData)
    }
    setIsCapabilitiesModalOpen(false)
  }

  const handleSaveCapabilitiesModal = () => {
    setCapabilitiesSnapshot(null)
    setIsCapabilitiesModalOpen(false)
  }

  const handleExtractionUpload = (file: File, type: 'components' | 'partner') => {
    const id = Math.random().toString(36).substr(2, 9)
    setPendingExtractions(prev => [...prev, { id, file, type, stage: 1 }])

    setTimeout(() => {
      setPendingExtractions(prev => prev.map(p => p.id === id ? { ...p, stage: 2 } : p))
      setTimeout(() => {
        setPendingExtractions(prev => prev.filter(p => p.id !== id))
        const newDoc: ExtractedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          isExpanded: true,
          description: type === 'components'
            ? "Cortes is Inception42's unified platform for building, running, and scaling AI agents across the G42 product portfolio. It provides a common, secure, sovereign-capable foundation for agent infrastructure."
            : "PartnerX is a certified cloud and AI systems integrator with deep expertise across enterprise transformation programmes in the public and private sector.",
          tableData: type === 'components'
            ? [
              { id: '1', name: 'Infrastructure Orchestration', description: 'Kubernetes-based deployment and runtime management with RBAC and IAM controls' },
              { id: '2', name: 'Enterprise RAG Framework', description: 'Hybrid retrieval system combining vector, keyword, and graph search with secure document access' },
              { id: '3', name: 'Agent Orchestration', description: 'Factory and runtime for composable agents enabling agent creation, execution, and pub/sub coordination' },
              { id: '4', name: 'Identity and Access Management', description: 'Zero-trust security architecture with federated identity support including Entra and Keycloak' },
              { id: '5', name: 'Data Foundation and Lakehouse', description: 'Scalable multi-tenant data storage with Delta tables, ACID transactions, and schema enforcement' }
            ]
            : [
              { id: '1', name: 'Cloud Migration', description: 'End-to-end cloud transformation services including lift-and-shift and cloud-native re-architecture' },
              { id: '2', name: 'DevOps Transformation', description: 'CI/CD pipeline automation, Infrastructure as Code, and SRE best practices implementation' },
              { id: '3', name: 'AI Integration', description: 'Embedding machine learning models and generative AI capabilities into legacy business applications' },
              { id: '4', name: 'Data Engineering', description: 'Building scalable data pipelines, data warehouses, and modern analytics platforms' },
              { id: '5', name: 'Security & Compliance', description: 'Implementation of enterprise security frameworks, compliance auditing, and continuous monitoring' }
            ]
        }
        if (type === 'components') {
          setAddComponentsDocs(prev => [...prev, newDoc])
        } else {
          setPartnerCapabilitiesDocs(prev => [...prev, newDoc])
        }
      }, 1000)
    }, 1500)
  }

  const updateTableData = (type: 'components' | 'partner', docId: string, rowId: string, field: 'name' | 'description', value: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        tableData: doc.tableData.map(row => {
          if (row.id !== rowId) return row;
          return { ...row, [field]: value }
        })
      }
    }))
  }

  const updateDocDescription = (type: 'components' | 'partner', docId: string, value: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, description: value }
    }))
  }

  const addTableRow = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        tableData: [...doc.tableData, { id: Math.random().toString(36).substr(2, 9), name: '', description: '' }]
      }
    }))
  }

  const toggleDocExpanded = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, isExpanded: !doc.isExpanded }
    }))
  }

  const deleteDoc = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.filter(doc => doc.id !== docId))
  }



  const deleteTableRow = (type: 'components' | 'partner', docId: string, rowId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, tableData: doc.tableData.filter(r => r.id !== rowId) }
    }))
  }

  const renderExtractedDoc = (doc: ExtractedDocument, type: 'components' | 'partner') => {
    const tableLabel = type === 'components' ? 'Component List' : 'Capability List'
    return (
      <div key={doc.id} className={styles.extractedCard}>
        <div className={styles.extractedCardHeader} onClick={() => toggleDocExpanded(type, doc.id)}>
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
            <span className={styles.extractedCardName}>{doc.file.name}</span>
            <span className={styles.extractedCardSize}>{(doc.file.size / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
          <button className={styles.extractedCardDeleteBtn} onClick={(e) => { e.stopPropagation(); deleteDoc(type, doc.id) }} aria-label="Delete document">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
          <div className={"" + styles.extractedCardChevron + (doc.isExpanded ? " " + styles.extractedCardChevronOpen : "")}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {doc.isExpanded && (
          <div className={styles.extractedCardBody}>
            <div className={styles.extractedCardSection}>
              <h4 className={styles.extractedCardDescTitle}>Description</h4>
              {editingCell?.docId === doc.id && editingCell?.field === 'docDescription' ? (
                <textarea
                  key="edit-description"
                  className={styles.extractedCardInput}
                  value={doc.description}
                  onChange={(e) => updateDocDescription(type, doc.id, e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  autoFocus
                  placeholder="Enter description"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              ) : (
                <div
                  key="view-description"
                  className={styles.editableCell}
                  onClick={() => setEditingCell({ docId: doc.id, rowId: '', field: 'docDescription' })}
                  style={{ alignItems: 'flex-start', whiteSpace: 'pre-wrap', lineHeight: 1.5, minHeight: '80px' }}
                >
                  {doc.description ? <span>{doc.description}</span> : <span className={styles.emptyPlaceholder}>Enter description</span>}
                </div>
              )}
            </div>

            <div className={styles.extractedCardSection}>
              <div className={styles.extractedCardTableTitleRow}>
                <h4 className={styles.extractedCardTableTitle}>{tableLabel}</h4>
              </div>

              <table className={styles.extractedCardTable}>
                <thead>
                  <tr>
                    <th className={styles.extractedCardTh}>Name</th>
                    <th className={styles.extractedCardTh}>Description</th>
                    <th className={styles.extractedCardTh} style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {doc.tableData.map(row => (
                    <tr key={row.id}>
                      <td className={styles.extractedCardTd} style={{ padding: '0' }}>
                        {editingCell?.docId === doc.id && editingCell?.rowId === row.id && editingCell?.field === 'name' ? (
                          <input
                            key={`input-name-${row.id}`}
                            className={styles.extractedCardInput}
                            value={row.name}
                            onChange={(e) => updateTableData(type, doc.id, row.id, 'name', e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            placeholder="Enter name"
                          />
                        ) : (
                          <div
                            key={`view-name-${row.id}`}
                            className={styles.editableCell}
                            onClick={() => setEditingCell({ docId: doc.id, rowId: row.id, field: 'name' })}
                          >
                            {row.name ? <span>{row.name}</span> : <span className={styles.emptyPlaceholder}>Enter name</span>}
                          </div>
                        )}
                      </td>
                      <td className={styles.extractedCardTd} style={{ padding: '0' }}>
                        {editingCell?.docId === doc.id && editingCell?.rowId === row.id && editingCell?.field === 'description' ? (
                          <input
                            key={`input-desc-${row.id}`}
                            className={styles.extractedCardInput}
                            value={row.description}
                            onChange={(e) => updateTableData(type, doc.id, row.id, 'description', e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            placeholder="Enter description"
                          />
                        ) : (
                          <div
                            key={`view-desc-${row.id}`}
                            className={styles.editableCell}
                            onClick={() => setEditingCell({ docId: doc.id, rowId: row.id, field: 'description' })}
                          >
                            {row.description ? <span>{row.description}</span> : <span className={styles.emptyPlaceholder}>Enter description</span>}
                          </div>
                        )}
                      </td>
                      <td className={styles.extractedCardTd} style={{ textAlign: 'right' }}>
                        <button className={styles.extractedCardDeleteBtn} onClick={() => deleteTableRow(type, doc.id, row.id)} aria-label="Delete row">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <button className={styles.extractedCardAddBtn} onClick={() => addTableRow(type, doc.id)}>+ Add row</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Format state
  const [formatPromptText, setFormatPromptText] = useState('')
  const [formatAttachedFile, setFormatAttachedFile] = useState<File | null>(null)
  const [formatFileError, setFormatFileError] = useState('')
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
  const [outlineVisible, setOutlineVisible] = useState(false)
  const [outlineData, setOutlineData] = useState<OutlineNode[]>([])
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      router.push('/')
    }, 2500)
  }

  const manualFileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateOutline = () => {
    setIsGeneratingOutline(true)
    setOutlineVisible(false)
    setTimeout(() => {
      setIsGeneratingOutline(false)
      setOutlineData(DUMMY_OUTLINE_DATA)
      setOutlineVisible(true)
    }, 4000) // Simulate generation delay
  }

  const handleFormatFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormatFileError('')
    if (e.target.files?.length) {
      const file = e.target.files[0]
      const ext = file.name.toLowerCase()
      const isValidExt = ext.endsWith('.pdf') || ext.endsWith('.docx') || ext.endsWith('.doc')
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
      if ((validTypes.includes(file.type) || isValidExt) && file.size <= 25 * 1024 * 1024) {
        setFormatAttachedFile(file)
      } else {
        setFormatFileError('Please attach a valid PDF or DOC/DOCX file under 25MB.')
      }
    }
    e.target.value = ''
  }

  const handleClearAll = () => {
    setUploadedDoc(null)
    setPromptText('')
    setSupportingDocs([])
    setAddComponentsDocs([])
    setPartnerCapabilitiesDocs([])
    setFormatPromptText('')
    setFormatAttachedFile(null)
    setFormatFileError('')
    setIsGeneratingOutline(false)
    setOutlineVisible(false)
    setOutlineData([])
  }

  const handleSubmit = () => {

    console.warn({
      uploadedDoc,
      promptText,
      supportingDocs,
      addComponentsDocs,
      partnerCapabilitiesDocs,
      formatPromptText,
      formatAttachedFile,
      outlineData
    })

    triggerToast("RFP submitted successfully!")
  }

  let formatBtnLabel = 'Generate with AI'
  if (outlineVisible) {
    formatBtnLabel = 'Regenerate with AI'
  } else if (formatAttachedFile) {
    formatBtnLabel = 'Extract'
  } else if (formatPromptText.trim().length > 0) {
    formatBtnLabel = 'Regenerate with AI'
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  backgroundColor: 'var(--colors-neutral-900)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--colors-neutral-0)',
                }}
              >
                <File size={20} strokeWidth={2.5} />
              </div>
              Configure RFP Response
            </h1>
            <p className={styles.pageSubText}>Add your RFP, reference documents, and team inputs so AI can generate a tailored proposal.</p>
            <hr className={styles.pageDivider} />
          </div>
        </div>

        {/* Section 1 - RFP Document */}
        <section>
          <label className={styles.sectionLabel}>RFP Document</label>
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
                  onClick={() => { setUploadedDoc(null); setDocumentsChanged(true); }}
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
                setDocumentsChanged(true)
              }}
            />
          )}
        </section>

        {/* Section 1.5 - RFP Supporting Documents */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <label className={styles.sectionLabel} style={{ marginBottom: 0 }}>RFP Supporting Documents</label>
            {dummySupportingDocs.length > 0 && (
              <button
                className={styles.addCapabilitiesBtn}
                onClick={() => supportingDocsInputRef.current?.click()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Document
              </button>
            )}
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              multiple
              ref={supportingDocsInputRef}
              style={{ display: 'none' }}
              onChange={handleAddSupportingDocs}
            />
          </div>

          {dummySupportingDocs.length === 0 ? (
            <div
              className={styles.uploadZone}
              role="button"
              tabIndex={0}
              aria-label="Upload RFP Supporting Documents"
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.length) {
                  const newFileNames = Array.from(e.dataTransfer.files).map(f => f.name)
                  setDummySupportingDocs(prev => [...prev, ...newFileNames])
                  setDocumentsChanged(true)
                }
              }}
              onClick={() => supportingDocsInputRef.current?.click()}
            >
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
                PDF, DOCX &amp; Max file size: 25 MB &mdash; multiple files allowed
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
              {dummySupportingDocs.map((doc, idx) => (
                <div key={idx} className={styles.fileCard}>
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
                    <span className={styles.fileListName}>{doc}</span>
                    <button
                      className={styles.trashBtnList}
                      onClick={() => { setDummySupportingDocs(prev => prev.filter((_, i) => i !== idx)); setDocumentsChanged(true); }}
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
              ))}
            </div>
          )}
        </section>

        {/* Section 1.75 - RFP Summary */}
        <section>
          <div className={styles.summaryHeader} style={{ marginBottom: 'var(--space-4)' }}>
            <label className={styles.sectionLabel} style={{ marginBottom: 0 }}>RFP Summary</label>
            <button
              className={styles.refreshBtn}
              onClick={handleRefreshSummary}
              disabled={isSummaryRefreshing}
            >
              <RefreshCw size={14} className={isSummaryRefreshing ? styles.spinning : ''} />
              {isSummaryRefreshing ? 'Refreshing...' : 'Refresh Summary'}
            </button>
          </div>
          {documentsChanged && !isSummaryRefreshing && (
            <div style={{
              width: '100%',
              padding: '0 0 var(--space-2) 0',
              marginBottom: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#d97706', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                <AlertTriangle size={16} />
                Documents have changed — refresh RFP Summary to reflect the latest data.
              </div>
            </div>
          )}
          <div className={styles.summaryTabsHeader}>
            {['Executive Summary', 'Customer Expectations', 'Capabilities Requested', 'Technical Requirements', 'Deliverables', 'Compliance Requirements'].map((tabName, idx) => (
              <button
                key={idx}
                className={`${styles.summaryTabBtn} ${activeSummaryTab === idx ? styles.summaryTabActive : ''}`}
                onClick={() => setActiveSummaryTab(idx)}
              >
                {tabName}
              </button>
            ))}
          </div>
          <div className={styles.summaryContent}>
            {isSummaryRefreshing ? (
              <div className={styles.summaryLoading}>
                <div className={styles.skeletonRow} style={{ width: '60%' }} />
                <div className={styles.skeletonRow} style={{ width: '80%' }} />
                <div className={styles.skeletonRow} style={{ width: '50%' }} />
              </div>
            ) : (
              <>
                {activeSummaryTab === 0 && (
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Customer</td><td>Department of Government Enablement (DGE) & Abu Dhabi Judicial Department (ADJD)</td></tr>
                    <tr><td>Project</td><td>AI-Native Judiciary System (AINJS)</td></tr>
                    <tr><td>Objective</td><td>Build an AI-powered judicial platform to assist judges throughout the judicial lifecycle.</td></tr>
                    <tr><td>Engagement</td><td>End-to-end implementation including AI platform, integrations, UX, deployment, and support.</td></tr>
                    <tr><td>Duration</td><td>14 Months</td></tr>
                    <tr><td>Proposal Due</td><td>23 June 2026</td></tr>
                  </tbody>
                </table>
              )}
              {activeSummaryTab === 1 && (
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th>Customer Expects</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Business</td><td>Faster, transparent judicial decision-making</td></tr>
                    <tr><td>AI</td><td>Agentic AI with explainable recommendations</td></tr>
                    <tr><td>Architecture</td><td>API-first platform</td></tr>
                    <tr><td>Hosting</td><td>UAE Sovereign Cloud</td></tr>
                    <tr><td>Integration</td><td>Integration with existing ADJD systems</td></tr>
                    <tr><td>Security</td><td>RBAC, Audit Trails, Data Residency</td></tr>
                    <tr><td>Languages</td><td>Arabic & English</td></tr>
                    <tr><td>Support</td><td>Knowledge transfer and post-production support</td></tr>
                  </tbody>
                </table>
              )}
              {activeSummaryTab === 2 && (
                <div className={styles.summaryListContainer}>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>Business & AI Capabilities</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>AI-assisted judicial decision support</li>
                        <li>Legal knowledge retrieval (RAG)</li>
                        <li>Case analysis & recommendations</li>
                        <li>Explainable AI with audit trails</li>
                      </ol>
                    </div>
                  </div>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>Functional Capabilities</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>Case intake & classification</li>
                        <li>Hearing transcription & translation</li>
                        <li>Legal research assistant</li>
                        <li>Document forgery verification</li>
                        <li>API-based integrations</li>
                      </ol>
                    </div>
                  </div>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>In Scope</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>AI Native Judiciary System</li>
                        <li>Legislative Multi-Agent Avatar</li>
                        <li>Virtual Court Clerk</li>
                        <li>Document Forgery Verification</li>
                        <li>API Integration</li>
                      </ol>
                    </div>
                  </div>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>Out of Scope</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>ADJD-side frontend development</li>
                        <li>Future implementation phases beyond Phase 1</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
              {activeSummaryTab === 3 && (
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Architecture</td><td>API-first, Modular Platform</td></tr>
                    <tr><td>AI</td><td>Agentic AI, RAG, LLM Integration</td></tr>
                    <tr><td>Infrastructure</td><td>UAE Sovereign Cloud</td></tr>
                    <tr><td>Integration</td><td>REST APIs, Active Directory, Existing ADJD Systems</td></tr>
                    <tr><td>Security</td><td>RBAC, Audit Logging, Data Residency</td></tr>
                    <tr><td>Data</td><td>Arabic NLP, OCR, Audio & Video Processing</td></tr>
                    <tr><td>Deployment</td><td>CI/CD, Monitoring, High Availability</td></tr>
                  </tbody>
                </table>
              )}
              {activeSummaryTab === 4 && (
                <div className={styles.summaryListContainer}>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>Proposal Deliverables</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>Technical Proposal</li>
                        <li>Solution Architecture</li>
                        <li>Implementation Plan</li>
                        <li>Project Timeline</li>
                      </ol>
                    </div>
                  </div>
                  <div className={styles.summarySubSection}>
                    <h4 className={styles.summarySubTitle}>Project Deliverables</h4>
                    <div className={styles.readOnlyBox}>
                      <ol className={styles.summaryOrderedList}>
                        <li>Working AI Platform</li>
                        <li>REST APIs</li>
                        <li>Documentation</li>
                        <li>MVP</li>
                        <li>Training & Knowledge Transfer</li>
                        <li>Test Reports</li>
                        <li>Operational Support</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
              {activeSummaryTab === 5 && (
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>UAE Sovereign Cloud</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>API-first Architecture</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>Arabic Language Support</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>Human Verification</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>Source Code Ownership</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>Knowledge Transfer</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                    <tr><td>Working Software Delivery</td><td><span className={styles.statusChipGreen}>Mandatory</span></td></tr>
                  </tbody>
                </table>
              )}
              </>
            )}
          </div>
        </section>

        {/* Section 2 - Prompt */}
        <section>
          <label className={styles.sectionLabel}>Add Instruction</label>
          <div className={styles.promptCard}>
            <ResizableTextarea
              id="promptInput"
              className={styles.promptTextarea}
              placeholder="Add context and instructions to guide the AI generation…"
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
          label="Supporting Documents"
          files={supportingDocs}
          setFiles={setSupportingDocs}
        />

        {/* Section 4 - Capabilities Summary */}
        <section>
          <div className={styles.sectionHeaderFlex}>
            <label className={styles.sectionLabel}>Solution Requirements</label>
            <button
              className={styles.addCapabilitiesBtn}
              onClick={openCapabilitiesModal}
            >
              <Plus size={16} /> Add Solution Requirements
            </button>
          </div>
          <div className={styles.capabilitiesTable}>
            <div className={styles.capabilitiesRow}>
              <span className={styles.capabilitiesCellLeft}>Components</span>
              <span className={styles.capabilitiesCellRight}>
                <span className={`${styles.statusChip} ${addComponentsDocs.length > 0 ? styles.statusAdded : styles.statusNotAdded}`}>
                  {addComponentsDocs.length > 0 ? 'Added' : 'Not Added'}
                </span>
              </span>
            </div>
            <div className={styles.capabilitiesRow}>
              <span className={styles.capabilitiesCellLeft}>Capabilities</span>
              <span className={styles.capabilitiesCellRight}>
                <span className={`${styles.statusChip} ${partnerCapabilitiesDocs.length > 0 ? styles.statusAdded : styles.statusNotAdded}`}>
                  {partnerCapabilitiesDocs.length > 0 ? 'Added' : 'Not Added'}
                </span>
              </span>
            </div>
            <div className={styles.capabilitiesRow}>
              <span className={styles.capabilitiesCellLeft}>Proposal Template Format</span>
              <span className={styles.capabilitiesCellRight}>
                <span className={`${styles.statusChip} ${outlineVisible ? styles.statusAdded : styles.statusNotAdded}`}>
                  {outlineVisible ? 'Added' : 'Not Added'}
                </span>
              </span>
            </div>
          </div>
        </section>
        {/* Action Row */}
        <div className={styles.actionRow}>
          <button className={styles.clearBtn} onClick={handleClearAll} aria-label="Clear all fields">
            Clear
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!outlineVisible}
            aria-label="Submit RFP details"
          >
            Submit
          </button>
        </div>

        {showToast && (
          <div className={styles.toast}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toastMessage}
          </div>
        )}
        <CapabilitiesModal
          isOpen={isCapabilitiesModalOpen}
          onCancel={handleCancelCapabilitiesModal}
          onSave={handleSaveCapabilitiesModal}
          activeTab={activeCapabilityTab}
          onTabChange={setActiveCapabilityTab}
          handleExtractionUpload={handleExtractionUpload}
          addComponentsDocs={addComponentsDocs}
          partnerCapabilitiesDocs={partnerCapabilitiesDocs}
          renderExtractedDoc={renderExtractedDoc}
          formatPromptText={formatPromptText}
          setFormatPromptText={setFormatPromptText}
          handleFormatFileAttach={handleFormatFileAttach}
          formatAttachedFile={formatAttachedFile}
          setFormatAttachedFile={setFormatAttachedFile}
          handleGenerateOutline={handleGenerateOutline}
          isGeneratingOutline={isGeneratingOutline}
          formatBtnLabel={formatBtnLabel}
          formatFileError={formatFileError}
          outlineVisible={outlineVisible}
          outlineData={outlineData}
          setOutlineData={setOutlineData}
          pendingExtractions={pendingExtractions}
        />
      </main>
    </div>
  )
}







