import { useState } from 'react'
import { X, Plus, Upload, Search, GitBranch, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props { open: boolean; onClose: () => void }

export function GadgetDrawer({ open, onClose }: Props) {
  const nav = useNavigate()

  const actions = [
    { icon: <Plus size={20} />, label: 'New Repository', color: '#0096FF', path: '/new-repo' },
    { icon: <Upload size={20} />, label: 'Upload Files',  color: '#00C9B1', path: '/upload' },
    { icon: <Search size={20} />, label: 'Search Code',  color: '#FFD700', path: '/explore' },
    { icon: <GitBranch size={20} />, label: 'My Repos',  color: '#9d8fff', path: '/dashboard' },
    { icon: <Zap size={20} />, label: 'Quick Commit',    color: '#FF4757', path: '/dashboard' },
  ]

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(0,0,0,0.3)' }} />}
      <div className={`gadget-drawer${open ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22 }}>🎒</div>
            <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 20, color: '#FFD700' }}>Gadget Drawer</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,248,255,0.5)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(240,248,255,0.4)', marginBottom: 16 }}>Quick actions from Doraemon's pocket</p>
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => { nav(a.path); onClose() }}
            className="clay-card"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', border: 'none', color: 'var(--pocket-white)', textAlign: 'left', marginBottom: 8, animationDelay: `${i * 0.05}s` }}
          >
            <span style={{ color: a.color }}>{a.icon}</span>
            <span style={{ fontFamily: "'Nunito'", fontWeight: 700 }}>{a.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
