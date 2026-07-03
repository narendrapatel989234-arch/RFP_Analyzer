import React from 'react';
import styles from './ArchitectureDiagram.module.css';

export function ArchitectureDiagram() {
  return (
    <div className={styles.diagramContainer}>
      <div className={styles.diagramTitle}>Insight - AI Court System Architecture</div>
      <div className={styles.diagramSubtitle}>End-to-end architecture for hybrid courtroom sessions</div>

      {/* Layer 1: Court Participants */}
      <div className={`${styles.layerBlock} ${styles.layerBlue}`}>
        <div className={styles.layerHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Court Participants
        </div>
        <div className={styles.layerBody}>
          <div className={styles.participantBox}>
            <svg className={styles.participantIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 13v-2M14 13l-4 4-4-4v-2M14 13l4-4-4-4v2M14 13l4 4-4 4v-2M10 9L6 5M10 9l4-4 4 4v-2"></path><rect x="4" y="19" width="16" height="2"></rect></svg>
            <span className={styles.participantName}>Judge</span>
          </div>
          <div className={styles.participantBox}>
            <svg className={styles.participantIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="14" x2="15" y2="14"></line><line x1="9" y1="10" x2="15" y2="10"></line></svg>
            <span className={styles.participantName}>Court Clerks</span>
          </div>
          <div className={styles.participantBox}>
            <svg className={styles.participantIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span className={styles.participantName}>Attorneys</span>
          </div>
          <div className={styles.participantBox}>
            <svg className={styles.participantIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            <span className={styles.participantName}>Witnesses</span>
          </div>
          <div className={styles.participantBox}>
            <svg className={styles.participantIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span className={styles.participantName}>Remote Observers</span>
          </div>
        </div>
      </div>

      <div className={styles.connector}><div className={styles.connectorLine}></div></div>

      {/* Layer 2: Client Layer */}
      <div className={`${styles.layerBlock} ${styles.layerOrange}`}>
        <div className={styles.layerHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          Client Layer
        </div>
        <div className={styles.layerBody}>
          <div className={styles.nodeBox}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Web Browser</span>
              <span className={styles.nodeSubtext}>React - WebRTC</span>
            </div>
          </div>
          <div className={styles.nodeBox}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Teams/WebEx Bot</span>
              <span className={styles.nodeSubtext}>Conferencing Client</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector}><div className={styles.connectorLine}></div></div>

      {/* Layer 3: Integration & Video */}
      <div className={styles.splitRow}>
        <div className={`${styles.layerBlock} ${styles.layerYellow}`}>
          <div className={styles.layerHeader}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>
            Integration Layer
          </div>
          <div className={styles.layerBody}>
            <div className={styles.nodeBox}>
              <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <div className={styles.nodeContent}>
                <span className={styles.nodeTitle}>Courtroom Integration Gateway</span>
                <span className={styles.nodeSubtext}>Port 8014 • Teams/WebEx APIs - Audio Bridge</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.layerBlock} ${styles.layerGreen}`}>
          <div className={styles.layerHeader}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            Video Layer
          </div>
          <div className={styles.layerBody}>
            <div className={styles.nodeBox}>
              <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              <div className={styles.nodeContent}>
                <span className={styles.nodeTitle}>Video Conferencing Service</span>
                <span className={styles.nodeSubtext}>Port 8015 - LiveKit/Daily.co • WebRTC SFU - Recording - Screen Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector}><div className={styles.connectorLine}></div></div>

      {/* Layer 4: API Gateway */}
      <div className={`${styles.layerBlock} ${styles.layerPink}`}>
        <div className={styles.layerHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
          API Gateway
        </div>
        <div className={styles.layerBody}>
          <div className={styles.nodeBox}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Enhanced BFF</span>
              <span className={styles.nodeSubtext}>Port 8001 • Court Session Mgmt - Video Signaling - WebSocket Coordination</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.connector}><div className={styles.connectorLine}></div></div>

      {/* Layer 5: Core Services */}
      <div className={`${styles.layerBlock} ${styles.layerGrey}`}>
        <div className={styles.layerHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          Core Services
        </div>
        <div className={styles.gridBody}>
          <div className={`${styles.nodeBox} ${styles.nodeGreen}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Enhanced Backend</span>
              <span className={styles.nodeSubtext}>Port 8002 • Session Lifecycle - Case Metadata - Court KMC - Hearing Templates</span>
            </div>
          </div>
          
          <div className={`${styles.nodeBox} ${styles.nodePurple}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Real-Time Transcription</span>
              <span className={styles.nodeSubtext}>Port 8008 • Azure Speech STT - Clarification - Legal Terminology Engine</span>
            </div>
          </div>
          
          <div className={`${styles.nodeBox} ${styles.nodeOrange}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Enhanced Translation</span>
              <span className={styles.nodeSubtext}>Port 8012 • Arabic-English - Legal Glossary - Back-Translation - Pronunciation</span>
            </div>
          </div>
          
          <div className={`${styles.nodeBox} ${styles.nodeBlue}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Agentic Core</span>
              <span className={styles.nodeSubtext}>Port 8009 • Clair AI Assistant - Quick Inserts - Action Items Extraction</span>
            </div>
          </div>
          
          <div className={`${styles.nodeBox} ${styles.nodePurple}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Session Package Generator</span>
              <span className={styles.nodeSubtext}>Port 8015 • Transcript Compilation - Exhibits - Bilingual Export - Integrity</span>
            </div>
          </div>
          
          <div className={`${styles.nodeBox} ${styles.nodeOrange}`}>
            <svg className={styles.nodeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <div className={styles.nodeContent}>
              <span className={styles.nodeTitle}>Case Management</span>
              <span className={styles.nodeSubtext}>Port 8017 • ADJD Case System API - Docket Sync - Center Upload</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
