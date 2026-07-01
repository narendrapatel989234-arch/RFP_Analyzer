'use client'

import React, { useState } from 'react'
import styles from './UseCaseAccordion.module.css'

export interface UseCaseModule {
  id: string
  identifier: string
  title: string
  description: string
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
        description: 'The core reasoning layer that understands a citizen\'s question, retrieves the right legal article, and formulates a plain-language answer — in Arabic or English.'
      },
      {
        id: 'm2',
        identifier: 'M2',
        title: 'Digital Avatar & Voice Interface',
        description: 'Visual avatar component integrating text-to-speech for an immersive, accessible user experience.'
      },
      {
        id: 'm3',
        identifier: 'M3',
        title: 'Legal Corpus Management',
        description: 'Backend system to ingest, index, and update the approved ADJD legal corpus.'
      },
      {
        id: 'm4',
        identifier: 'M4',
        title: 'Auditability & Compliance',
        description: 'Logging and tracking module ensuring every AI response links back to the authoritative source document.'
      },
      {
        id: 'm5',
        identifier: 'M5',
        title: 'IAM & API Integration',
        description: 'Secure authentication endpoints and internal API bridges for legacy systems.'
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

function ModuleRow({ mod }: { mod: UseCaseModule }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={styles.moduleRowContainer}>
      <div className={styles.moduleRowHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.moduleLeft}>
          <span className={styles.moduleId}>{mod.identifier}</span>
          <span className={styles.moduleTitle}>{mod.title}</span>
        </div>
        <div className={styles.moduleRight}>
          <button className={styles.moduleActionBtn} onClick={(e) => e.stopPropagation()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button className={styles.moduleActionBtn} onClick={(e) => e.stopPropagation()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Regenerate
          </button>
          <svg className={`${styles.moduleChevron} ${expanded ? styles.chevronOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      {expanded && (
        <div className={styles.moduleDetails}>
          <p>{mod.description}</p>
        </div>
      )}
    </div>
  )
}

export function UseCaseAccordion({ useCases = defaultUseCases }: { useCases?: UseCase[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.accordionContainer}>
      {useCases.map((uc) => {
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
                  <h3 className={styles.title}>{uc.title}</h3>
                  <p className={styles.subtext}>{uc.subtext}</p>
                </div>
              </div>
              <div className={styles.headerRight}>
                <div className={styles.chipsContainer}>
                  <span className={styles.moduleChip}>{uc.modulesCount} modules</span>
                  {uc.actionStatus === 'Approved' && (
                    <span className={`${styles.actionChip} ${styles.chipApproved}`}>{uc.actionStatus}</span>
                  )}
                  {uc.actionStatus === 'Modified' && (
                    <span className={`${styles.actionChip} ${styles.chipModified}`}>{uc.actionStatus}</span>
                  )}
                </div>
                <span className={styles.statusText}>{uc.status}</span>
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
                      <ModuleRow key={mod.id} mod={mod} />
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

                {/* ACTION FOOTER */}
                <div className={styles.actionFooter}>
                  <button className={styles.btnSecondary}>Modify</button>
                  <button className={styles.btnPrimary}>Approve This UC</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

