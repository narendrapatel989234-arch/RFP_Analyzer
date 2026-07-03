import React, { useRef } from 'react'
import { X } from 'lucide-react'
import styles from './CapabilitiesModal.module.css'
import pageStyles from '../app/rfp-details/page.module.css'
import {
  ExtractedDocument,
  ExtractionDropzone,
  OutlineNode,
  ParsedOutlineTree,
  ResizableTextarea,
  PendingExtraction
} from './rfp-components'

export interface CapabilitiesModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: number
  onTabChange: (tab: number) => void

  // Tab 0 & 1
  handleExtractionUpload: (f: File, type: 'components' | 'partner') => void
  addComponentsDocs: ExtractedDocument[]
  partnerCapabilitiesDocs: ExtractedDocument[]
  renderExtractedDoc: (doc: ExtractedDocument, type: 'components' | 'partner') => React.ReactNode

  // Tab 2
  formatPromptText: string
  setFormatPromptText: (text: string) => void
  handleFormatFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatAttachedFile: File | null
  setFormatAttachedFile: (file: File | null) => void
  handleGenerateOutline: () => void
  isGeneratingOutline: boolean
  formatBtnLabel: string
  formatFileError: string | null
  outlineVisible: boolean
  outlineData: OutlineNode[]
  setOutlineData: (data: OutlineNode[]) => void
  pendingExtractions: PendingExtraction[]
}

function PendingExtractionCard({ pending }: { pending: PendingExtraction }) {
  const statusText = pending.stage === 1 
    ? 'Uploading...' 
    : (pending.type === 'components' ? 'Extracting Components...' : 
       pending.type === 'partner' ? 'Extracting Capabilities...' : 'Processing Format...');

  return (
    <div className={pageStyles.extractedCard}>
      <div className={pageStyles.extractedCardHeader} style={{ cursor: 'default', display: 'flex', alignItems: 'center', width: '100%', padding: 'var(--space-3) var(--space-4)' }}>
        <div className={pageStyles.extractedCardIcon}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span className={pageStyles.extractedCardName} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pending.file.name}</span>
              <span className={pageStyles.extractedCardSize}>{(pending.file.size / (1024 * 1024)).toFixed(1)} MB</span>
            </div>
            <div className={styles.pendingStatusRight}>
              <div className={styles.spinnerIcon} />
              <span className={styles.statusText}>{statusText}</span>
            </div>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CapabilitiesModal({
  isOpen, onClose, activeTab, onTabChange,
  handleExtractionUpload, addComponentsDocs, partnerCapabilitiesDocs, renderExtractedDoc,
  formatPromptText, setFormatPromptText, handleFormatFileAttach, formatAttachedFile,
  setFormatAttachedFile, handleGenerateOutline, isGeneratingOutline, formatBtnLabel,
  formatFileError, outlineVisible, outlineData, setOutlineData, pendingExtractions
}: CapabilitiesModalProps) {
  const manualFileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Capabilities</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.tabsContainer}>
          {['Components', 'Capabilities', 'Proposal Template Format'].map((tabName, idx) => (
            <button
              key={idx}
              className={`${styles.tabBtn} ${activeTab === idx ? styles.activeTab : ''}`}
              onClick={() => onTabChange(idx)}
            >
              {tabName}
            </button>
          ))}
        </div>
        <div className={styles.contentArea}>
          {activeTab === 0 && (
            <div className={styles.tabSection}>
              <ExtractionDropzone label="Add Components" onDrop={(f) => handleExtractionUpload(f, 'components')} />
              <div className={styles.fileList}>
                {pendingExtractions.filter(p => p.type === 'components').map(p => <PendingExtractionCard key={p.id} pending={p} />)}
                {addComponentsDocs.map(doc => renderExtractedDoc(doc, 'components'))}
              </div>
              {pendingExtractions.filter(p => p.type === 'components').length === 0 && addComponentsDocs.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M10 3h6l4 4v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeOpacity="0.4" />
                      <path d="M6 7h6l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                      <line x1="10" y1="18" x2="16" y2="18" />
                      <path d="M19 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyStateTitle}>No documents uploaded yet</h3>
                  <p className={styles.emptyStateSubtitle}>Uploaded and extracted content will appear here</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div className={styles.tabSection}>
              <ExtractionDropzone label="Add Partner Capabilities" onDrop={(f) => handleExtractionUpload(f, 'partner')} />
              <div className={styles.fileList}>
                {pendingExtractions.filter(p => p.type === 'partner').map(p => <PendingExtractionCard key={p.id} pending={p} />)}
                {partnerCapabilitiesDocs.map(doc => renderExtractedDoc(doc, 'partner'))}
              </div>
              {pendingExtractions.filter(p => p.type === 'partner').length === 0 && partnerCapabilitiesDocs.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M10 3h6l4 4v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeOpacity="0.4" />
                      <path d="M6 7h6l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                      <line x1="10" y1="18" x2="16" y2="18" />
                      <path d="M19 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyStateTitle}>No documents uploaded yet</h3>
                  <p className={styles.emptyStateSubtitle}>Uploaded and extracted content will appear here</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 2 && (
            <div className={styles.tabSection}>
              <div className={pageStyles.promptCard}>
                <label htmlFor="formatTextarea" className="sr-only" style={{ display: 'none' }}>Proposal Format</label>
                <ResizableTextarea
                  id="formatTextarea"
                  className={pageStyles.promptTextarea}
                  placeholder="Add instructions or leave blank to auto-generate…"
                  value={formatPromptText}
                  onChange={(e) => setFormatPromptText(e.target.value)}
                  minHeight={160}
                  renderToolbar={() => (
                    <div className={pageStyles.toolbarRowDividedBetween}>
                      <div className={pageStyles.toolbarLeft}>
                        <input
                          type="file"
                          ref={manualFileInputRef}
                          style={{ display: 'none' }}
                          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                          onChange={handleFormatFileAttach}
                        />
                        <button
                          className={pageStyles.paperclipBtn}
                          onClick={() => manualFileInputRef.current?.click()}
                          aria-label="Attach document"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                          </svg>
                        </button>
                        {formatAttachedFile && (
                          <div className={pageStyles.attachedFile}>
                            <span className={pageStyles.paperclipFileName} title={formatAttachedFile.name}>{formatAttachedFile.name}</span>
                            <button onClick={() => setFormatAttachedFile(null)} aria-label="Remove attachment">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className={pageStyles.toolbarRight}>
                        <button
                          className={pageStyles.smallGenerateBtn}
                          onClick={handleGenerateOutline}
                          disabled={isGeneratingOutline}
                        >
                          {isGeneratingOutline && <div className={pageStyles.buttonSpinner} />}
                          {isGeneratingOutline ? (formatAttachedFile ? 'Extracting...' : 'Generating...') : formatBtnLabel}
                        </button>
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className={styles.fileList}>
                {pendingExtractions.filter(p => p.type === 'format').map(p => <PendingExtractionCard key={p.id} pending={p} />)}
              </div>
              {formatFileError && (
                <div className={pageStyles.errorText} style={{ marginTop: 'var(--space-2)' }}>{formatFileError}</div>
              )}
              {outlineVisible && outlineData.length > 0 && (
                <ParsedOutlineTree data={outlineData} onUpdate={setOutlineData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
