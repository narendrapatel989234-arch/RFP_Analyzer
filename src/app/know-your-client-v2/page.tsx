'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LeftNav } from '@/components/LeftNav'
import { VerticalProgressStepper } from '@/components/VerticalProgressStepper'
import { Plus, File, RefreshCw, AlertTriangle, BookOpen, ArrowRight, Upload } from 'lucide-react'
import styles from './page.module.css'
import { UploadZone } from '@/components/UploadZone'
import { ExtractedDocument, PendingExtraction, OutlineNode, DUMMY_OUTLINE_DATA } from '@/components/rfp-components'

export default function KnowYourClientPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [isFromFunctionalConfirmation, setIsFromFunctionalConfirmation] = useState(false)
  const [rfpId, setRfpId] = useState('RFP-001')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('from') === 'functional-confirmation') {
      setActiveStep(3)
      setIsFromFunctionalConfirmation(true)
      const rId = params.get('rfpId')
      if (rId) setRfpId(rId)
    }
  }, [])
  const [uploadedDoc, setUploadedDoc] = useState<{ name: string; size: string } | null>({ name: 'RFP_Document.pdf', size: '2.4 MB' })
  const [promptText, setPromptText] = useState('')
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] = useState(false)
  const [activeCapabilityTab, setActiveCapabilityTab] = useState(0)
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [addComponentsDocs, setAddComponentsDocs] = useState<ExtractedDocument[]>([])
  const [partnerCapabilitiesDocs, setPartnerCapabilitiesDocs] = useState<ExtractedDocument[]>([])
  const [pendingExtractions, setPendingExtractions] = useState<PendingExtraction[]>([])
  const [editingCell, setEditingCell] = useState<{ docId: string, rowId: string, field: 'name' | 'description' | 'docDescription' } | null>(null)
  const [dummySupportingDocs, setDummySupportingDocs] = useState(['RFP_Document.pdf', 'Compliance.pdf', 'Main_Features.pdf'])
  const [activeSummaryTab, setActiveSummaryTab] = useState(0)
  const [activeSummaryTab2, setActiveSummaryTab2] = useState(0)
  const supportingDocsInputRef = useRef<HTMLInputElement>(null)
  const [isSummaryRefreshing, setIsSummaryRefreshing] = useState(false)
  const [documentsChanged, setDocumentsChanged] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<{name: string, size: string} | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = scrollTop / (scrollHeight - clientHeight);
    let page = 1;
    if (progress > 0.7) page = 3;
    else if (progress > 0.25) page = 2;
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

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
    <div className={styles.layout}>
      <LeftNav />

      <main className={styles.mainContent}>
        <div style={{ marginBottom: '16px', flexShrink: 0 }}>
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
        </div>
        <div className={styles.contentMaxWidth}>
          <aside className={styles.stepperSidebar}>
            <VerticalProgressStepper activeStep={1} />
          </aside>

          <div className={styles.rightContent}>
            <div>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  backgroundColor: 'var(--colors-neutral-900)',
                  border: '1px solid var(--Background-Plain-400)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--colors-neutral-0)',
                }}
              >
                <BookOpen size={20} strokeWidth={2.5} />
              </div>
              Know Your Client
            </h1>
            <p className={styles.pageSubText}>Add your RFP, reference documents, and team inputs so AI can generate a tailored proposal.</p>
            <hr className={styles.pageDivider} />
          </div>
        </div>



        {/* Section 1.5 - RFP Documents */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <label className={styles.sectionLabel} style={{ marginBottom: 0 }}>RFP Documents</label>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              multiple
              ref={supportingDocsInputRef}
              style={{ display: 'none' }}
              onChange={handleAddSupportingDocs}
            />
          </div>

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
              <Upload size={16} strokeWidth={2} />
            </div>
            <p className={styles.uploadText}>Drop your RFP here or <span className={styles.lavenderText}>Browse</span></p>
            <p className={styles.uploadHint}>Format: PDF, DOCX — Max file size: 25 MB</p>
          </div>

          {dummySupportingDocs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {dummySupportingDocs.map((doc, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.fileCard} ${isFromFunctionalConfirmation ? styles.clickableCardHover : ''}`}
                  onClick={() => isFromFunctionalConfirmation && setPreviewDoc({ name: doc, size: '1.4 MB' })}
                >
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
                    {!isFromFunctionalConfirmation && (
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 1.8 - RFP Insights */}
        <section style={{ marginTop: 'var(--space-8)' }}>
          <div className={styles.summaryHeader}>
            <label className={styles.sectionLabel} style={{ marginBottom: 'var(--space-2)' }}>RFP Insights</label>
          </div>

          
          <div className={styles.summaryTabsHeader}>
            {['Executive Summary', 'Customer Expectations', 'Capabilities Requested', 'Technical Requirements', 'Deliverables', 'Compliance Requirements', 'Risks'].map((tabName, idx) => (
              <button
                key={idx}
                className={`${styles.summaryTabBtn} ${activeSummaryTab2 === idx ? styles.summaryTabActive : ''}`}
                onClick={() => setActiveSummaryTab2(idx)}
              >
                {tabName}
              </button>
            ))}
          </div>
          <div className={styles.summaryContent} style={{ position: 'relative', height: '400px', overflowY: (documentsChanged && !isFromFunctionalConfirmation && !isSummaryRefreshing) ? 'hidden' : 'auto' }}>
            {documentsChanged && !isFromFunctionalConfirmation && !isSummaryRefreshing ? (
              <div className={styles.insightsBlurOverlay}>
                <div className={styles.insightsFakeContent}>
                  <div className={styles.fakeLine} style={{ width: '80%', height: '24px', marginBottom: '16px' }} />
                  <div className={styles.fakeLine} style={{ width: '100%', height: '16px', marginBottom: '12px' }} />
                  <div className={styles.fakeLine} style={{ width: '90%', height: '16px', marginBottom: '12px' }} />
                  <div className={styles.fakeLine} style={{ width: '95%', height: '16px', marginBottom: '24px' }} />
                  <div className={styles.fakeLine} style={{ width: '60%', height: '20px', marginBottom: '16px' }} />
                  <div className={styles.fakeLine} style={{ width: '100%', height: '16px', marginBottom: '12px' }} />
                  <div className={styles.fakeLine} style={{ width: '85%', height: '16px', marginBottom: '12px' }} />
                </div>
                <div className={styles.insightsCardWrapper}>
                  <div className={styles.insightsBlurCard}>
                    <div className={styles.insightsBlurIcon}>
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className={styles.insightsBlurTitle}>Documents have changed — refresh to see the latest insights</h3>
                    <button
                      className={styles.insightsBlurBtn}
                      onClick={handleRefreshSummary}
                      disabled={isSummaryRefreshing}
                    >
                      <RefreshCw size={16} className={isSummaryRefreshing ? styles.spinning : ''} />
                      {isSummaryRefreshing ? 'Refreshing...' : 'Refresh Summary'}
                    </button>
                  </div>
                </div>
              </div>
            ) : isSummaryRefreshing ? (
                  <div className={styles.summaryLoading}>
                    <div className={styles.skeletonRow} style={{ width: '60%' }} />
                    <div className={styles.skeletonRow} style={{ width: '80%' }} />
                    <div className={styles.skeletonRow} style={{ width: '50%' }} />
                  </div>
                ) : (
                  <>
                {activeSummaryTab2 === 0 && (
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
                {activeSummaryTab2 === 1 && (
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
                {activeSummaryTab2 === 2 && (
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
                {activeSummaryTab2 === 3 && (
                  <div className={styles.summaryListContainer}>
                    <div className={styles.summarySubSection}>
                      <h4 className={styles.summarySubTitle}>Technical Requirements</h4>
                      <div className={styles.readOnlyBox}>
                        <ol className={styles.summaryOrderedList}>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Architecture:</strong> API-first, Modular Platform</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>AI:</strong> Agentic AI, RAG, LLM Integration</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Infrastructure:</strong> UAE Sovereign Cloud</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Integration:</strong> REST APIs, Active Directory, Existing ADJD Systems</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Security:</strong> RBAC, Audit Logging, Data Residency</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Data:</strong> Arabic NLP, OCR, Audio & Video Processing</li>
                          <li><strong style={{ color: 'var(--text-primary)' }}>Deployment:</strong> CI/CD, Monitoring, High Availability</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
                {activeSummaryTab2 === 4 && (
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
                {activeSummaryTab2 === 5 && (
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
                {activeSummaryTab2 === 6 && (
                  <div className={styles.summaryListContainer}>
                    <div className={styles.summarySubSection}>
                      <h4 className={styles.summarySubTitle}>Risks</h4>
                      <div className={styles.readOnlyBox}>
                        <ul className={styles.summaryOrderedList}>
                          <li>Aggressive timeline (14 months) for full AI rollout</li>
                          <li>Strict data residency requirements in UAE Sovereign Cloud</li>
                          <li>Integration complexity with legacy ADJD on-premise systems</li>
                          <li>Potential translation gaps for nuanced Arabic legal terminology</li>
                          <li>High dependency on ADJD providing accurate historical case data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>
        </section>

            <div className={styles.actionRow} style={{ justifyContent: 'flex-start', marginTop: 'var(--space-4)' }}>
              <button
                className={styles.outlineNextBtn}
                onClick={() => router.push('/solution-strategy-v2')}
                aria-label="Next step"
                disabled={documentsChanged}
              >
                Next
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Document Viewer */}
      {previewDoc && (
        <div className={styles.modalOverlay} onClick={() => setPreviewDoc(null)}>
          <div className={styles.modalPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{previewDoc.name}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setPreviewDoc(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.modalViewerBody} onScroll={handleScroll}>
              <div className={styles.modalPage}>
                <div className={styles.drawerRichText}>
                  <h2>Request for Proposal — Cloud Infrastructure Modernisation</h2>
                  
                  <h3>1. Background</h3>
                  <p>The Department of Public Works is seeking proposals from qualified vendors to modernise our legacy infrastructure. Our current on-premise data centres are reaching end-of-life, and we aim to migrate core services to a scalable, highly available cloud-native environment to improve citizen services.</p>
                </div>
              </div>
              <div className={styles.modalPage}>
                <div className={styles.drawerRichText}>
                  <h3>2. Scope of Work</h3>
                  <p>The selected vendor will be responsible for end-to-end migration, including but not limited to:</p>
                  <ul>
                    <li>Comprehensive audit of existing physical servers and virtual machines.</li>
                    <li>Design of a secure, sovereign-capable cloud architecture.</li>
                    <li>Migration of 150+ legacy applications with minimal downtime.</li>
                    <li>Implementation of Zero-Trust security and federated IAM.</li>
                  </ul>
                  
                  <h3>3. Technical Requirements</h3>
                  <p>All proposed solutions must adhere strictly to the following technical standards:</p>
                  <ul>
                    <li><strong>Compute:</strong> Kubernetes-based orchestration with automated scaling.</li>
                    <li><strong>Storage:</strong> Multi-region object storage with 99.999% durability and automated tiering.</li>
                    <li><strong>Networking:</strong> Dedicated private connections to government networks with deep packet inspection.</li>
                    <li><strong>Compliance:</strong> Must meet Federal Risk and Authorization Management Program (FedRAMP) High baseline requirements.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.modalPage}>
                <div className={styles.drawerRichText}>
                  <h3>4. Evaluation Criteria</h3>
                  <p>Proposals will be evaluated based on the following weighted criteria:</p>
                  <ul>
                    <li>Technical Approach and Architecture (40%)</li>
                    <li>Vendor Experience and Past Performance (30%)</li>
                    <li>Cost and Commercials (20%)</li>
                    <li>Security and Compliance Posture (10%)</li>
                  </ul>

                  <h3>5. Submission Guidelines</h3>
                  <p>All proposals must be submitted electronically via the procurement portal no later than August 15, 2026 at 5:00 PM EST. Late submissions will not be considered under any circumstances. Please ensure all documents are provided in PDF format and do not exceed 50MB in total size.</p>
                </div>
              </div>
            </div>
            <div className={styles.modalFooterIndicator}>
              Page {currentPage} of 3
            </div>
          </div>
        </div>
      )}
    </div>
  )
}







