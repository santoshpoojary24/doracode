import { useState, useEffect } from 'react'
import { Search, GitBranch, FileCode, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

interface Props { open: boolean; onClose: () => void }

export function CommandPalette({ open, onClose }: Props) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<{ type: string; label: string; sub: string; path: string }[]>([])
  const nav = useNavigate()

  useEffect(() => {
    if (!open) { setQ(''); setResults([]); return }
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      const { data: repos } = await supabase.from('repositories').select('id,name,description').ilike('name', `%${q}%`).limit(5)
      const { data: files } = await supabase.from('files').select('id,name,path,repo_id').ilike('name', `%${q}%`).limit(5)
      setResults([
        ...(repos || []).map((r) => ({ type: 'repo', label: r.name, sub: r.description || '', path: `/repo/${r.id}` })),
        ...(files || []).map((f) => ({ type: 'file', label: f.name, sub: f.path, path: `/repo/${f.repo_id}/file/${f.id}` })),
      ])
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cmd-palette clay-card" onClick={(e) => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={18} color="#0096FF" />
          <input
            autoFocus
            className="clay-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search repos, files, code..."
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 16, boxShadow: 'none' }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,248,255,0.4)', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px 0' }}>
          {results.length === 0 && q && <p style={{ textAlign: 'center', padding: 32, color: 'rgba(240,248,255,0.35)', fontSize: 14 }}>No results found</p>}
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => { nav(r.path); onClose() }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--pocket-white)', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,150,255,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {r.type === 'repo' ? <GitBranch size={16} color="#0096FF" /> : <FileCode size={16} color="#00C9B1" />}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,248,255,0.4)' }}>{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 16, fontSize: 11, color: 'rgba(240,248,255,0.3)' }}>
          <span>↵ to select</span><span>↑↓ navigate</span><span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}
