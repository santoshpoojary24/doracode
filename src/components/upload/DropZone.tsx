import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, X, CheckCircle, File } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore, useToastStore } from '@/store'
import { detectLanguage, formatBytes, getFileIcon } from '@/utils'

interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  id?: string
}

export function DropZone({ repoId, onComplete }: { repoId: string; onComplete?: () => void }) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const { user } = useAuthStore()
  const { addToast } = useToastStore()

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted.map((f) => ({ file: f, progress: 0, status: 'pending' as const }))])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true })

  const uploadAll = async () => {
    if (!user) return
    const pending = files.filter((f) => f.status === 'pending')
    for (const item of pending) {
      setFiles((prev) => prev.map((f) => f.file === item.file ? { ...f, status: 'uploading', progress: 10 } : f))
      try {
        const text = await item.file.text()
        const path = (item.file as File & { webkitRelativePath?: string }).webkitRelativePath || item.file.name
        const lang = detectLanguage(item.file.name)

        setFiles((prev) => prev.map((f) => f.file === item.file ? { ...f, progress: 50 } : f))

        const { data, error } = await supabase.from('files').insert({
          repo_id: repoId,
          name: item.file.name,
          path,
          content: text,
          language: lang,
          size_bytes: item.file.size,
          created_by: user.id,
        }).select().single()

        if (error) throw error

        setFiles((prev) => prev.map((f) => f.file === item.file ? { ...f, status: 'done', progress: 100, id: data.id } : f))
      } catch (err: any) {
        addToast(`Upload failed: ${err.message || 'Unknown error'}`, 'error')
        setFiles((prev) => prev.map((f) => f.file === item.file ? { ...f, status: 'error' } : f))
      }
    }
    addToast(`✅ Uploaded ${pending.length} file(s) to Doraemon's Pocket!`, 'success')
    onComplete?.()
  }

  const remove = (f: File) => setFiles((prev) => prev.filter((x) => x.file !== f))

  return (
    <div>
      <div {...getRootProps()} className={`drop-zone${isDragActive ? ' active' : ''}`}>
        <input {...getInputProps()} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 48, animation: isDragActive ? 'starBounce 0.5s ease infinite' : 'none' }}>
            {isDragActive ? '🎒' : '📦'}
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18 }}>
            {isDragActive ? "Drop files into Doraemon's Pocket!" : 'Drag & Drop files here'}
          </div>
          <p style={{ color: 'rgba(240,248,255,0.5)', fontSize: 13 }}>or tap to browse — all file types supported</p>
          <button className="btn-primary" type="button">
            <CloudUpload size={16} /> Choose Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="clay-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{getFileIcon(f.file.name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.file.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,248,255,0.4)', marginBottom: 6 }}>{formatBytes(f.file.size)}</div>
                {f.status === 'uploading' || f.status === 'done' ? (
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.progress}%` }} /></div>
                ) : null}
              </div>
              {f.status === 'done' && <CheckCircle size={18} color="#00C9B1" />}
              {f.status === 'error' && <span style={{ color: '#FF4757', fontSize: 12 }}>Error</span>}
              {f.status === 'pending' && (
                <button onClick={() => remove(f.file)} style={{ background: 'none', border: 'none', color: 'rgba(240,248,255,0.4)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {files.some((f) => f.status === 'pending') && (
            <div className="upload-btn-row">
              <button className="btn-primary" onClick={uploadAll} style={{ marginTop: 8 }}>
                <CloudUpload size={16} /> Upload {files.filter((f) => f.status === 'pending').length} File(s)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
