'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LeftNav } from '@/components/LeftNav'
import { VerticalProgressStepper } from '@/components/VerticalProgressStepper'
import { Plus, ClipboardList, ArrowRight } from 'lucide-react'
import { CapabilitiesModalV2 } from '../../components/CapabilitiesModalV2'
import modalStyles from '../../components/CapabilitiesModalV2.module.css'
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
} from '@/components/rfp-components-v2'
import styles from './page.module.css'

function ReadOnlyOutlineTree({ data }: { data: OutlineNode[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(collapsedNodes)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCollapsedNodes(next)
  }

  const renderNode = (node: OutlineNode, isChild = false) => {
    const hasChildren = node.children && node.children.length > 0
    const isNodeCollapsed = collapsedNodes.has(node.id)

    return (
      <div key={node.id} className={`${isChild ? styles.outlineChild : styles.outlineParent}`}>
        <div className={styles.outlineNodeRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {hasChildren && (
              <div onClick={(e) => toggleNode(node.id, e)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ transform: isNodeCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}
            <span className={styles.outlinePrefix}>{node.prefix}</span>
            <span className={styles.outlineLabel}>{node.label}</span>
          </div>
        </div>
        {hasChildren && !isNodeCollapsed && (
          <div className={styles.outlineList} style={{ marginTop: 'var(--space-2)' }}>
            {node.children!.map(child => renderNode(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.outlineContainer}>
      <div className={styles.outlineHeader} onClick={() => setIsCollapsed(!isCollapsed)}>
        <svg
          className={`${styles.outlineChevron} ${!isCollapsed ? styles.outlineChevronOpen : ''}`}
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <h3 className={styles.outlineHeaderTitle}>Parsed Outline (39 sections)</h3>
      </div>

      {!isCollapsed && (
        <div className={styles.outlineList}>
          {data.map(node => renderNode(node, false))}
        </div>
      )}
    </div>
  )
}

const renderExtractedCard = (
  title: string,
  data: { file: { name: string; size: string }; description: string; tableData: { id: string; name: string; description: string }[] },
  isExpanded: boolean,
  toggleExpanded: () => void
) => (
  <div className={styles.extractedCard}>
    <div className={styles.extractedCardHeader} onClick={toggleExpanded} style={{ cursor: 'pointer' }}>
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
        <span className={styles.extractedCardName}>{data.file.name}</span>
        <span className={styles.extractedCardSize}>{data.file.size}</span>
      </div>
      <div className={"" + styles.extractedCardChevron + (isExpanded ? " " + styles.extractedCardChevronOpen : "")}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
    {isExpanded && (
      <div className={styles.extractedCardBody}>
        <div className={styles.extractedCardSection}>
          <h4 className={styles.extractedCardDescTitle}>Description</h4>
          <p className={styles.extractedCardDescText}>{data.description}</p>
        </div>
        <div className={styles.extractedCardSection}>
          <div className={styles.extractedCardTableTitleRow}>
            <h4 className={styles.extractedCardTableTitle}>{title}</h4>
          </div>
          <table className={styles.extractedCardTable}>
            <thead>
              <tr>
                <th className={styles.extractedCardTh}>Name</th>
                <th className={styles.extractedCardTh}>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.tableData.map((row) => (
                <tr key={row.id}>
                  <td className={styles.extractedCardTd}>{row.name}</td>
                  <td className={styles.extractedCardTd}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)

export default function RFPDetailsPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(2)
  const [isFromFunctionalConfirmation, setIsFromFunctionalConfirmation] = useState(false)
  const [rfpId, setRfpId] = useState('RFP-001')
  const [isProposalReviewStage, setIsProposalReviewStage] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('from') === 'functional-confirmation') {
      setActiveStep(3)
      setIsFromFunctionalConfirmation(true)
      const rId = params.get('rfpId')
      if (rId) setRfpId(rId)
      
      setPromptText("Focus on AI-driven judicial workflows, Arabic NLP capabilities, and compliance with UAE data residency laws. Emphasize prior experience with government-sector deployments and highlight integration capabilities with existing ADJD systems.")
      
      // Prefill supporting docs
      const f1 = new File([new ArrayBuffer(1024 * 1200)], "Compliance.pdf", { type: "application/pdf" })
      const f2 = new File([new ArrayBuffer(1024 * 3400)], "Main_Features.pdf", { type: "application/pdf" })
      setSupportingDocs([f1, f2])
    } else if (params.get('mode') === 'review') {
      setIsProposalReviewStage(true)
    }
  }, [])
  const [promptText, setPromptText] = useState('')
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  
  const [componentsExpanded, setComponentsExpanded] = useState(true)
  const [partnerExpanded, setPartnerExpanded] = useState(true)

  const componentsData = {
    file: { name: 'Solution_Architecture_Components.docx', size: '1.1 MB' },
    description: "Cortes is Inception42's unified platform for building, running, and scaling AI agents across the G42 product portfolio. It provides a common, secure, sovereign-capable foundation for agent infrastructure.",
    tableData: [
      { id: '1', name: 'Infrastructure Orchestration', description: 'Kubernetes-based deployment and runtime management with RBAC and IAM controls' },
      { id: '2', name: 'Enterprise RAG Framework', description: 'Hybrid retrieval system combining vector, keyword, and graph search with secure document access' },
      { id: '3', name: 'Agent Orchestration', description: 'Factory and runtime for composable agents enabling agent creation, execution, and pub/sub coordination' },
      { id: '4', name: 'Identity and Access Management', description: 'Zero-trust security architecture with federated identity support including Entra and Keycloak' },
      { id: '5', name: 'Data Foundation and Lakehouse', description: 'Scalable multi-tenant data storage with Delta tables, ACID transactions, and schema enforcement' }
    ]
  }

  const partnerData = {
    file: { name: 'PartnerX_Credentials.pdf', size: '2.0 MB' },
    description: "PartnerX is a certified cloud and AI systems integrator with deep expertise across enterprise transformation programmes in the public and private sector.",
    tableData: [
      { id: '1', name: 'Cloud Migration', description: 'End-to-end cloud transformation services including lift-and-shift and cloud-native re-architecture' },
      { id: '2', name: 'DevOps Transformation', description: 'CI/CD pipeline automation, Infrastructure as Code, and SRE best practices implementation' },
      { id: '3', name: 'AI Integration', description: 'Embedding machine learning models and generative AI capabilities into legacy business applications' },
      { id: '4', name: 'Data Engineering', description: 'Building scalable data pipelines, data warehouses, and modern analytics platforms' },
      { id: '5', name: 'Security & Compliance', description: 'Implementation of enterprise security frameworks, compliance auditing, and continuous monitoring' }
    ]
  }
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] = useState(false)
  const [activeCapabilityTab, setActiveCapabilityTab] = useState(0)
  const [addComponentsDocs, setAddComponentsDocs] = useState<ExtractedDocument[]>([])
  const [partnerCapabilitiesDocs, setPartnerCapabilitiesDocs] = useState<ExtractedDocument[]>([])
  const [pendingExtractions, setPendingExtractions] = useState<PendingExtraction[]>([])
  const [editingCell, setEditingCell] = useState<{ docId: string, rowId: string, field: 'name' | 'description' | 'docDescription' } | null>(null)
  const [isProposalTemplateSaved, setIsProposalTemplateSaved] = useState(false)

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
    if (activeCapabilityTab === 2) {
      setIsProposalTemplateSaved(true)
    }
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
      promptText,
      supportingDocs,
      addComponentsDocs,
      partnerCapabilitiesDocs,
      formatPromptText,
      formatAttachedFile,
      outlineData
    })

    triggerToast("RFP submitted successfully!")
    
    setTimeout(() => {
      router.push('/dashboard-v2')
    }, 1500)
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
          <button className={styles.backButton} onClick={() => router.push('/dashboard-v2')}>
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
            <VerticalProgressStepper activeStep={2} isProposalReviewStage={isProposalReviewStage} />
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
                <ClipboardList size={20} strokeWidth={2.5} />
              </div>
              Solution Strategy
            </h1>
            <p className={styles.pageSubText}>Add your RFP, reference documents, and team inputs so AI can generate a tailored proposal.</p>
            <hr className={styles.pageDivider} />
          </div>
        </div>

        {/* Section 2 - Prompt */}
        <section>
          <label className={styles.sectionLabel}>Add Instruction</label>
          <div className={styles.promptCard}>
            <ResizableTextarea
              id="promptInput"
              className={`${styles.promptTextarea} ${isFromFunctionalConfirmation ? styles.readOnlyTextarea : ''}`}
              placeholder="Add context and instructions to guide the AI generation…"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              minHeight={120}
              readOnly={isFromFunctionalConfirmation}
              renderToolbar={(handle) => (
                <div className={styles.toolbarRowPrompt}>
                  <div className={styles.toolbarRight}>
                    {!isFromFunctionalConfirmation && (
                      <>
                        <div className={styles.charCount}>{promptText.length} / 2000</div>
                        {handle}
                      </>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </section>

        {/* Section 3 - Supporting Documents */}
        <MultiUploadZone
          label="Supporting Documents"
          files={supportingDocs}
          setFiles={setSupportingDocs}
          readOnly={isFromFunctionalConfirmation}
        />

        {/* Section 4 - Capabilities Summary */}
        {isFromFunctionalConfirmation ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <section>
              <label className={styles.sectionLabel}>Components</label>
              {renderExtractedCard('Component List', componentsData, componentsExpanded, () => setComponentsExpanded(!componentsExpanded))}
            </section>
            
            <section>
              <label className={styles.sectionLabel}>Partner Capabilities</label>
              {renderExtractedCard('Capability List', partnerData, partnerExpanded, () => setPartnerExpanded(!partnerExpanded))}
            </section>
            
            <section>
              <label className={styles.sectionLabel}>Proposal Template Format</label>
              <div className={styles.card} style={{ backgroundColor: 'var(--bg-surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <ReadOnlyOutlineTree data={DUMMY_OUTLINE_DATA} />
              </div>
            </section>
          </div>
        ) : (
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
        )}
        {/* Action Row */}
        <div className={styles.actionRow} style={{ justifyContent: 'flex-start' }}>
          {!isFromFunctionalConfirmation && (
            <button className={styles.clearBtn} onClick={handleClearAll} aria-label="Clear all fields">
              Clear
            </button>
          )}
          {isFromFunctionalConfirmation ? (
            <button
              className={styles.outlineNextBtn}
              onClick={() => router.push(`/rfp/${rfpId}`)}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <div className={`${styles.tooltipWrapper} ${!isProposalTemplateSaved ? styles.disabledWrapper : ''}`}>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!isProposalTemplateSaved}
                aria-label="Submit RFP details"
              >
                Submit
              </button>
              {!isProposalTemplateSaved && (
                <div className={styles.tooltip}>Please generate and save the Proposal Template Format to submit</div>
              )}
            </div>
          )}
        </div>

        {showToast && (
          <div className={styles.toast}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toastMessage}
          </div>
        )}
        <CapabilitiesModalV2
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
          </div>
        </div>
      </main>
    </div>
  )
}







