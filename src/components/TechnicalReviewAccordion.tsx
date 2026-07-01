'use client'

import React, { useState } from 'react'
import styles from './TechnicalReviewAccordion.module.css'

export interface ArchitectureNode {
  title: string
  subtitle: string
}

export interface UseCaseData {
  id: string
  badge: string
  title: string
  subtext: string
  statusPill: string
  problemUnderstanding: string[]
  approach: { prefix: string; text: string }[]
  architecture: {
    clientLayer: ArchitectureNode[]
    apiLayer: ArchitectureNode[]
    dataLayer: ArchitectureNode[]
    infrastructureLayer: ArchitectureNode[]
  }
  scopeCoverage: string[]
  assumptions: string[]
}

const mockData: UseCaseData[] = [
  {
    id: 'uc1',
    badge: 'UC1',
    title: 'AI Legislative Avatar',
    subtext: 'UC1 — Conversational AI assistant for legal queries with avatar interface',
    statusPill: 'Scope approved',
    problemUnderstanding: [
      'Citizens cannot locate the right law or article without legal expertise — they give up or pay lawyers for basic queries.',
      'Legal texts in Arabic are dense; non-native speakers face a double barrier of language and jargon.',
      'Call centres are overwhelmed with repetitive questions that could be answered by a well-governed AI.',
      'There is no trusted, always-on channel that is authoritative, bilingual, and auditable.'
    ],
    approach: [
      { prefix: 'Conversational AI Engine.', text: ' The core reasoning layer that understands a citizen\'s question, retrieves the right legal article, and formulates a plain-language answer.' },
      { prefix: 'Digital Avatar & Voice Interface.', text: ' Visual avatar component integrating text-to-speech for an immersive, accessible user experience.' },
      { prefix: 'Legal Corpus Management.', text: ' Backend system to ingest, index, and update the approved ADJD legal corpus.' }
    ],
    architecture: {
      clientLayer: [
        { title: 'Web Portal', subtitle: 'React UI' },
        { title: 'Mobile App', subtitle: 'React Native' }
      ],
      apiLayer: [
        { title: 'API Gateway', subtitle: 'Azure API Mgt' },
        { title: 'Auth Service', subtitle: 'UAE Pass' }
      ],
      dataLayer: [
        { title: 'LLM Orchestrator', subtitle: 'LangChain' },
        { title: 'Vector DB', subtitle: 'Pinecone' }
      ],
      infrastructureLayer: [
        { title: 'App Services', subtitle: 'Azure App Svc' },
        { title: 'Blob Storage', subtitle: 'Azure Storage' }
      ]
    },
    scopeCoverage: [
      'End-to-end user journeys for both Web and Mobile interfaces.',
      'Integration with ADJD\'s existing Single Sign-On (SSO) and UAE Pass.',
      'Secure Vector Database indexing for up to 10,000 legal articles.'
    ],
    assumptions: [
      'ADJD supplies the approved legal corpus in a structured digital format.',
      'An avatar partner (D-ID or similar) is selected and contracted separately.',
      'ADJD\'s existing IAM exposes standard OAuth 2.0 / SAML endpoints.'
    ]
  },
  {
    id: 'uc2',
    badge: 'UC2',
    title: 'Smart Case Filing Portal',
    subtext: 'UC2 — AI-guided self-service portal for citizens to file legal cases without a lawyer',
    statusPill: 'Awaiting approval',
    problemUnderstanding: [
      'Citizens struggle with complex legal forms and terminology when filing cases manually.',
      'High rejection rates due to improperly filled forms or missing documents.'
    ],
    approach: [
      { prefix: 'Dynamic Form Generation.', text: ' Forms adapt to user inputs to only ask relevant questions.' },
      { prefix: 'Case Management API Bridge.', text: ' Direct integration with backend legacy systems for submission.' }
    ],
    architecture: {
      clientLayer: [
        { title: 'Web Portal', subtitle: 'React UI' }
      ],
      apiLayer: [
        { title: 'API Gateway', subtitle: 'Azure API Mgt' }
      ],
      dataLayer: [
        { title: 'Validation Service', subtitle: 'Node.js' }
      ],
      infrastructureLayer: [
        { title: 'Blob Storage', subtitle: 'Azure Storage' }
      ]
    },
    scopeCoverage: [
      'Self-service portal for case filing.',
      'Automated validation and error highlighting.'
    ],
    assumptions: [
      'Legacy systems expose SOAP/REST endpoints for submission.',
      'ADJD provides all necessary form logic rules.'
    ]
  }
]

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <h4 className={styles.sectionHeader}>{title}</h4>
}

