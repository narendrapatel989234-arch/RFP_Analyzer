'use client'

import React, { useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { ProgressStepper } from '@/components/ProgressStepper'

import styles from './step4.module.css'

export default function Step4Demo() {
  const [viewState, setViewState] = useState<'form' | 'review'>('form');
  const [capabilities, setCapabilities] = useState('');
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'Proposal' | 'Executive Summary'>('Proposal');
  
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState('');

  const handleClear = () => {
    setCapabilities('');
    setPrompt('');
  };

  const handleProceed = () => {
    setViewState('review');
  };

  return (
    <div className={styles.page}>
      <TopNav showBack={true} />
      <main className={styles.content}>
        <section className={styles.section}>
          <ProgressStepper activeStep={viewState === 'review' ? 4 : 3} />
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

        {viewState === 'review' && (
          <section className={styles.section}>
            <div className={styles.centerWrapper}>
              <div className={styles.reviewTopHeader}>
                <div className={styles.reviewTopLeft}>
                  <h1 className={styles.reviewTitle}>Full Final Proposal Review</h1>
                  <p className={styles.reviewSubtext}>Following your instructions, review and add comments to update or regenerate.</p>
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
                {activeTab === 'Proposal' && (
                  <>
                    {/* Card 1: Company Profile */}
                    <div className={styles.proposalCard}>
                      <div className={styles.proposalCardHeader}>
                        <div className={styles.cardHeaderFlex}>
                          <div className={styles.cardHeaderLeft}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                            <h3>Company Capability & Overview</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <button className={styles.iconBtn} onClick={() => setEditingSection('company')} title="Edit Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button className={styles.iconBtn} onClick={() => setShowRegenerateModal(true)} title="Regenerate Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.proposalCardBody}>
                        {editingSection === 'company' ? (
                          <div>
                            <textarea 
                              className={styles.editTextArea} 
                              defaultValue="We are a premier delivery partner with over 15 years of deep experience architecting, building, and maintaining secure, scalable enterprise platforms for government and public sector clients. Our organization has successfully completed 120+ mission-critical enterprise platform deliveries across the MENA region, ensuring robust digital transformation. We specialize in navigating complex regulatory environments and delivering future-proof, high-availability systems that serve millions of citizens.&#10;&#10;• 120+ enterprise platform deliveries across banking, public sector, and judiciary domains, focusing on high-availability and zero-downtime migrations.&#10;• Dedicated, specialized practices for cloud infrastructure (AWS, Azure), advanced data engineering, and applied artificial intelligence (RAG, LLMs).&#10;• Rigorous ISO 27001, ISO 9001, and SOC 2 Type II compliant delivery processes, guaranteeing the highest international standards of information security.&#10;• Comprehensive ongoing L1/L2/L3 support operations available 24/7/365 with highly restrictive internal SLAs for critical public infrastructure."
                            />
                            <div className={styles.editActions}>
                              <button className={styles.ctaSecondary} onClick={() => setEditingSection(null)}>Discard</button>
                              <button className={styles.ctaPrimary} onClick={() => setEditingSection(null)}>Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={styles.sectionText}>We are a premier delivery partner with over 15 years of deep experience architecting, building, and maintaining secure, scalable enterprise platforms for government and public sector clients. Our organization has successfully completed 120+ mission-critical enterprise platform deliveries across the MENA region, ensuring robust digital transformation. We specialize in navigating complex regulatory environments and delivering future-proof, high-availability systems that serve millions of citizens.</p>
                            <ul className={styles.checkList} style={{ marginTop: '16px' }}>
                              <li><span style={{color: '#64748B'}}>•</span> 120+ enterprise platform deliveries across banking, public sector, and judiciary domains, focusing on high-availability and zero-downtime migrations.</li>
                              <li><span style={{color: '#64748B'}}>•</span> Dedicated, specialized practices for cloud infrastructure (AWS, Azure), advanced data engineering, and applied artificial intelligence (RAG, LLMs).</li>
                              <li><span style={{color: '#64748B'}}>•</span> Rigorous ISO 27001, ISO 9001, and SOC 2 Type II compliant delivery processes, guaranteeing the highest international standards of information security.</li>
                              <li><span style={{color: '#64748B'}}>•</span> Comprehensive ongoing L1/L2/L3 support operations available 24/7/365 with highly restrictive internal SLAs for critical public infrastructure.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 2: Scope & Use Cases */}
                    <div className={styles.proposalCard}>
                      <div className={styles.proposalCardHeader}>
                        <div className={styles.cardHeaderFlex}>
                          <div className={styles.cardHeaderLeft}>
                            <h3>Scope</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <button className={styles.iconBtn} onClick={() => setShowRegenerateModal(true)} title="Regenerate Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.proposalCardBody}>
                        <p className={styles.sectionText}>The scope of this proposal encompasses the complete, end-to-end technical implementation of the ADJD-approved legislative corpus processing pipeline alongside the citizen-facing Smart Case Filing Portal. This comprehensive delivery includes all necessary custom LLM fine-tuning, RAG (Retrieval-Augmented Generation) infrastructure setup, secure API integrations with existing ADJD backend systems, complex data modeling for Arabic legal texts, and accessible frontend UI/UX development for both web and mobile channels. Our delivery phases include requirements gathering, architectural design, agile development, rigorous security and load testing, UAT, and production deployment. Please note that the scope strictly excludes any third-party hardware procurement, physical data center setup, or ongoing legal translation services, which are expected to be provisioned by the client.</p>

                        {/* Nested UC1 */}
                        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '24px' }}>UC1 — AI Legislative Avatar</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                              <div className={styles.ucSectionTitle}>PROBLEM UNDERSTANDING</div>
                              <div className={styles.problemCard}>Citizens and legal professionals currently struggle to locate precise, up-to-date legal clauses through standard keyword-based search interfaces, leading to massive frustration and increased call-center volumes.</div>
                              <div className={styles.problemCard}>Legal texts in Arabic are incredibly dense, context-heavy, and grammatically complex, requiring highly nuanced semantic retrieval capabilities that legacy database queries simply cannot provide.</div>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>OUR APPROACH</div>
                              <p className={styles.sectionText}><strong>Conversational AI Engine.</strong> The core reasoning layer leverages state-of-the-art Large Language Models (LLMs) combined with advanced Retrieval-Augmented Generation (RAG) over the vetted ADJD corpus. This ensures that every generated answer is directly grounded in official legal texts, eliminating hallucinations and providing exact citations for every response.</p>
                              <br/>
                              <p className={styles.sectionText}><strong>Digital Avatar & Voice Interface.</strong> We integrate a photorealistic digital avatar powered by real-time lipsync technology and low-latency bilingual voice synthesis. This provides an accessible, human-like interface for citizens who may struggle with dense text, drastically improving the approachability of legal services.</p>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>ARCHITECTURE DIAGRAM</div>
                              <div className={styles.architectureDiagramWrapper}>
                                <div className={styles.architectureLayer}>
                                  <p className={styles.architectureLayerTitle}>CLIENT LAYER</p>
                                  <div className={styles.architectureBoxContainer}>
                                    <div className={styles.architectureBox}>Web Portal UI</div>
                                    <div className={styles.architectureBox}>Mobile App UI</div>
                                  </div>
                                </div>
                                <div className={styles.architectureConnector}>↓ HTTPS / API Gateway</div>
                                <div className={styles.architectureLayer}>
                                  <p className={styles.architectureLayerTitle}>API LAYER</p>
                                  <div className={styles.architectureBoxContainer}>
                                    <div className={styles.architectureBox}>Avatar Service API</div>
                                    <div className={styles.architectureBox}>RAG / LLM Orchestrator</div>
                                  </div>
                                </div>
                              </div>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>SCOPE COVERAGE</div>
                              <ul className={styles.checkList}>
                                <li>✅ Custom LLM fine-tuning and prompt engineering specifically optimized for UAE Federal Law and ADJD local regulations.</li>
                                <li>✅ Real-time bilingual (Arabic/English) voice interaction with dynamic language switching and sub-second latency.</li>
                                <li>✅ Real-time photorealistic avatar streaming with localized cultural attire and context-aware conversational gestures.</li>
                                <li>✅ Automated corpus ingestion pipelines to keep the legal database updated continuously without system downtime.</li>
                              </ul>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>ASSUMPTIONS & DEPENDENCIES</div>
                              <ul className={styles.checkList}>
                                <li>✅ API rate limits and concurrency caps from the external avatar streaming provider remain scalable to at least 1,000 concurrent sessions.</li>
                                <li>✅ ADJD supplies the fully vetted, translated, and structured XML/JSON formatted legal corpus no later than Project Week 2.</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Nested UC2 */}
                        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '24px' }}>UC2 — Smart Case Filing Portal</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                              <div className={styles.ucSectionTitle}>PROBLEM UNDERSTANDING</div>
                              <div className={styles.problemCard}>Citizens often cannot afford specialized legal counsel to accurately categorize their legal cases or determine the correct jurisdiction, leading to a high rate of rejected filings and massive friction.</div>
                              <div className={styles.problemCard}>Manual case triage and document verification result in extremely high operational overhead, forcing court staff to spend thousands of hours manually reviewing simple errors rather than focusing on complex processing.</div>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>OUR APPROACH</div>
                              <p className={styles.sectionText}><strong>AI Case Triage & Routing.</strong> We use sophisticated NLP models trained on a decade of historical case metadata to suggest the appropriate case classification based purely on natural language citizen descriptions. The AI guides the user step-by-step, predicting the exact sub-category and required fees.</p>
                              <br/>
                              <p className={styles.sectionText}><strong>Dynamic Form Engine.</strong> Our React-based progressive disclosure forms dynamically adapt the required fields, questions, and document upload slots based on the AI-classified case type in real time. This ensures citizens are only ever asked for relevant information, completely eliminating confusion.</p>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>ARCHITECTURE DIAGRAM</div>
                              <div className={styles.architectureDiagramWrapper}>
                                <div className={styles.architectureLayer}>
                                  <p className={styles.architectureLayerTitle}>CLIENT LAYER</p>
                                  <div className={styles.architectureBoxContainer}>
                                    <div className={styles.architectureBox}>React Web Application</div>
                                  </div>
                                </div>
                                <div className={styles.architectureConnector}>↓ HTTPS / REST APIs</div>
                                <div className={styles.architectureLayer}>
                                  <p className={styles.architectureLayerTitle}>API LAYER</p>
                                  <div className={styles.architectureBoxContainer}>
                                    <div className={styles.architectureBox}>Node.js API Gateway</div>
                                    <div className={styles.architectureBox}>Legacy SOAP Bridge</div>
                                  </div>
                                </div>
                              </div>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>SCOPE COVERAGE</div>
                              <ul className={styles.checkList}>
                                <li>✅ AI-driven preliminary case classification achieving at least 92% confidence based on historical benchmarking data.</li>
                                <li>✅ Secure, chunked document upload service with automated OCR validation for UAE ID and Passport scans.</li>
                                <li>✅ Seamless, bidirectional integration with the legacy ADJD CMS via enterprise SOAP bridges and dedicated message queues.</li>
                                <li>✅ Built-in UAE Pass authentication integration for instant citizen identity verification and secure digital signatures.</li>
                              </ul>
                            </div>
    
                            <div>
                              <div className={styles.ucSectionTitle}>ASSUMPTIONS & DEPENDENCIES</div>
                              <ul className={styles.checkList}>
                                <li>✅ Existing legacy SOAP endpoints remain completely stable, well-documented, and do not undergo breaking changes during the implementation phase.</li>
                                <li>✅ UAE Pass staging environments and API credentials will be provisioned by the relevant authorities without significant bureaucratic delays.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 5: Deliverables */}
                    <div className={styles.proposalCard}>
                      <div className={styles.proposalCardHeader}>
                        <div className={styles.cardHeaderFlex}>
                          <div className={styles.cardHeaderLeft}>
                            <h3>Deliverables</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <button className={styles.iconBtn} onClick={() => setEditingSection('deliverables')} title="Edit Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button className={styles.iconBtn} onClick={() => setShowRegenerateModal(true)} title="Regenerate Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.proposalCardBody}>
                        {editingSection === 'deliverables' ? (
                          <div>
                            <textarea 
                              className={styles.editTextArea} 
                              defaultValue="• Fully documented source code stored in a secure, ADJD-hosted Git repository, complete with comprehensive inline comments and architectural decision records (ADRs).&#10;• Complete Infrastructure as Code (IaC) Terraform and Ansible scripts for repeatable, automated deployments across staging and production environments.&#10;• Comprehensive Administrator, Operations, and User Manuals, including video walkthroughs and standard operating procedures (SOPs) for the L1 support team.&#10;• A fully populated Postman API collection covering all microservices, complete with mock data payloads and automated test assertions."
                            />
                            <div className={styles.editActions}>
                              <button className={styles.ctaSecondary} onClick={() => setEditingSection(null)}>Discard</button>
                              <button className={styles.ctaPrimary} onClick={() => setEditingSection(null)}>Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          <ul className={styles.checkList}>
                            <li>✅ Fully documented source code stored in a secure, ADJD-hosted Git repository, complete with comprehensive inline comments and architectural decision records (ADRs).</li>
                            <li>✅ Complete Infrastructure as Code (IaC) Terraform and Ansible scripts for repeatable, automated deployments across staging and production environments.</li>
                            <li>✅ Comprehensive Administrator, Operations, and User Manuals, including video walkthroughs and standard operating procedures (SOPs) for the L1 support team.</li>
                            <li>✅ A fully populated Postman API collection covering all microservices, complete with mock data payloads and automated test assertions.</li>
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Card 6: Risks & Mitigations */}
                    <div className={styles.proposalCard}>
                      <div className={styles.proposalCardHeader}>
                        <div className={styles.cardHeaderFlex}>
                          <div className={styles.cardHeaderLeft}>
                            <h3>Risks & Mitigations</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <button className={styles.iconBtn} onClick={() => setEditingSection('risks')} title="Edit Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button className={styles.iconBtn} onClick={() => setShowRegenerateModal(true)} title="Regenerate Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.proposalCardBody}>
                        {editingSection === 'risks' ? (
                          <div>
                            <textarea 
                              className={styles.editTextArea} 
                              defaultValue="Risk: Unpredictable vendor API instability or latency spikes from the external avatar provider during peak hours.&#10;Mitigation: We will implement an aggressive circuit-breaker pattern and Redis-based semantic caching. If the avatar streaming service degrades, the UI will gracefully fall back to a standard text-based chat interface to ensure zero interruption of service.&#10;&#10;Risk: Extended delays in receiving the cleansed Arabic legal corpus from internal stakeholders.&#10;Mitigation: We will develop the entire RAG pipeline using a synthetic, anonymized dummy corpus during the first month, allowing the engineering team to finalize the infrastructure independently of the content delivery."
                            />
                            <div className={styles.editActions}>
                              <button className={styles.ctaSecondary} onClick={() => setEditingSection(null)}>Discard</button>
                              <button className={styles.ctaPrimary} onClick={() => setEditingSection(null)}>Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={styles.sectionText}><strong>Risk:</strong> Unpredictable vendor API instability or latency spikes from the external avatar provider during peak hours.<br/><strong>Mitigation:</strong> We will implement an aggressive circuit-breaker pattern and Redis-based semantic caching. If the avatar streaming service degrades, the UI will gracefully fall back to a standard text-based chat interface to ensure zero interruption of service.</p>
                            <br/>
                            <p className={styles.sectionText}><strong>Risk:</strong> Extended delays in receiving the cleansed Arabic legal corpus from internal stakeholders.<br/><strong>Mitigation:</strong> We will develop the entire RAG pipeline using a synthetic, anonymized dummy corpus during the first month, allowing the engineering team to finalize the infrastructure independently of the content delivery.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 7: Case Studies */}
                    <div className={styles.proposalCard}>
                      <div className={styles.proposalCardHeader}>
                        <div className={styles.cardHeaderFlex}>
                          <div className={styles.cardHeaderLeft}>
                            <h3>Case Studies</h3>
                          </div>
                          <div className={styles.cardHeaderRight}>
                            <button className={styles.iconBtn} onClick={() => setEditingSection('caseStudies')} title="Edit Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button className={styles.iconBtn} onClick={() => setShowRegenerateModal(true)} title="Regenerate Section">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.proposalCardBody}>
                        {editingSection === 'caseStudies' ? (
                          <div>
                            <textarea 
                              className={styles.editTextArea} 
                              defaultValue="Ministry of Justice AI Transformation: We successfully deployed a conversational retrieval agent for the MoJ, deeply integrated with their legacy CMS. This resulted in a 65% reduction in average legal query resolution time across 200,000 yearly users, saving an estimated 15,000 man-hours annually and dramatically improving citizen satisfaction.&#10;&#10;Smart Government Citizen Portal: We completely rebuilt the core citizen service portal using our proprietary dynamic forms engine and AI OCR validation. This modernization led to a 40% drop in rejected applications due to automated validations, and increased citizen satisfaction scores from 3.2 to 4.8 out of 5 across all digital channels."
                            />
                            <div className={styles.editActions}>
                              <button className={styles.ctaSecondary} onClick={() => setEditingSection(null)}>Discard</button>
                              <button className={styles.ctaPrimary} onClick={() => setEditingSection(null)}>Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={styles.sectionText}><strong>Ministry of Justice AI Transformation:</strong> We successfully deployed a conversational retrieval agent for the MoJ, deeply integrated with their legacy CMS. This resulted in a 65% reduction in average legal query resolution time across 200,000 yearly users, saving an estimated 15,000 man-hours annually and dramatically improving citizen satisfaction.</p>
                            <br/>
                            <p className={styles.sectionText}><strong>Smart Government Citizen Portal:</strong> We completely rebuilt the core citizen service portal using our proprietary dynamic forms engine and AI OCR validation. This modernization led to a 40% drop in rejected applications due to automated validations, and increased citizen satisfaction scores from 3.2 to 4.8 out of 5 across all digital channels.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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
      {showRegenerateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3>Regenerate Section</h3>
            <textarea 
              className={styles.modalInput}
              placeholder="E.g., Make it sound more technical..."
              value={regenPrompt}
              onChange={(e) => setRegenPrompt(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.ctaSecondary} onClick={() => setShowRegenerateModal(false)}>Cancel</button>
              <button className={styles.ctaPrimary} onClick={() => {
                setShowRegenerateModal(false)
                setRegenPrompt("")
              }}>Regenerate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
