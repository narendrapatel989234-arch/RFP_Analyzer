const fs = require('fs');

let tsx = fs.readFileSync('src/app/know-your-client-v2/page.tsx', 'utf-8');

const oldBlock = `        {/* Section 1.5 - RFP Documents */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <label className={styles.sectionLabel} style={{ marginBottom: 0 }}>RFP Documents</label>
            {dummySupportingDocs.length > 0 && !isFromFunctionalConfirmation && (
              <button
                className={styles.addCapabilitiesBtn}
                onClick={() => supportingDocsInputRef.current?.click()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Document
              </button>
            )}
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              multiple
              ref={supportingDocsInputRef}
              style={{ display: 'none' }}
              onChange={handleAddSupportingDocs}
            />
          </div>

          {dummySupportingDocs.length === 0 ? (
            <div
              className={styles.uploadZone}
              role="button"
              tabIndex={0}
              aria-label="Upload RFP Supporting Documents"
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.length) {
                  const newFileNames = Array.from(e.dataTransfer.files).map(f => f.name)
                  setDummySupportingDocs(prev => [...prev, ...newFileNames])
                  setDocumentsChanged(true)
                }
              }}
              onClick={() => supportingDocsInputRef.current?.click()}
            >
              <div className={styles.uploadIconCircle}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className={styles.uploadText}>
                <span style={{ color: 'var(--text-primary)' }}>Drop files or </span>
                Browse
              </div>
              <div className={styles.uploadHint}>
                PDF, DOCX &amp; Max file size: 25 MB &mdash; multiple files allowed
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)' }}>
              {dummySupportingDocs.map((doc, idx) => (
                <div 
                  key={idx} 
                  className={\`\${styles.fileCard} \${isFromFunctionalConfirmation ? styles.clickableCardHover : ''}\`}
                  onClick={() => isFromFunctionalConfirmation && setPreviewDoc({ name: doc, size: '1.4 MB' })}
                >
                  <div className={styles.fileListItem}>
                    <div className={styles.fileListIconWrapper}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <span className={styles.fileListName}>{doc}</span>
                    {!isFromFunctionalConfirmation && (
                      <button
                        className={styles.trashBtnList}
                        onClick={() => { setDummySupportingDocs(prev => prev.filter((_, i) => i !== idx)); setDocumentsChanged(true); }}
                        aria-label="Remove document"
                      >
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>`;

const newBlock = `        {/* Section 1.5 - RFP Documents */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <label className={styles.sectionLabel} style={{ marginBottom: 0 }}>RFP Documents</label>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              multiple
              ref={supportingDocsInputRef}
              style={{ display: 'none' }}
              onChange={handleAddSupportingDocs}
            />
          </div>

          <div
            className={styles.uploadZone}
            role="button"
            tabIndex={0}
            aria-label="Upload RFP Supporting Documents"
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.length) {
                const newFileNames = Array.from(e.dataTransfer.files).map(f => f.name)
                setDummySupportingDocs(prev => [...prev, ...newFileNames])
                setDocumentsChanged(true)
              }
            }}
            onClick={() => supportingDocsInputRef.current?.click()}
          >
            <div className={styles.uploadIconCircle}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className={styles.uploadText}>
              <span style={{ color: 'var(--text-primary)' }}>Drop files or </span>
              Browse
            </div>
            <div className={styles.uploadHint}>
              PDF, DOCX &amp; Max file size: 25 MB &mdash; multiple files allowed
            </div>
          </div>

          {dummySupportingDocs.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {dummySupportingDocs.map((doc, idx) => (
                <div 
                  key={idx} 
                  className={\`\${styles.fileCard} \${isFromFunctionalConfirmation ? styles.clickableCardHover : ''}\`}
                  onClick={() => isFromFunctionalConfirmation && setPreviewDoc({ name: doc, size: '1.4 MB' })}
                >
                  <div className={styles.fileListItem}>
                    <div className={styles.fileListIconWrapper}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <span className={styles.fileListName}>{doc}</span>
                    {!isFromFunctionalConfirmation && (
                      <button
                        className={styles.trashBtnList}
                        onClick={() => { setDummySupportingDocs(prev => prev.filter((_, i) => i !== idx)); setDocumentsChanged(true); }}
                        aria-label="Remove document"
                      >
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>`;

if (tsx.includes('Section 1.5 - RFP Documents')) {
  tsx = tsx.replace(oldBlock, newBlock);
  fs.writeFileSync('src/app/know-your-client-v2/page.tsx', tsx, 'utf-8');
  console.log("Successfully replaced!");
} else {
  console.log("Could not find block!");
}
