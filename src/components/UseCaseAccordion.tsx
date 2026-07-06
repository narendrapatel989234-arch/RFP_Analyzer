'use client'

import React, { useState, useEffect } from 'react'
import styles from './UseCaseAccordion.module.css'
import { ArchitectureDiagram } from './ArchitectureDiagram'

export interface UseCaseModule {
  id: string
  identifier: string
  title: string
  description: string
  includedInScope?: string[]
  outOfScope?: string[]
}

export interface UseCase {
  id: string
  number: string
  title: string
  subtext: string
  status: string
  modulesCount: number
  actionStatus?: 'Approved' | 'Modified' | null
  // Stage 2 fields
  problemUnderstanding: string[]
  technoFunctionalScope: UseCaseModule[]
  assumptions: string[]
  // Stage 3 fields
  architectureDiagram?: string
  architectureSummary?: string[]
  techstackUsed?: string[]
  dataflow?: string
  security?: string[]
}

const defaultUseCases: UseCase[] = [
  {
    id: 'uc1',
    number: '01',
    title: 'AI Legislative Avatar',
    subtext: 'UC1 — Conversational AI assistant for legal queries with avatar interface',
    status: 'Awaiting review',
    modulesCount: 5,
    actionStatus: null,
    problemUnderstanding: [
      'Citizens cannot locate the right law or article without legal expertise — they give up or pay lawyers for basic queries.',
      'Legal texts in Arabic are dense; non-native speakers face a double barrier of language and jargon.',
      'Call centres are overwhelmed with repetitive questions that could be answered by a well-governed AI.',
      'There is no trusted, always-on channel that is authoritative, bilingual, and auditable.'
    ],
    technoFunctionalScope: [
      {
        id: 'm1',
        identifier: 'M1',
        title: 'Conversational AI Engine',
        description: 'The core reasoning layer that understands a citizen\'s question, retrieves the right legal article, and formulates a plain-language answer — in Arabic or English.',
        includedInScope: [
          'Natural language understanding (NLU) for legal intent detection',
          'Retrieval-Augmented Generation (RAG) over the approved legislative corpus',
          'Bilingual response generation — Arabic (MSA) and English',
          'Confidence scoring on every answer; low-confidence answers are flagged',
          'Multi-turn conversation memory within a session',
          'Structured answer format: article reference → plain summary → disclaimer'
        ],
        outOfScope: [
          'Interpretation or extrapolation beyond the approved corpus',
          'Generating legal opinions, advice, or draft contracts',
          'Training or fine-tuning on data outside the approved corpus'
        ]
      },
      {
        id: 'm2',
        identifier: 'M2',
        title: 'Digital Avatar & Voice Interface',
        description: 'Visual avatar component integrating text-to-speech for an immersive, accessible user experience.',
        includedInScope: [
          'Photorealistic 3D avatar rendering',
          'Lip-sync and facial expression matching',
          'Voice synthesis in both local Arabic dialects and MSA'
        ],
        outOfScope: [
          'Custom avatar creation from scratch (using off-the-shelf instead)',
          'Real-time video calling integration'
        ]
      },
      {
        id: 'm3',
        identifier: 'M3',
        title: 'Legal Corpus Management',
        description: 'Backend system to ingest, index, and update the approved ADJD legal corpus.',
        includedInScope: [
          'Vector database integration for legal documents',
          'Automated versioning and change tracking',
          'Approval workflow for uploading new articles'
        ],
        outOfScope: [
          'Manual data entry of physical documents',
          'OCR for handwritten historical records'
        ]
      },
      {
        id: 'm4',
        identifier: 'M4',
        title: 'Auditability & Compliance',
        description: 'Logging and tracking module ensuring every AI response links back to the authoritative source document.',
        includedInScope: [
          'Immutable audit trails for every query',
          'Citation mapping for AI-generated answers',
          'Dashboard for compliance officers'
        ],
        outOfScope: [
          'Financial auditing features',
          'Third-party external regulator portals'
        ]
      },
      {
        id: 'm5',
        identifier: 'M5',
        title: 'IAM & API Integration',
        description: 'Secure authentication endpoints and internal API bridges for legacy systems.',
        includedInScope: [
          'OAuth 2.0 and SAML SSO integration',
          'Role-based access control (RBAC) mapping',
          'Rate limiting and security policies'
        ],
        outOfScope: [
          'Migration of existing ADJD user accounts',
          'Providing hardware authentication tokens'
        ]
      }
    ],
    assumptions: [
      'ADJD supplies the approved legal corpus in a structured digital format (not scanned images).',
      'An avatar partner (D-ID, Synthesia, or equivalent) is selected and contracted separately; we handle integration only.',
      'ADJD\'s existing IAM exposes OAuth 2.0 or SAML endpoints we can connect to.',
      'A dedicated ADJD corpus administrator is available to approve and upload new legislation versions.',
      'ADJD defines the list of approved legislation in scope before development begins; changes go through change control.'
    ],
    architectureDiagram: 'placeholder',
    architectureSummary: [
      'The architecture follows a microservices pattern deployed on scalable cloud infrastructure. The Conversational AI Engine acts as the orchestrator, integrating with a robust Vector Database for Retrieval-Augmented Generation (RAG).',
      'The Frontend is a lightweight React/Next.js application communicating via secure APIs to the backend, rendering the Digital Avatar in real-time through WebRTC and WebSockets.',
      'All legal documents are securely ingested through the ETL pipeline, processed, and indexed in the Vector Database, ensuring strict separation from public models.'
    ],
    techstackUsed: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Python', 'LangChain', 'Pinecone', 'Docker', 'AWS ECS', 'Terraform'],
    dataflow: 'User initiates a query via the frontend avatar interface. The query is sent securely to the API Gateway, which routes it to the AI Engine. The AI Engine retrieves context from the Vector Database, synthesizes an answer, and streams the response back to the Avatar service, which generates the lip-sync and audio payload in real-time.',
    security: [
      'End-to-end encryption for all data in transit (TLS 1.3) and at rest (AES-256).',
      'Role-based access control (RBAC) integrated with the existing ADJD IAM.',
      'Immutable audit logging of every query and AI response.',
      'No PII is sent to external LLMs; strictly uses isolated, privately hosted instances.'
    ]
  },
  {
    id: 'uc2',
    number: '02',
    title: 'Smart Case Filing Portal',
    subtext: 'UC2 — AI-guided self-service portal for citizens to file legal cases without a lawyer',
    status: 'Awaiting review',
    modulesCount: 4,
    actionStatus: null,
    problemUnderstanding: [
      'Citizens struggle to understand the complex forms and prerequisites required to formally file a case.',
      'High rejection rate of initial filings due to missing documents, costing the court administrative time.',
      'Language barriers prevent expatriates from properly submitting claims in Arabic.',
      'Lack of transparency around the expected timeline and fees for different case types.'
    ],
    technoFunctionalScope: [
      {
        id: 'uc2-m1',
        identifier: 'M1',
        title: 'Intelligent Intake Triage',
        description: 'Conversational form-filling wizard that uses NLP to understand the citizen\'s grievance and dynamically generates the correct case application.',
        includedInScope: [
          'Dynamic question branching based on user answers',
          'Automated categorization of case type (e.g., labor, civil, family)',
          'Real-time translation of user input into formal Arabic legal text'
        ],
        outOfScope: [
          'Handling criminal cases',
          'Providing legally binding predictions on case outcomes'
        ]
      },
      {
        id: 'uc2-m2',
        identifier: 'M2',
        title: 'Automated Document Verification',
        description: 'OCR and Vision AI module to scan uploaded evidence (IDs, contracts) and verify completeness before submission.',
        includedInScope: [
          'Emirates ID extraction and validation',
          'Detection of missing signatures or required stamps',
          'Quality assessment of scanned documents (blur, glare)'
        ],
        outOfScope: [
          'Deepfake detection for video evidence',
          'Handwriting analysis for forgery detection'
        ]
      },
      {
        id: 'uc2-m3',
        identifier: 'M3',
        title: 'Fee Calculation Engine',
        description: 'Rules-based engine that calculates exact court fees based on claim amount and case type, integrating with payment gateways.',
        includedInScope: [
          'Dynamic fee calculation rules engine',
          'Integration with Abu Dhabi Pay gateway',
          'Automated invoice generation'
        ],
        outOfScope: [
          'Handling crypto or international wire transfers',
          'Post-judgment financial settlements'
        ]
      },
      {
        id: 'uc2-m4',
        identifier: 'M4',
        title: 'Case Tracking Dashboard',
        description: 'Citizen-facing portal to track the real-time status of their filed cases, upcoming hearings, and required actions.',
        includedInScope: [
          'Push notifications via SMS and email',
          'Timeline view of case lifecycle',
          'Secure document download area'
        ],
        outOfScope: [
          'Direct messaging with the assigned judge'
        ]
      }
    ],
    assumptions: [
      'ADJD provides a comprehensive matrix of all case types and their required prerequisites.',
      'Integration with Abu Dhabi Pay is supported via standard REST APIs.',
      'Citizens have a valid UAE Pass for SSO authentication.'
    ],
    architectureDiagram: 'placeholder',
    architectureSummary: [
      'A serverless event-driven architecture processes incoming citizen applications asynchronously. The NLP Engine acts as a triage layer, parsing intent before hitting the core transactional database.',
      'Document processing is handled by dedicated ML worker queues to perform OCR and validation without blocking the main user thread.',
      'The payment gateway is isolated via a dedicated API microservice for compliance and retry-logic robustness.'
    ],
    techstackUsed: ['React', 'Next.js', 'TypeScript', 'AWS Lambda', 'DynamoDB', 'AWS Textract', 'S3', 'API Gateway'],
    dataflow: 'Citizen uploads documents through the portal. The payload is stored in S3, triggering an event to the ML worker which performs OCR. Results are saved to DynamoDB and the status updates the frontend via WebSockets. Upon fee calculation, the payment microservice is invoked.',
    security: [
      'Data sovereignty compliance with data stored entirely in UAE data centers.',
      'Strict API rate limiting and WAF rules to prevent DDoS on public forms.',
      'Automatic PII redaction from logs during OCR processing.'
    ]
  },
  {
    id: 'uc3',
    number: '03',
    title: 'Judicial Analytics Dashboard',
    subtext: 'UC3 — Real-time insight platform for ADJD leadership to monitor court performance and backlog',
    status: 'Awaiting review',
    modulesCount: 3,
    actionStatus: null,
    problemUnderstanding: [
      'Court administrators lack real-time visibility into case backlogs across different jurisdictions.',
      'Identifying bottlenecks in the judicial process requires manual data extraction and reporting.',
      'Resource allocation (judges, clerks) is currently reactive rather than predictive.',
      'No unified view of operational metrics across the various specialized courts.'
    ],
    technoFunctionalScope: [
      {
        id: 'uc3-m1',
        identifier: 'M1',
        title: 'Data Ingestion & Aggregation Pipeline',
        description: 'ETL pipelines that securely extract case metadata from legacy court management systems into a central data warehouse.',
        includedInScope: [
          'Nightly batch processing of legacy SQL databases',
          'Data cleansing and normalization of case statuses',
          'Anonymization of PII for high-level reporting'
        ],
        outOfScope: [
          'Real-time streaming (sub-second latency) of case updates',
          'Migration of legacy data to a new transactional system'
        ]
      },
      {
        id: 'uc3-m2',
        identifier: 'M2',
        title: 'Predictive Backlog Analytics',
        description: 'Machine learning models that forecast future case volumes and identify potential delays before they become critical.',
        includedInScope: [
          'Time-series forecasting for seasonal case influxes',
          'Anomaly detection for abnormally long case durations',
          'Scenario modeling for resource allocation'
        ],
        outOfScope: [
          'Predicting individual judge rulings or verdicts',
          'Automated reassignment of cases without human approval'
        ]
      },
      {
        id: 'uc3-m3',
        identifier: 'M3',
        title: 'Executive Visualization Portal',
        description: 'Interactive Tableau/PowerBI embedded dashboards customized for Chief Justices and Court Managers.',
        includedInScope: [
          'Role-based access control (RBAC) for dashboards',
          'Drill-down capabilities from Emirate level to specific courts',
          'Automated generation of monthly PDF performance reports'
        ],
        outOfScope: [
          'Publicly accessible transparency portals (internal only)',
          'Ad-hoc SQL query builder for non-technical users'
        ]
      }
    ],
    assumptions: [
      'ADJD data engineering team will provide read-only access to legacy database replicas.',
      'Data sovereignty rules allow for aggregated, anonymized analytics to be processed in the approved local cloud.',
      'Leadership agrees on standard KPIs before visualization development begins.'
    ],
    architectureDiagram: 'placeholder',
    architectureSummary: [
      'A modern data stack utilizing a cloud data warehouse as the single source of truth. ETL pipelines run nightly using Apache Airflow to orchestrate data ingestion from legacy on-premise systems.',
      'The Predictive Engine is built on Spark, training models on historical data and writing forecasting results back to the warehouse.',
      'The Executive Portal is an embedded analytics layer that queries the warehouse using highly optimized materialized views for sub-second dashboard rendering.'
    ],
    techstackUsed: ['Snowflake', 'dbt', 'Apache Airflow', 'PySpark', 'PowerBI Embedded', 'React', 'Node.js', 'Kafka'],
    dataflow: 'Legacy systems push daily deltas via secure Kafka topics. Airflow orchestrates the dbt transformations into Snowflake. PySpark models read from Snowflake, generate backlog predictions, and write back. The embedded PowerBI dashboard queries the aggregated Snowflake views for the end-user.',
    security: [
      'Data anonymization applied at the ingestion layer before entering the data warehouse.',
      'Row-level security (RLS) ensuring Chief Justices only see data pertaining to their jurisdiction.',
      'MFA required for all executive access to the dashboard.'
    ]
  }
]

