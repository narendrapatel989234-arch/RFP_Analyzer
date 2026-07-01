'use client'

import React, { useState, useEffect } from 'react'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper, Step } from '@/components/ProgressStepper'
import { TechnicalReviewAccordion } from '@/components/TechnicalReviewAccordion'
import styles from './step4.module.css'

const step4Steps: Step[] = [
  { id: 1, label: 'Step 1', sublabel: 'RFP Upload', status: 'completed' },
  { id: 2, label: 'Step 2', sublabel: 'Functional Confirmation', status: 'completed' },
  { id: 3, label: 'Step 3', sublabel: 'Functional Review', status: 'completed' },
  { id: 4, label: 'Step 4', sublabel: 'Technical Instructions', status: 'in-progress' },
  { id: 5, label: 'Step 5', sublabel: 'Technical Review', status: 'not-started' },
]

const step5Steps: Step[] = [
  { id: 1, label: 'Step 1', sublabel: 'RFP Upload', status: 'completed' },
  { id: 2, label: 'Step 2', sublabel: 'Functional Confirmation', status: 'completed' },
  { id: 3, label: 'Step 3', sublabel: 'Functional Review', status: 'completed' },
  { id: 4, label: 'Step 4', sublabel: 'Technical Instructions', status: 'completed' },
  { id: 5, label: 'Step 5', sublabel: 'Technical Review', status: 'in-progress' },
]

const PROCESSING_DELAY_MS = 4000;

const loadingPhrases = [
  "Analyzing Technical Scope...",
  "Generating Architecture...",
  "Drafting Integrations & Costing..."
];

