import sys

def patch():
    with open('src/app/rfp-details/page.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    interfaces_and_dropzone = '''
interface TableRow {
  id: string;
  name: string;
  description: string;
}

interface ExtractedDocument {
  id: string;
  file: File;
  description: string;
  tableData: TableRow[];
  isExpanded: boolean;
  isEditing?: boolean;
}

function ExtractionDropzone({ label, onDrop }: { label: string, onDrop: (f: File) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) {
      onDrop(e.dataTransfer.files[0])
    }
  }
  return (
    <div
      className={"" + styles.uploadZone + (isDragging ? " " + styles.isDragging : "")}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
      onDrop={handleDrop}
      onClick={() => fileInputRef?.current?.click()}
      role="button"
      tabIndex={0}
      aria-label={Upload }
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        onChange={(e) => { if (e.target.files?.length) onDrop(e.target.files[0]); e.target.value = '' }}
      />
      <div className={styles.uploadIconCircle}>
        <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div className={styles.uploadText}>
        <span style={{ color: 'var(--text-primary)' }}>Drop file or </span>
        Browse
      </div>
      <div className={styles.hintText}>
        Format: PDF, DOCX, DOC &amp; Max file size: 25 MB
      </div>
    </div>
  )
}

export default function RFPDetailsPage() {
'''.strip() + '\n'

    content = content.replace('export default function RFPDetailsPage() {\n', interfaces_and_dropzone)

    old_state_str = '''
  const [capabilityDocs, setCapabilityDocs] = useState<File[]>([])
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [addComponentsDocs, setAddComponentsDocs] = useState<File[]>([])
  const [partnerCapabilitiesDocs, setPartnerCapabilitiesDocs] = useState<File[]>([])
'''.strip('\n')

    new_state_str = '''
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [addComponentsDocs, setAddComponentsDocs] = useState<ExtractedDocument[]>([])
  const [partnerCapabilitiesDocs, setPartnerCapabilitiesDocs] = useState<ExtractedDocument[]>([])
  const [extractionModal, setExtractionModal] = useState<{
    isOpen: boolean;
    stage: 1 | 2;
    type: 'components' | 'partner' | null;
    file: File | null;
  }>({ isOpen: false, stage: 1, type: null, file: null })
  
  const handleExtractionUpload = (file: File, type: 'components' | 'partner') => {
    setExtractionModal({ isOpen: true, stage: 1, type, file })
    setTimeout(() => {
      setExtractionModal(prev => ({ ...prev, stage: 2 }))
      setTimeout(() => {
        setExtractionModal({ isOpen: false, stage: 1, type: null, file: null })
        const newDoc: ExtractedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          isExpanded: false,
          isEditing: false,
          description: type === 'components' 
            ? "Cortes is Inception42's unified platform for building, running, and scaling AI agents across the G42 product portfolio. It provides a common, secure, sovereign-capable foundation for agent infrastructure."
            : "PartnerX is a certified cloud and AI systems integrator with deep expertise across enterprise transformation programmes.",
          tableData: type === 'components' 
            ? [
                { id: '1', name: 'Infrastructure Orchestration', description: '' },
                { id: '2', name: 'Enterprise RAG Framework', description: '' },
                { id: '3', name: 'Agent Orchestration', description: '' },
                { id: '4', name: 'Identity and Access Management', description: '' },
                { id: '5', name: 'Data Foundation and Lakehouse', description: '' }
              ]
            : [
                { id: '1', name: 'Cloud Migration', description: '' },
                { id: '2', name: 'DevOps Transformation', description: '' },
                { id: '3', name: 'AI Integration', description: '' },
                { id: '4', name: 'Data Engineering', description: '' },
                { id: '5', name: 'Security & Compliance', description: '' }
              ]
        }
        if (type === 'components') {
          setAddComponentsDocs(prev => [...prev, newDoc])
        } else {
          setPartnerCapabilitiesDocs(prev => [...prev, newDoc])
        }
      }, 2500)
    }, 2000)
  }

  const updateTableData = (type: 'components' | 'partner', docId: string, rowId: string, field: 'name' | 'description', value: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        tableData: doc.tableData.map(row => {
          if (row.id !== rowId) return row;
          return { ...row, [field]: value }
        })
      }
    }))
  }

  const addTableRow = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        tableData: [...doc.tableData, { id: Math.random().toString(36).substr(2, 9), name: '', description: '' }]
      }
    }))
  }

  const toggleDocExpanded = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, isExpanded: !doc.isExpanded }
    }))
  }

  const deleteDoc = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.filter(doc => doc.id !== docId))
  }

  const toggleEditMode = (type: 'components' | 'partner', docId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, isEditing: !doc.isEditing }
    }))
  }

  const deleteTableRow = (type: 'components' | 'partner', docId: string, rowId: string) => {
    const setter = type === 'components' ? setAddComponentsDocs : setPartnerCapabilitiesDocs;
    setter(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return { ...doc, tableData: doc.tableData.filter(r => r.id !== rowId) }
    }))
  }

  const renderExtractedDoc = (doc: ExtractedDocument, type: 'components' | 'partner') => {
    const tableLabel = type === 'components' ? 'Component List' : 'Capability List'
    return (
      <div key={doc.id} className={styles.extractedCard}>
        <div className={styles.extractedCardHeader} onClick={() => toggleDocExpanded(type, doc.id)}>
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
            <span className={styles.extractedCardName}>{doc.file.name}</span>
            <span className={styles.extractedCardSize}>{(doc.file.size / (1024*1024)).toFixed(1)} MB</span>
          </div>
          <button className={styles.extractedCardDeleteBtn} onClick={(e) => { e.stopPropagation(); deleteDoc(type, doc.id) }} aria-label="Delete document">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
          <div className={"" + styles.extractedCardChevron + (doc.isExpanded ? " " + styles.extractedCardChevronOpen : "")}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        
        {doc.isExpanded && (
          <div className={styles.extractedCardBody}>
            <div className={styles.extractedCardSection}>
              <h4 className={styles.extractedCardDescTitle}>Description</h4>
              <p className={styles.extractedCardDescText}>{doc.description}</p>
            </div>
            
            <div className={styles.extractedCardSection}>
              <div className={styles.extractedCardTableTitleRow}>
                <h4 className={styles.extractedCardTableTitle}>{tableLabel}</h4>
                <button className={styles.extractedCardAddBtn} onClick={() => toggleEditMode(type, doc.id)}>
                  {doc.isEditing ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <table className={styles.extractedCardTable}>
                <thead>
                  <tr>
                    <th className={styles.extractedCardTh}>Name</th>
                    <th className={styles.extractedCardTh}>Description</th>
                    {doc.isEditing && <th className={styles.extractedCardTh} style={{ width: '40px' }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {doc.tableData.map(row => (
                    <tr key={row.id}>
                      <td className={styles.extractedCardTd} style={{ padding: doc.isEditing ? '0' : 'var(--space-2) 0' }}>
                        {doc.isEditing ? (
                          <input 
                            className={styles.extractedCardInput} 
                            value={row.name}
                            onChange={(e) => updateTableData(type, doc.id, row.id, 'name', e.target.value)}
                            placeholder="Enter name"
                          />
                        ) : (
                          <span className={styles.extractedCardDescText}>{row.name}</span>
                        )}
                      </td>
                      <td className={styles.extractedCardTd} style={{ padding: doc.isEditing ? '0' : 'var(--space-2) 0' }}>
                        {doc.isEditing ? (
                          <input 
                            className={styles.extractedCardInput} 
                            value={row.description}
                            onChange={(e) => updateTableData(type, doc.id, row.id, 'description', e.target.value)}
                            placeholder="Enter description"
                          />
                        ) : (
                          <span className={styles.extractedCardDescText}>{row.description}</span>
                        )}
                      </td>
                      {doc.isEditing && (
                        <td className={styles.extractedCardTd} style={{ textAlign: 'right' }}>
                          <button className={styles.extractedCardDeleteBtn} onClick={() => deleteTableRow(type, doc.id, row.id)} style={{ padding: '4px', background: 'none', color: 'var(--text-tertiary)' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--status-error-text)'; e.currentTarget.style.backgroundColor = 'var(--status-error-bg)' }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {doc.isEditing && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <button className={styles.extractedCardAddBtn} onClick={() => addTableRow(type, doc.id)}>+ Add row</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
'''

    content = content.replace(old_state_str, new_state_str)
    
    old_handle_clear = '''
  const handleClearAll = () => {
    setUploadedDoc(null)
    setPromptText('')
    setCapabilityDocs([])
    setSupportingDocs([])
    setAddComponentsDocs([])
    setPartnerCapabilitiesDocs([])
'''
    new_handle_clear = '''
  const handleClearAll = () => {
    setUploadedDoc(null)
    setPromptText('')
    setSupportingDocs([])
    setAddComponentsDocs([])
    setPartnerCapabilitiesDocs([])
'''
    content = content.replace(old_handle_clear.strip('\n'), new_handle_clear.strip('\n'))
    
    old_log = '''
      capabilityDocs,
      supportingDocs,
'''
    new_log = '''
      supportingDocs,
'''
    content = content.replace(old_log, new_log)
    
    old_jsx = '''
        {/* Section 3 - Upload Documents */}
        <MultiUploadZone
          label="Capability Documents"
          files={capabilityDocs}
          setFiles={setCapabilityDocs}
        />
        <MultiUploadZone
          label="Supporting Documents"
          files={supportingDocs}
          setFiles={setSupportingDocs}
        />

        {/* Section 3.1 - Add Components */}
        <MultiUploadZone 
          label="Add Components" 
          files={addComponentsDocs} 
          setFiles={setAddComponentsDocs} 
        />

        {/* Section 3.2 - Add Partner Capabilities */}
        <MultiUploadZone 
          label="Add Partner Capabilities" 
          files={partnerCapabilitiesDocs} 
          setFiles={setPartnerCapabilitiesDocs} 
        />
'''

    new_jsx = '''
        {/* Section 3 - Upload Documents */}
        <MultiUploadZone
          label="Supporting Documents"
          files={supportingDocs}
          setFiles={setSupportingDocs}
        />

        {/* Section 3.1 - Add Components */}
        <section>
          <label className={styles.sectionLabel}>Add Components</label>
          <ExtractionDropzone label="Add Components" onDrop={(f) => handleExtractionUpload(f, 'components')} />
          {addComponentsDocs.map(doc => renderExtractedDoc(doc, 'components'))}
        </section>

        {/* Section 3.2 - Add Partner Capabilities */}
        <section>
          <label className={styles.sectionLabel}>Add Partner Capabilities</label>
          <ExtractionDropzone label="Add Partner Capabilities" onDrop={(f) => handleExtractionUpload(f, 'partner')} />
          {partnerCapabilitiesDocs.map(doc => renderExtractedDoc(doc, 'partner'))}
        </section>
'''
    content = content.replace(old_jsx.strip('\n'), new_jsx.strip('\n'))

    modal = '''
        {extractionModal.isOpen && (
          <div className={styles.extractionModalOverlay}>
            <div className={styles.extractionModalCard}>
              <div className={styles.extractionModalSpinner}></div>
              <div className={styles.extractionModalText}>
                {extractionModal.stage === 1 
                  ? "Uploading document..." 
                  : (extractionModal.type === 'components' ? "Extracting components..." : "Extracting capabilities...")}
              </div>
            </div>
          </div>
        )}
      </main>
'''
    content = content.replace('      </main>', modal.strip('\n'))

    with open('src/app/rfp-details/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Done")

patch()
