import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitBranch, Lock, Globe } from 'lucide-react'
import { useAuthStore, useRepoStore, useToastStore } from '@/store'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { detectLanguage } from '@/utils'

export function NewRepo() {
  const { user } = useAuthStore()
  const { createRepo } = useRepoStore()
  const { addToast } = useToastStore()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const repo = await createRepo({ name, description: desc, is_private: isPrivate, owner_id: user.id, stars: 0, forks: 0 })
      if (repo) {
        addToast(`🎉 Repository "${name}" created!`, 'success')
        nav(`/repo/${repo.id}`)
      }
    } catch {
      addToast('Failed to create repository', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
          <div className="clay-card" style={{ padding: '36px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <GitBranch size={28} color="#0096FF" />
              <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 28 }}>New Repository</h1>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Nunito'", fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Repository Name *</label>
                <input className="clay-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-awesome-project" required />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'Nunito'", fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Description</label>
                <textarea className="clay-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's this repository about?" rows={3} style={{ resize: 'vertical' }} />
              </div>



              <div>
                <label style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'block' }}>Visibility</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[false, true].map((priv) => (
                    <button key={String(priv)} type="button"
                      onClick={() => setIsPrivate(priv)}
                      style={{
                        flex: 1, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Nunito'", fontWeight: 700, fontSize: 14, transition: 'all 0.25s ease',
                        background: isPrivate === priv ? (priv ? 'rgba(255,71,87,0.15)' : 'rgba(0,150,255,0.15)') : 'rgba(255,255,255,0.04)',
                        border: isPrivate === priv ? (priv ? '1.5px solid rgba(255,71,87,0.4)' : '1.5px solid rgba(0,150,255,0.4)') : '1.5px solid rgba(255,255,255,0.08)',
                        color: isPrivate === priv ? (priv ? '#ff8a94' : '#6dd5ff') : 'rgba(240,248,255,0.5)',
                      }}
                    >
                      {priv ? <Lock size={16} /> : <Globe size={16} />}
                      {priv ? 'Private' : 'Public'}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading || !name} style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, marginTop: 8 }}>
                {loading ? '🔄 Creating...' : '🚀 Create Repository'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