function ModuleRow({ mod, triggerToast }: { mod: UseCaseModule, triggerToast: (msg: string) => void }) {
  const [localMod, setLocalMod] = useState(mod)
  const [expanded, setExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Edit State
  const [editTitle, setEditTitle] = useState(localMod.title)
  const [editDesc, setEditDesc] = useState(localMod.description)
  const [editIncluded, setEditIncluded] = useState(localMod.includedInScope?.join('\n') || '')
  const [editExcluded, setEditExcluded] = useState(localMod.outOfScope?.join('\n') || '')

  // Regen State
  const [regenPrompt, setRegenPrompt] = useState('')

  const handleSaveEdit = () => {
    setLocalMod(prev => ({
      ...prev,
      title: editTitle,
      description: editDesc,
      includedInScope: editIncluded ? editIncluded.split('\n') : [],
      outOfScope: editExcluded ? editExcluded.split('\n') : []
    }))
    setIsEditModalOpen(false)
    triggerToast('Module changes saved successfully!')
  }

  const handleRegenerate = () => {
    setIsRegenerateModalOpen(false)
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
      setLocalMod(prev => ({
        ...prev,
        description: "Updated by AI: " + prev.description
      }))
      setExpanded(true)
      triggerToast('Module regenerated successfully!')
      setRegenPrompt('')
    }, 2000)
  }

  return (
    <div className={`${styles.moduleRowContainer} ${isRegenerating ? styles.moduleRegenerating : ''}`}>
      {isRegenerating && (
        <div className={styles.shimmerOverlay}>
          <div className={styles.shimmerText}>
            <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Regenerating Module...
          </div>
        </div>
      )}
      <div className={styles.moduleRowHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.moduleLeft}>
          <span className={styles.moduleId}>{localMod.identifier}</span>
          <span className={styles.moduleTitle}>{localMod.title}</span>
        </div>
        <div className={styles.moduleRight}>
          <button className={styles.moduleActionBtn} onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Edit
          </button>
          <button className={styles.moduleActionBtn} onClick={(e) => { e.stopPropagation(); setIsRegenerateModalOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Regenerate
          </button>
          <svg className={`${styles.moduleChevron} ${expanded ? styles.chevronOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>
      {expanded && (
        <div className={styles.moduleDetails}>
          <p className={styles.moduleDesc}>{localMod.description}</p>

          {(localMod.includedInScope || localMod.outOfScope) && (
            <div className={styles.scopeGrid}>
              {localMod.includedInScope && (
                <div className={styles.scopeCardIncluded}>
                  <h5 className={styles.scopeTitleIncluded}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    INCLUDED IN SCOPE
                  </h5>
                  <ul className={styles.scopeListIncluded}>
                    {localMod.includedInScope.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {localMod.outOfScope && (
                <div className={styles.scopeCardExcluded}>
                  <h5 className={styles.scopeTitleExcluded}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    OUT OF SCOPE
                  </h5>
                  <ul className={styles.scopeListExcluded}>
                    {localMod.outOfScope.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeaderRow}>
              <h3 className={styles.modalTitle}>Edit - {mod.title}</h3>
              <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Module name</label>
                <input type="text" className={styles.modalInput} value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Module description</label>
                <textarea rows={4} className={styles.modalTextarea} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Included in scope (one item per line)</label>
                <textarea rows={6} className={styles.modalTextarea} value={editIncluded} onChange={e => setEditIncluded(e.target.value)} />
              </div>

              <div className={styles.modalFormGroup}>
                <label className={styles.modalLabel}>Out of scope (one item per line)</label>
                <textarea rows={6} className={styles.modalTextarea} value={editExcluded} onChange={e => setEditExcluded(e.target.value)} />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className={styles.modalRegenerateBtn} onClick={handleSaveEdit}>Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* REGENERATE MODAL */}
      {isRegenerateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeaderRow}>
              <div className={styles.modalHeaderIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              </div>
              <h3 className={styles.modalTitle}>Regenerate — {mod.title}</h3>
            </div>
            <p className={styles.modalDesc}>Describe what to change. The agent will update the Problem Understanding and Techno-functional Scope for this module accordingly.</p>

            <div className={styles.modalFormGroup}>
              <label className={styles.modalLabel}>What should change?</label>
              <textarea
                className={styles.modalTextarea}
                placeholder="e.g. Remove voice interface — text only. Add support for dialectal Arabic. Split corpus management into its own module..."
                value={regenPrompt}
                onChange={e => setRegenPrompt(e.target.value)}
              />
              <div className={styles.promptChips}>
                <button className={styles.promptChipBtn} onClick={() => setRegenPrompt(regenPrompt + ' More Arabic detail ')}>More Arabic detail</button>
                <button className={styles.promptChipBtn} onClick={() => setRegenPrompt(regenPrompt + ' Remove from scope ')}>Remove from scope</button>
                <button className={styles.promptChipBtn} onClick={() => setRegenPrompt(regenPrompt + ' Split module ')}>Split module</button>
                <button className={styles.promptChipBtn} onClick={() => setRegenPrompt(regenPrompt + ' Sharpen exclusions ')}>Sharpen exclusions</button>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setIsRegenerateModalOpen(false)}>Cancel</button>
              <button className={styles.modalRegenerateBtn} onClick={handleRegenerate} disabled={!regenPrompt.trim()}>Regenerate module</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function UseCaseAccordion({ useCases = defaultUseCases, isStage3 = false }: { useCases?: UseCase[], isStage3?: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cases, setCases] = useState<UseCase[]>(useCases)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'usecase' | 'edit-section' | 'regenerate-section' | 'upload-diagram' | 'rename'>('usecase')
  const [renameTitle, setRenameTitle] = useState('')
  const [renameUseCaseLabel, setRenameUseCaseLabel] = useState('')
  const [modifyingId, setModifyingId] = useState<string | null>(null)
  const [modifyingSection, setModifyingSection] = useState<number | null>(null)
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>('')
  const [prompt, setPrompt] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    if (isModalOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const openRenameModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const uc = cases.find((c) => c.id === id)
    if (uc) {
      setRenameTitle(uc.title)
      setRenameUseCaseLabel(uc.subtext.split(' — ')[0] || '')
    }
    setModifyingId(id)
    setModalType('rename')
    setPrompt('')
    setIsModalOpen(true)
  }

  const handleRenameSave = () => {
    if (!modifyingId) return
    setCases((prev) => prev.map((uc) => {
      if (uc.id === modifyingId) {
        const oldPrefix = uc.subtext.split(' — ')[0] || ''
        const oldSuffix = uc.subtext.substring(oldPrefix.length)
        return {
          ...uc,
          title: renameTitle,
          subtext: `${renameUseCaseLabel}${oldSuffix}`
        }
      }
      return uc
    }))
    setIsModalOpen(false)
    triggerToast('Rename saved successfully!')
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const openModifyModal = (e: React.MouseEvent, id: string, type: 'usecase' | 'edit-section' | 'regenerate-section' | 'upload-diagram' = 'usecase', section: number | null = null) => {
    e.stopPropagation()

    if (type === 'edit-section' && section !== null) {
      if ((!isStage3 && (section === 1 || section === 3)) || (isStage3 && (section === 2 || section === 3 || section === 4 || section === 5))) {
        setEditingSectionId(`${id}-${section}`)
        const targetUc = cases.find(uc => uc.id === id)
        if (targetUc) {
          if (!isStage3) {
            if (section === 1) setEditContent(targetUc.problemUnderstanding.join('\n\n'))
            if (section === 3) setEditContent(targetUc.assumptions.join('\n\n'))
          } else {
            if (section === 2) setEditContent(targetUc.architectureSummary?.join('\n\n') || '')
            if (section === 3) setEditContent(targetUc.techstackUsed?.join('\n') || '')
            if (section === 4) setEditContent(targetUc.dataflow || '')
            if (section === 5) setEditContent(targetUc.security?.join('\n\n') || '')
          }
        }
        return
      }
    }

    setModifyingId(id)
    setModalType(type)
    setModifyingSection(section)
    setPrompt('')
    setIsModalOpen(true)
  }

  const handleSaveInlineEdit = () => {
    if (!editingSectionId) return
    const [id, secStr] = editingSectionId.split('-')
    const section = parseInt(secStr, 10)
    
    setCases(prev => prev.map(uc => {
      if (uc.id === id) {
        if (!isStage3) {
          if (section === 1) return { ...uc, problemUnderstanding: editContent.split('\n\n').filter(Boolean) }
          if (section === 3) return { ...uc, assumptions: editContent.split('\n\n').filter(Boolean) }
        } else {
          if (section === 2) return { ...uc, architectureSummary: editContent.split('\n\n').filter(Boolean) }
          if (section === 3) return { ...uc, techstackUsed: editContent.split('\n').filter(Boolean) }
          if (section === 4) return { ...uc, dataflow: editContent }
          if (section === 5) return { ...uc, security: editContent.split('\n\n').filter(Boolean) }
        }
      }
      return uc
    }))
    
    setEditingSectionId(null)
    triggerToast('Section updated successfully!')
  }

  const handleRegenerate = () => {
    if (!modifyingId) return

    setIsModalOpen(false)

    if (modalType === 'regenerate-section') {
      const sectionKey = `${modifyingId}-${modifyingSection}`
      setRegeneratingSectionId(sectionKey)
      setTimeout(() => {
        setRegeneratingSectionId(null)
        triggerToast('Section regenerated successfully!')
      }, 2000)
      return
    }

    if (modalType === 'edit-section' || modalType === 'upload-diagram') {
      triggerToast(modalType === 'upload-diagram' ? 'Diagram uploaded successfully!' : 'Section saved successfully!')
      return
    }

    // Default for Use Case regenerate
    setCases((prev) => prev.map((uc) => {
      if (uc.id === modifyingId) {
        return {
          ...uc,
          actionStatus: 'Modified'
        }
      }
      return uc
    }))

    triggerToast('Usecase regenerated successfully!')
  }

  return (
    <div className={styles.accordionContainer}>
      {cases.map((uc) => {
        const isExpanded = expandedId === uc.id
        return (
          <div key={uc.id} className={`${styles.accordionItem} ${isExpanded ? styles.expanded : ''}`}>
            <div
              className={styles.accordionHeader}
              onClick={() => toggleExpand(uc.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleExpand(uc.id)
                }
              }}
            >
              <div className={styles.headerLeft}>
                <div className={styles.numberIcon}>
                  {uc.number}
                </div>
                <div className={styles.titleContainer}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.title}>{uc.title}</h3>
                    <div className={styles.chipsContainer}>
                      <span className={styles.moduleChip}>{uc.modulesCount} modules</span>
                      {uc.actionStatus === 'Modified' && (
                        <span className={`${styles.actionChip} ${styles.chipModified}`}>{uc.actionStatus}</span>
                      )}
                    </div>
                  </div>
                  <p className={styles.subtext}>{uc.subtext}</p>
                </div>
              </div>
              <div className={styles.headerRight}>
                {!isStage3 && (
                  <button
                    className={styles.renameCtaBtn}
                    onClick={(e) => openRenameModal(e, uc.id)}
                  >
                    Rename
                  </button>
                )}
                <button
                  className={styles.modifyCtaBtn}
                  onClick={(e) => openModifyModal(e, uc.id)}
                >
                  Modify
                </button>
                <svg
                  className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {isExpanded && !isStage3 && (
              <div className={styles.accordionContent}>

                {/* SECTION 1: Problem Understanding */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-1` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>1 — Problem Understanding</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 1) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 1) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-1` ? (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        className={styles.useCaseModifyTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ minHeight: '120px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <ul className={styles.bulletList}>
                      {uc.problemUnderstanding.map((point, idx) => (
                        <li key={idx}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* SECTION 2: Techno-functional Scope */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-2` && (
                    <div className={styles.shimmerOverlay}>
                      <div className={styles.shimmerText}>Regenerating Section...</div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>2 — Techno-functional Scope</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 2) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 2) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  <span className={styles.sectionSubtitle} style={{ marginTop: '-12px', display: 'block', marginBottom: '16px' }}>Module-by-module breakdown — include / exclude</span>
                  <div className={styles.modulesList}>
                    {uc.technoFunctionalScope.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} triggerToast={triggerToast} />
                    ))}
                  </div>
                </div>

                {/* SECTION 3: Assumptions & Dependencies */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-3` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>3 — Assumptions & Dependencies</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 3) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 3) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-3` ? (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        className={styles.useCaseModifyTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ minHeight: '120px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <ul className={styles.bulletList}>
                      {uc.assumptions.map((point, idx) => (
                        <li key={idx}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>


              </div>
            )}

            {isExpanded && isStage3 && (
              <div className={styles.accordionContent}>

                {/* STAGE 3 SECTION 1: Architecture Diagram */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-1` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>1 — Architecture Diagram</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Upload diagram" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'upload-diagram', 1) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 1) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  <ArchitectureDiagram />
                </div>

                {/* STAGE 3 SECTION 2: Architecture Summary */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-2` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>2 — Architecture Summary</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 2) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 2) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-2` ? (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        className={styles.useCaseModifyTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ minHeight: '120px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.paragraphContainer}>
                      {uc.architectureSummary?.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* STAGE 3 SECTION 3: Techstack Used */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-3` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>3 — Tech Stack Used</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 3) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 3) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-3` ? (
                    <div style={{ marginTop: '16px' }}>
                      <div className={styles.chipsWrap}>
                        {editContent.split('\n').filter(Boolean).map((tech, idx) => (
                          <span key={idx} className={styles.sectionChip} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {tech}
                            <svg 
                              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              style={{ cursor: 'pointer', opacity: 0.7 }}
                              onClick={() => {
                                const newTech = editContent.split('\n').filter(Boolean);
                                newTech.splice(idx, 1);
                                setEditContent(newTech.join('\n'));
                              }}
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Add new tech stack... (Press Enter)" 
                          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', flex: 1, fontSize: '0.875rem' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              const val = e.currentTarget.value.trim();
                              setEditContent(editContent ? editContent + '\n' + val : val);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.chipsWrap}>
                      {uc.techstackUsed?.map((tech, idx) => (
                        <span key={idx} className={styles.sectionChip}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* STAGE 3 SECTION 4: Dataflow Understanding */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-4` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>4 — Data Flow Understanding</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 4) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 4) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-4` ? (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        className={styles.useCaseModifyTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ minHeight: '120px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.paragraphContainer}>
                      <p>{uc.dataflow}</p>
                    </div>
                  )}
                </div>

                {/* STAGE 3 SECTION 5: Security */}
                <div className={styles.sectionContainer}>
                  {regeneratingSectionId === `${uc.id}-5` && (
                    <div className={styles.shimmerOverlay} style={{ borderRadius: 'var(--radius-md)' }}>
                      <div className={styles.shimmerText}>
                        <svg className={styles.shimmerSpinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Regenerating Section...
                      </div>
                    </div>
                  )}
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>5 — Security</h4>
                    </div>
                    <div className={styles.sectionActions}>
                      <button className={styles.sectionActionBtn} title="Edit section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'edit-section', 5) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className={styles.sectionActionBtn} title="Regenerate section" onClick={(e) => { e.stopPropagation(); openModifyModal(e, uc.id, 'regenerate-section', 5) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                    </div>
                  </div>
                  {editingSectionId === `${uc.id}-5` ? (
                    <div style={{ marginTop: '16px' }}>
                      <textarea
                        className={styles.useCaseModifyTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ minHeight: '120px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                        <button className={styles.modalCancelBtn} onClick={() => setEditingSectionId(null)}>Discard</button>
                        <button className={styles.modalRegenerateBtn} onClick={handleSaveInlineEdit}>Save Changes</button>
                      </div>
                    </div>
                  ) : (
                    <ul className={styles.bulletList}>
                      {uc.security?.map((point, idx) => (
                        <li key={idx}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            )}
          </div>
        )
      })}

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalType === 'usecase' ? 'Modify Use Case' : modalType === 'edit-section' ? 'Edit Section' : modalType === 'upload-diagram' ? 'Upload Architecture Diagram' : modalType === 'rename' ? 'Rename' : 'Regenerate Section'}
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              {modalType !== 'rename' && (
                <p className={styles.modalDesc}>
                  {modalType === 'usecase'
                    ? 'Provide instructions on how to regenerate this use case.'
                    : modalType === 'edit-section'
                      ? 'Provide the updated content for this section.'
                      : modalType === 'upload-diagram'
                        ? 'Select an image file to upload as the new architecture diagram.'
                        : 'Provide instructions on how to regenerate this section.'}
                </p>
              )}
              
              {modalType === 'upload-diagram' ? (
                <div className={styles.uploadBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.uploadIcon}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <p>Drag and drop or <span className={styles.uploadBrowse}>browse files</span></p>
                </div>
              ) : modalType === 'rename' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>Title</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      value={renameTitle}
                      onChange={(e) => setRenameTitle(e.target.value)}
                    />
                  </div>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>Use Case</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      value={renameUseCaseLabel}
                      onChange={(e) => setRenameUseCaseLabel(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <textarea
                  className={styles.useCaseModifyTextarea}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={modalType === 'edit-section' ? "Enter section content..." : "e.g., Focus more on compliance features..."}
                />
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              {modalType === 'rename' ? (
                <button className={styles.modalRegenerateBtn} onClick={handleRenameSave} disabled={!renameTitle.trim() || !renameUseCaseLabel.trim()}>
                  Save
                </button>
              ) : (
                <button className={styles.modalRegenerateBtn} onClick={handleRegenerate} disabled={modalType !== 'upload-diagram' && !prompt.trim()}>
                  {modalType === 'usecase' ? 'Regenerate Use Case' : modalType === 'regenerate-section' ? 'Regenerate Section' : modalType === 'upload-diagram' ? 'Upload' : 'Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className={styles.toast}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toastMessage}
        </div>
      )}
    </div>
  )
}