export default function Step4Demo() {
  const [viewState, setViewState] = useState<'form' | 'processing' | 'step5'>('form');
  const [capabilities, setCapabilities] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [activeTab, setActiveTab] = useState<'Proposal' | 'Executive Summary'>('Proposal');

  const handleClear = () => {
    setCapabilities('');
    setPrompt('');
  };

  const handleProceed = () => {
    setViewState('processing');
  };

  useEffect(() => {
    if (viewState === 'processing') {
      const phraseTimer = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % loadingPhrases.length);
      }, 1300);
      
      const timer = setTimeout(() => {
        clearInterval(phraseTimer);
        setViewState('step5');
      }, PROCESSING_DELAY_MS);
      
      return () => {
        clearInterval(phraseTimer);
        clearTimeout(timer);
      }
    }
  }, [viewState]);

  return (
    <div className={styles.page}>
      <TopNav showBack={true} />
      <main className={styles.content}>
        <section className={styles.section}>
          <ProgressStepper steps={viewState === 'step5' ? step5Steps : step4Steps} />
        </section>
        
        {viewState === 'form' && (
          <section className={styles.section}>
            <div className={styles.centerContainer}>
              <div className={styles.headerContainer}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.headerIconWrapper}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  Define Technical Scope
                </h2>
                <p className={styles.sectionSubtitle}>
                  Select capabilities and provide instructions for the AI to generate the technical response.
                </p>
              </div>
              
              <div className={styles.formCard}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="capabilities">Select Tech Capabilities</label>
                  <select 
                    id="capabilities"
                    className={styles.dropdownField}
                    value={capabilities}
                    onChange={(e) => setCapabilities(e.target.value)}
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="partner">Partner</option>
                    <option value="shelf">Shelf Capabilities</option>
                    <option value="internal">Internal Knowledge Base</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="prompt">Provide Instructions</label>
                  <textarea 
                    id="prompt"
                    className={styles.inputField}
                    placeholder="Enter detailed instructions for the AI..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className={styles.actionRow}>
                  <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                  <button className={styles.proceedBtn} onClick={handleProceed} disabled={!capabilities || !prompt}>Proceed</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {viewState === 'processing' && (
          <section className={styles.section}>
            <div className={styles.centerContainer}>
              <div className={styles.processingCard}>
                <div className={styles.processingHeader}>
                  <h2 className={styles.processingTitle}>{loadingPhrases[loadingPhase]}</h2>
                  <p className={styles.processingSubtext}>AI is analyzing capabilities and generating Step 5 data...</p>
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar}></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {viewState === 'step5' && (
          <section className={styles.section}>
            <div className={styles.centerWrapper}>
              <div className={styles.step5TopHeader}>
                <div className={styles.step5TopLeft}>
                  <h1 className={styles.step5Title}>Full Final Proposal Review</h1>
                  <p className={styles.step5Subtext}>Following your instructions, review and add comments to update or regenerate.</p>
                </div>
                <div className={styles.headerActionContainer}>
                  <button className={styles.ctaSecondary}>Export DOCX</button>
                  <button className={styles.ctaSecondary}>Save as draft</button>
                  <button className={styles.ctaPrimary}>Approve proposal</button>
                </div>
              </div>

              <div className={styles.tabsContainer}>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'Proposal' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('Proposal')}
                >
                  Proposal
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'Executive Summary' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('Executive Summary')}
                >
                  Executive Summary
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'Proposal' && <TechnicalReviewAccordion />}
                {activeTab === 'Executive Summary' && (
                  <>
                    <div className={styles.summaryCard}>
                      {/* A prominent, dark-filled header to retain the UI structure without being green */}
                      <div className={styles.summaryCardHeader}>
                        <h3>Executive Summary</h3>
                        <p>Comprehensive overview of the proposed solution, scope, and capabilities</p>
                      </div>
                      
                      <div className={styles.summaryCardBody}>
                        {/* Section 1: Company Capability */}
                        <div className={styles.internalSection}>
                          <h4 className={styles.sectionHeading}>Company Capability & Overview</h4>
                          <p className={styles.sectionText}>We are a delivery partner with deep experience building secure, scalable enterprise platforms... 120+ enterprise platform deliveries, ISO 27001 compliance, and dedicated practices for cloud and data engineering.</p>
                        </div>
                        
                        <hr className={styles.divider} />
                        
                        {/* Section 2: Scope */}
                        <div className={styles.internalSection}>
                          <h4 className={styles.sectionHeading}>Scope Overview</h4>
                          <p className={styles.sectionText}>The scope covers the implementation of the ADJD-approved legislative corpus and the AI case filing portal, excluding third-party hardware procurement.</p>
                        </div>
                        
                        <hr className={styles.divider} />

                        {/* Section 3: Proposal Summary (The Use Cases) */}
                        <div className={styles.internalSection}>
                          <h4 className={styles.sectionHeading}>Proposal Summary</h4>
                          
                          {/* UC1 */}
                          <div className={styles.summaryItem}>
                            <div className={styles.summaryItemHeader}>
                              <span className={styles.summaryBadge}>UC1</span>
                              <div className={styles.summaryItemTitleBlock}>
                                <h5>AI Legislative Avatar</h5>
                                <span>5 modules - 25 in-scope items - 5 assumptions</span>
                              </div>
                            </div>
                            <p className={styles.sectionText}>Our solution for AI Legislative Avatar addresses 4 identified problem areas through 5 functional modules...</p>
                            <div className={styles.summaryChips}>
                              <span className={styles.chip}>Conversational AI engine with RAG over ADJD-approved le...</span>
                              <span className={styles.chip}>Photorealistic digital avatar with bilingual voice inte...</span>
                            </div>
                          </div>
                          
                          {/* UC2 */}
                          <div className={styles.summaryItem} style={{ marginTop: '16px' }}>
                            <div className={styles.summaryItemHeader}>
                              <span className={styles.summaryBadge}>UC2</span>
                              <div className={styles.summaryItemTitleBlock}>
                                <h5>Smart Case Filing Portal</h5>
                                <span>4 modules - 21 in-scope items - 5 assumptions</span>
                              </div>
                            </div>
                            <p className={styles.sectionText}>Our solution for Smart Case Filing Portal addresses 4 identified problem areas through 4 functional modules...</p>
                            <div className={styles.summaryChips}>
                              <span className={styles.chip}>AI-guided case type classification from citizen descrip...</span>
                              <span className={styles.chip}>Dynamic form engine with contextual guidance and docume...</span>
                            </div>
                          </div>
                        </div>
                        
                        <hr className={styles.divider} />

                        {/* Section 4: Risks & Mitigations */}
                        <div className={styles.internalSection}>
                          <h4 className={styles.sectionHeading}>Risks & Mitigations</h4>
                          <p className={styles.sectionText}><strong>Risk:</strong> Dependency on external avatar API provider.<br/><strong>Mitigation:</strong> Vendor-agnostic integration layer built to allow swapping providers if SLAs fail.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
