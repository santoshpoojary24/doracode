import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GitBranch, Lock, Globe, Upload, FileCode, ChevronRight, Download, Clock, Trash2 } from 'lucide-react'
import { supabase, type Repository, type FileRecord, type Commit } from '@/lib/supabase'
import { useAuthStore, useToastStore } from '@/store'
import { FileTree } from '@/components/repository/FileTree'
import { MonacoWrapper } from '@/components/editor/MonacoWrapper'
import { DropZone } from '@/components/upload/DropZone'
import { Navbar } from '@/components/layout/Navbar'
import { GadgetDrawer } from '@/components/layout/GadgetDrawer'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { DoraemonLoader } from '@/components/shared/DoraemonLoader'
import { LANG_COLORS, timeAgo, detectLanguage, formatBytes } from '@/utils'

export function RepoView() {
  const { repoId } = useParams<{ repoId: string }>()
  const { user } = useAuthStore()
  const { addToast } = useToastStore()
  const nav = useNavigate()
  const [repo, setRepo] = useState<Repository | null>(null)
  const [activeFile, setActiveFile] = useState<FileRecord | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [gadgetOpen, setGadgetOpen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [commitMsg, setCommitMsg] = useState('')
  const [showCommitModal, setShowCommitModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshTree, setRefreshTree] = useState(0)
  const [fileToDelete, setFileToDelete] = useState<FileRecord | null>(null)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!repoId) return
    supabase.from('repositories').select('*, profiles!owner_id(username,avatar_url)').eq('id', repoId).single()
      .then(({ data, error }) => { 
        if (error) {
          console.error('Fetch repo error:', error)
          setErrorMsg(error.message)
        }
        setRepo(data)
        setLoading(false) 
      })
  }, [repoId])

  const openFile = async (f: FileRecord) => {
    setActiveFile(f)
    setFileContent(f.content || '')
    setEditMode(false)
  }

  const saveFile = async () => {
    if (!activeFile || !user || !commitMsg.trim()) return
    const prev = activeFile.content || ''
    await supabase.from('files').update({ content: fileContent, updated_at: new Date().toISOString() }).eq('id', activeFile.id)
    await supabase.from('commits').insert({
      repo_id: repoId,
      file_id: activeFile.id,
      author_id: user.id,
      message: commitMsg,
      previous_content: prev,
      new_content: fileContent,
    })
    await supabase.from('repositories').update({ updated_at: new Date().toISOString() }).eq('id', repoId)
    setShowCommitModal(false)
    setCommitMsg('')
    setEditMode(false)
    addToast('✅ Committed to Doraemon\'s Pocket!', 'success')
  }

  const deleteFile = async () => {
    if (!fileToDelete || !isOwnerOrAdmin) return
    
    // .select().single() ensures we get an error if RLS blocks the deletion and 0 rows are deleted
    const { error } = await supabase.from('files').delete().eq('id', fileToDelete.id).select().single()
    if (error) {
      addToast(`Failed to delete: ${error.message}`, 'error')
    } else {
      addToast(`🗑️ ${fileToDelete.name} deleted!`, 'success')
      if (activeFile?.id === fileToDelete.id) {
        setActiveFile(null)
        setFileContent('')
      }
      setRefreshTree(r => r + 1)
    }
    setFileToDelete(null)
  }

  const downloadFile = () => {
    if (!activeFile) return
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dlName = activeFile.name.toLowerCase().endsWith('.txt') ? activeFile.name : `${activeFile.name}.txt`
    a.href = url; a.download = dlName; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <DoraemonLoader text="Opening repository..." />
  if (errorMsg) return <div style={{ padding: 48, textAlign: 'center', color: '#FF4757' }}>Error: {errorMsg}</div>
  if (!repo) return <div style={{ padding: 48, textAlign: 'center' }}>Repository not found</div>

  const isOwnerOrAdmin = user?.role === 'admin' || (user && repo && user.id === repo.owner_id)
  const lang = activeFile ? detectLanguage(activeFile.name) : ''

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar onGadgetToggle={() => setGadgetOpen(true)} />
        <GadgetDrawer open={gadgetOpen} onClose={() => setGadgetOpen(false)} />

        {/* Repo Header */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 0' }}>
          <div className="clay-card" style={{ padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: 'rgba(240,248,255,0.4)', fontSize: 14 }}>
                    <button onClick={() => nav(user ? '/dashboard' : '/explore')} style={{ background: 'none', border: 'none', color: 'rgba(240,248,255,0.4)', cursor: 'pointer' }}>{user ? 'dashboard' : 'explore'}</button>
                    <ChevronRight size={14} style={{ display: 'inline' }} />
                  </span>
                  <GitBranch size={20} color="#0096FF" />
                  <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 26, color: '#6dd5ff' }}>{repo.name}</h1>
                  {repo.is_private ? <span className="badge badge-red"><Lock size={9} /> Private</span> : <span className="badge badge-teal"><Globe size={9} /> Public</span>}
                </div>
                {repo.description && <p style={{ color: 'rgba(240,248,255,0.5)', fontSize: 14 }}>{repo.description}</p>}
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: 'rgba(240,248,255,0.4)' }}>
                  {repo.language && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span className="lang-dot" style={{ background: LANG_COLORS[repo.language.toLowerCase()] || '#aaa' }} />{repo.language}</span>}
                  <span><Clock size={11} style={{ display: 'inline' }} /> Updated {timeAgo(repo.updated_at)}</span>
                </div>
              </div>
              {isOwnerOrAdmin && (
                <button className="btn-primary" onClick={() => setShowUpload(!showUpload)}>
                  <Upload size={16} /> {showUpload ? 'Close Upload' : 'Upload Files'}
                </button>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          {showUpload && isOwnerOrAdmin && (
            <div className="clay-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Fredoka One'", marginBottom: 16 }}>📦 Upload to Repository</h3>
              <DropZone repoId={repoId!} onComplete={() => { setShowUpload(false); setRefreshTree(r => r + 1) }} />
            </div>
          )}

          {/* Main Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, minHeight: '70vh' }}>
            {/* File Tree */}
            <div className="clay-card" style={{ padding: '12px 8px', height: 'fit-content', position: 'sticky', top: 80 }}>
              <div style={{ padding: '0 8px 12px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 13, color: 'rgba(240,248,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Files
              </div>
              <FileTree repoId={repoId!} activeFileId={activeFile?.id} onFileSelect={openFile} refreshTrigger={refreshTree} />
            </div>

            {/* Editor / Viewer */}
            <div>
              {!activeFile ? (
                <div className="clay-card" style={{ padding: 60, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <FileCode size={64} color="rgba(0,150,255,0.3)" />
                  <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: 'rgba(240,248,255,0.4)' }}>Select a file to view</h3>
                  <p style={{ color: 'rgba(240,248,255,0.25)', fontSize: 14 }}>Browse the file tree on the left</p>
                </div>
              ) : (
                <div className="clay-card" style={{ padding: 20 }}>
                  {/* File Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-blue">{lang}</span>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14 }}>{activeFile.path}</span>
                      {activeFile.size_bytes && <span style={{ fontSize: 12, color: 'rgba(240,248,255,0.35)' }}>{formatBytes(activeFile.size_bytes)}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={downloadFile}>
                        <Download size={12} /> Download
                      </button>
                      {isOwnerOrAdmin && (
                        <>
                          <button className={editMode ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => {
                            if (editMode) setShowCommitModal(true)
                            else setEditMode(true)
                          }}>
                            {editMode ? '💾 Save & Commit' : '✏️ Edit'}
                          </button>
                          {!editMode && (
                            <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 12, marginLeft: 4 }} onClick={() => setFileToDelete(activeFile)}>
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </>
                      )}
                      {editMode && <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setEditMode(false); setFileContent(activeFile.content || '') }}>Cancel</button>}
                    </div>
                  </div>

                  <MonacoWrapper
                    content={fileContent}
                    language={lang}
                    readOnly={!editMode}
                    onChange={setFileContent}
                    height="560px"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Commit Modal */}
      {showCommitModal && (
        <div className="modal-overlay">
          <div className="clay-card modal-content" style={{ padding: 36 }}>
            <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 24, marginBottom: 20 }}>💾 Commit Changes</h3>
            <input className="clay-input" value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} placeholder="Commit message (e.g. 'Fix bug in main.py')" style={{ marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowCommitModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveFile} disabled={!commitMsg.trim()}>🚀 Commit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete File Confirm Modal */}
      {fileToDelete && (
        <div className="modal-overlay">
          <div className="clay-card modal-content" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😮</div>
            <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 24, marginBottom: 8 }}>Delete File?</h3>
            <p style={{ color: 'rgba(240,248,255,0.5)', marginBottom: 28 }}>This will permanently delete <b>{fileToDelete.name}</b> from Doraemon's pocket.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setFileToDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={deleteFile}><Trash2 size={14} /> Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
