'use client'

import React, { useState } from 'react'
import styles from './UseCaseAccordion.module.css'

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
  problemUnderstanding: string[]
  technoFunctionalScope: UseCaseModule[]
  assumptions: string[]
}

const defaultUseCases: UseCase[] = [
  {
    id: 'uc1',
    number: '01',
    title: 'AI Legislative Avatar',
    subtext: 'UC1 — Conversational AI assistant for legal queries with avatar interface',
    status: 'Awaiting review',
    modulesCount: 5,
    actionStatus: 'Approved',
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
    ]
  },
  {
    id: 'uc2',
    number: '02',
    title: 'Smart Case Filing Portal',
    subtext: 'UC2 — AI-guided self-service portal for citizens to file legal cases without a lawyer',
    status: 'Awaiting review',
    modulesCount: 12,
    actionStatus: 'Modified',
    problemUnderstanding: ['Dummy problem 1'],
    technoFunctionalScope: [],
    assumptions: ['Dummy assumption 1']
  },
  {
    id: 'uc3',
    number: '03',
    title: 'Judicial Analytics Dashboard',
    subtext: 'UC3 — Real-time insight platform for ADJD leadership to monitor court performance and backlog',
    status: 'Awaiting review',
    modulesCount: 8,
    actionStatus: null,
    problemUnderstanding: ['Dummy problem 1'],
    technoFunctionalScope: [],
    assumptions: ['Dummy assumption 1']
  }
]

function ModuleRow({ mod, triggerToast }: { mod: UseCaseModule, triggerToast: (msg: string) => void }) {
  const [localMod, setLocalMod] = useState(mod)
  const [expanded, setExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Edit State
  const [editDesc, setEditDesc] = useState(localMod.description)
  const [editIncluded, setEditIncluded] = useState(localMod.includedInScope?.join('\n') || '')
  const [editExcluded, setEditExcluded] = useState(localMod.outOfScope?.join('\n') || '')

  // Regen State
  const [regenPrompt, setRegenPrompt] = useState('')

  const handleSaveEdit = () => {
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button className={styles.moduleActionBtn} onClick={(e) => { e.stopPropagation(); setIsRegenerateModalOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Regenerate
          </button>
          <svg className={`${styles.moduleChevron} ${expanded ? styles.chevronOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
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
              <div className={styles.modalHeaderIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <h3 className={styles.modalTitle}>Edit — {mod.title}</h3>
            </div>
            <p className={styles.modalDesc}>Update the scope description, include or exclude items for this module.</p>
            
            <div className={styles.modalFormGroup}>
              <label className={styles.modalLabel}>Module description</label>
              <textarea className={styles.modalTextarea} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
            </div>

            <div className={styles.modalFormGroup}>
              <label className={styles.modalLabel}>Included in scope (one item per line)</label>
              <textarea className={styles.modalTextarea} value={editIncluded} onChange={e => setEditIncluded(e.target.value)} />
            </div>

            <div className={styles.modalFormGroup}>
              <label className={styles.modalLabel}>Out of scope (one item per line)</label>
              <textarea className={styles.modalTextarea} value={editExcluded} onChange={e => setEditExcluded(e.target.value)} />
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
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

export function UseCaseAccordion({ useCases = defaultUseCases }: { useCases?: UseCase[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [cases, setCases] = useState<UseCase[]>(useCases)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modifyingId, setModifyingId] = useState<string | null>(null)
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

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const openModifyModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setModifyingId(id)
    setPrompt('')
    setIsModalOpen(true)
  }

  const handleRegenerate = () => {
    if (!modifyingId) return

    setCases((prev) => prev.map((uc) => {
      if (uc.id === modifyingId) {
        return {
          ...uc,
          actionStatus: 'Modified'
        }
      }
      return uc
    }))
    
    setIsModalOpen(false)
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
            {isExpanded && (
              <div className={styles.accordionContent}>
                
                {/* SECTION 1: Problem Understanding */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>1 — Problem Understanding</h4>
                    </div>
                    <span className={styles.sectionSubtitle}>User pain points we are addressing</span>
                  </div>
                  <ul className={styles.bulletList}>
                    {uc.problemUnderstanding.map((point, idx) => (
                      <li key={idx}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SECTION 2: Techno-functional Scope */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>2 — Techno-functional Scope</h4>
                    </div>
                    <span className={styles.sectionSubtitle}>Module-by-module breakdown — include / exclude</span>
                  </div>
                  <div className={styles.modulesList}>
                    {uc.technoFunctionalScope.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} triggerToast={triggerToast} />
                    ))}
                  </div>
                </div>

                {/* SECTION 3: Assumptions & Dependencies */}
                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderLeft}>
                      <div className={styles.sectionIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      </div>
                      <h4 className={styles.sectionTitle}>3 — Assumptions & Dependencies</h4>
                    </div>
                    <span className={styles.sectionSubtitle}>What must be true for us to deliver</span>
                  </div>
                  <ul className={styles.bulletList}>
                    {uc.assumptions.map((point, idx) => (
                      <li key={idx}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            )}
          </div>
        )
      })}

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Modify Use Case</h3>
            <p className={styles.modalDesc}>Provide instructions on how to regenerate this use case.</p>
            <textarea
              className={styles.useCaseModifyTextarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Focus more on compliance features..."
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className={styles.modalRegenerateBtn} onClick={handleRegenerate} disabled={!prompt.trim()}>
                Regenerate Use Case
              </button>
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