export function TechnicalReviewAccordion({ items = mockData }: { items?: UseCaseData[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={styles.accordionContainer}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id
        return (
          <div key={item.id} className={`${styles.accordionItem} ${isExpanded ? styles.expanded : ''}`}>
            
            <div className={styles.accordionHeader} onClick={() => toggleExpand(item.id)}>
              <div className={styles.headerLeft}>
                <div className={styles.badge}>{item.badge}</div>
                <div className={styles.titleContainer}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.subtext}>{item.subtext}</p>
                </div>
              </div>
              <div className={styles.headerRight}>
                <span className={styles.statusPill}>{item.statusPill}</span>
                <button className={styles.refreshBtn} aria-label="Refresh">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.45l4.28 2.88"/></svg>
                </button>
                <svg className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            
            {isExpanded && (
              <div className={styles.accordionContent}>
                
                <SectionHeader title="| PROBLEM UNDERSTANDING" />
                <div className={styles.cardsColumn}>
                  {item.problemUnderstanding.map((text, idx) => (
                    <div key={idx} className={styles.problemCard}>
                      {text}
                    </div>
                  ))}
                </div>

                <SectionHeader title="| OUR APPROACH" />
                <div className={styles.approachContainer}>
                  {item.approach.map((ap, idx) => (
                    <p key={idx} className={styles.approachPara}>
                      <strong>{ap.prefix}</strong>{ap.text}
                    </p>
                  ))}
                </div>

                <SectionHeader title="| ARCHITECTURE & INTEGRATIONS" />
                <div className={styles.architectureDiagram}>
                  
                  {/* Client Layer */}
                  <div className={styles.archLayerText}>| CLIENT LAYER</div>
                  <div className={styles.archRow}>
                    {item.architecture.clientLayer.map((node, i) => (
                      <div key={i} className={styles.archNode}>
                         <div className={styles.nodeTitle}>{node.title}</div>
                         <div className={styles.nodeSubtitle}>{node.subtitle}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.connectorText}>↓ HTTPS / API Gateway</div>

                  {/* API Layer */}
                  <div className={styles.archLayerText}>| API & SERVICES LAYER</div>
                  <div className={styles.archRow}>
                    {item.architecture.apiLayer.map((node, i) => (
                      <div key={i} className={styles.archNode}>
                         <div className={styles.nodeTitle}>{node.title}</div>
                         <div className={styles.nodeSubtitle}>{node.subtitle}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.connectorText}>↓ REST / gRPC</div>

                  {/* Data Layer */}
                  <div className={styles.archLayerText}>| DATA & MESSAGING LAYER</div>
                  <div className={styles.archRow}>
                    {item.architecture.dataLayer.map((node, i) => (
                      <div key={i} className={styles.archNode}>
                         <div className={styles.nodeTitle}>{node.title}</div>
                         <div className={styles.nodeSubtitle}>{node.subtitle}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.connectorText}>↓ Internal VNET</div>

                  {/* Infra Layer */}
                  <div className={styles.archLayerText}>| INFRASTRUCTURE LAYER</div>
                  <div className={styles.archRow}>
                    {item.architecture.infrastructureLayer.map((node, i) => (
                      <div key={i} className={styles.archNode}>
                         <div className={styles.nodeTitle}>{node.title}</div>
                         <div className={styles.nodeSubtitle}>{node.subtitle}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.diagramLegend}>
                    <div className={styles.legendDot} style={{backgroundColor: '#FF7675'}}></div><span>Client</span>
                    <div className={styles.legendDot} style={{backgroundColor: '#74B9FF'}}></div><span>Services</span>
                    <div className={styles.legendDot} style={{backgroundColor: '#FDCB6E'}}></div><span>Data</span>
                    <div className={styles.legendDot} style={{backgroundColor: '#A29BFE'}}></div><span>Infra</span>
                  </div>
                </div>

                <SectionHeader title="| SCOPE COVERAGE" />
                <ul className={styles.checkList}>
                  {item.scopeCoverage.map((text, idx) => (
                    <li key={idx} className={styles.checkListItem}>
                      <CheckIcon />
                      <span className={styles.checkListText}>{text}</span>
                    </li>
                  ))}
                </ul>

                <SectionHeader title="| ASSUMPTIONS & DEPENDENCIES" />
                <ul className={styles.checkList}>
                  {item.assumptions.map((text, idx) => (
                    <li key={idx} className={styles.checkListItem}>
                      <CheckIcon />
                      <span className={styles.checkListText}>{text}</span>
                    </li>
                  ))}
                </ul>

              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
