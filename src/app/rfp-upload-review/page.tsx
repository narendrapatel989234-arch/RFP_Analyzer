'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { File } from 'lucide-react'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper } from '@/components/ProgressStepper'
import styles from './page.module.css'

interface OutlineNode {
  id: string;
  prefix: string;
  label: string;
  children?: OutlineNode[];
}

const DUMMY_OUTLINE_DATA: OutlineNode[] = [
  { id: '1', prefix: '1', label: 'Table of Contents' },
  { id: '2', prefix: '2', label: 'Leadership Letter' },
  { id: '3', prefix: '3', label: 'Executive Summary' },
  {
    id: '4', prefix: '4', label: 'Technical Approach',
    children: [
      { id: '4.1', prefix: '4.1', label: 'Architecture Vision' },
      { id: '4.2', prefix: '4.2', label: 'Methodology' }
    ]
  },
  {
    id: '5', prefix: '5', label: 'Implementation Plan',
    children: [
      { id: '5.1', prefix: '5.1', label: 'Timeline & Phases' },
      { id: '5.2', prefix: '5.2', label: 'Resource Allocation' }
    ]
  },
  { id: '6', prefix: '6', label: 'Commercial Proposal' },
  { id: '7', prefix: '7', label: 'Company Profile' },
  { id: '8', prefix: '8', label: 'Relevant Case Studies' },
  { id: '9', prefix: '9', label: 'Assumptions & Dependencies' },
  { id: '10', prefix: '10', label: 'Appendix' }
]

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
      <div className={`${styles.outlineHeader}`} onClick={() => setIsCollapsed(!isCollapsed)}>
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

export default function RFPUploadReviewPage() {
  const router = useRouter()
  const [componentsExpanded, setComponentsExpanded] = useState(false)
  const [partnerExpanded, setPartnerExpanded] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<{ name: string; size: string } | null>(null)

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

  const renderExtractedCard = (
    title: string,
    data: { file: { name: string; size: string }; description: string; tableData: { id: string; name: string; description: string }[] },
    isExpanded: boolean,
    toggleExpanded: () => void
  ) => (
    <div className={styles.extractedCard}>
      <div className={styles.extractedCardHeader} onClick={toggleExpanded}>
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


  return (
    <div className={styles.page}>
      <TopNav showBack={false} />

      <main className={styles.content}>
        <button className={styles.backBtn} onClick={() => router.push('/rfp/RFP-001')} aria-label="Go back">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="16"
            height="16"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <section className={styles.headerContainer} style={{ marginTop: 'var(--space-2)' }}>
          <ProgressStepper
            activeStep={2}
            onStepClick={(stepId) => {
              if (stepId === 1) {
                router.push('/rfp-upload-review')
              }
            }}
          />
        </section>

        <section className={styles.headerContainer}>
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
            RFP Upload Summary
          </h1>
          <p className={styles.pageSubtitle}>A read-only snapshot of the configuration submitted for this RFP.</p>
          <hr className={styles.divider} />
        </section>

        {/* Summary Card */}
        <div className={styles.summaryCard}>
          {/* Top row — main document */}
          <div className={styles.summaryTopRow} onClick={() => setPreviewDoc({ name: 'RFP_Document.pdf', size: '2.4 MB' })}>
            <div className={styles.summaryFileIcon}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className={styles.summaryDocInfo}>
              <span className={styles.summaryDocName}>RFP_Document.pdf</span>
              <span className={styles.summaryDocSize}>2.4 MB</span>
            </div>
          </div>

          {/* Second row — instruction */}
          <div className={styles.summaryInstructionRow}>
            <span className={styles.summaryInstructionLabel}>Instruction: </span>
            <span className={styles.summaryInstructionText}>Focus on cloud-native architecture and emphasise our delivery track record in the public sector. Highlight our experience with similar government digitisation projects and reference relevant case studies. Ensure the proposal addresses all compliance and security requirements outlined in the RFP. Keep the tone formal and solution-oriented, with a strong executive summary upfront.</span>
          </div>

          {/* Third row — supporting documents */}
          <div className={styles.summarySupportRow}>
            <span className={styles.summaryInstructionLabel}>Supporting Documents: </span>
            <div className={styles.summarySupportList}>
              <div className={styles.summarySupportDoc} onClick={() => setPreviewDoc({ name: 'Compliance_Certificate.pdf', size: '0.9 MB' })}>
                <div className={styles.summarySupportIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className={styles.summaryDocInfo}>
                  <span className={styles.summarySupportName}>Compliance_Certificate.pdf</span>
                  <span className={styles.summarySupportSize}>0.9 MB</span>
                </div>
              </div>
              <div className={styles.summarySupportDoc} onClick={() => setPreviewDoc({ name: 'Inception42_Proposal_Template.pdf', size: '1.4 MB' })}>
                <div className={styles.summarySupportIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className={styles.summaryDocInfo}>
                  <span className={styles.summarySupportName}>Inception42_Proposal_Template.pdf</span>
                  <span className={styles.summarySupportSize}>1.4 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - Components */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Components</h2>
          {renderExtractedCard('Component List', componentsData, componentsExpanded, () => setComponentsExpanded(!componentsExpanded))}
        </section>

        {/* Section 5 - Partner Capabilities */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Partner Capabilities</h2>
          {renderExtractedCard('Capability List', partnerData, partnerExpanded, () => setPartnerExpanded(!partnerExpanded))}
        </section>

        {/* Section 7 - Proposal Template Format */}
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Proposal Template Format</h2>
          <div className={styles.card}>
            <ReadOnlyOutlineTree data={DUMMY_OUTLINE_DATA} />
          </div>
        </section>

        <div className={styles.footer}>
          <button className={styles.nextBtn} onClick={() => router.push('/rfp/RFP-001')}>
            Next
          </button>
        </div>
      </main>

      {/* Drawer */}
      {previewDoc && (
        <div className={styles.drawerOverlay} onClick={() => setPreviewDoc(null)}>
          <div className={styles.drawerPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>{previewDoc.name}</h3>
              <button className={styles.drawerCloseBtn} onClick={() => setPreviewDoc(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.drawerRichText}>
                <h2>Request for Proposal — Cloud Infrastructure Modernisation</h2>
                
                <h3>1. Background</h3>
                <p>The Department of Public Works is seeking proposals from qualified vendors to modernise our legacy infrastructure. Our current on-premise data centres are reaching end-of-life, and we aim to migrate core services to a scalable, highly available cloud-native environment to improve citizen services.</p>
                
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
        </div>
      )}
    </div>
  )
}
