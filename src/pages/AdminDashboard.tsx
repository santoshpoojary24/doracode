import { useEffect, useState } from 'react'
import { Plus, Users, FileCode, GitCommit, Trash2, Settings, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore, useRepoStore } from '@/store'
import { RepoCard } from '@/components/repository/RepoCard'
import { Navbar } from '@/components/layout/Navbar'
import { GadgetDrawer } from '@/components/layout/GadgetDrawer'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'

interface Stats { repos: number; files: number; users: number; commits: number }

export function AdminDashboard() {
  const { user } = useAuthStore()
  const { repos, fetchRepos, deleteRepo } = useRepoStore()
  const [stats, setStats] = useState<Stats>({ repos: 0, files: 0, users: 0, commits: 0 })
  const [gadgetOpen, setGadgetOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [recentCommits, setRecentCommits] = useState<{ message: string; created_at: string; profiles?: { username: string } }[]>([])
  const nav = useNavigate()

  useEffect(() => {
    fetchRepos()
    const fetchStats = async () => {
      const [r, f, u, c] = await Promise.all([
        supabase.from('repositories').select('id', { count: 'exact' }),
        supabase.from('files').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('commits').select('id', { count: 'exact' }),
      ])
      setStats({ repos: r.count || 0, files: f.count || 0, users: u.count || 0, commits: c.count || 0 })
    }
    const fetchCommits = async () => {
      const { data } = await supabase.from('commits').select('message,created_at,profiles!author_id(username)').order('created_at', { ascending: false }).limit(8)
      setRecentCommits((data || []) as unknown as typeof recentCommits)
    }
    fetchStats()
    fetchCommits()
  }, [])

  const confirmDelete = async () => {
    if (!deleteId) return
    await deleteRepo(deleteId)
    setDeleteId(null)
  }

  const statCards = [
    { icon: <GitCommit size={26} color="#0096FF" />, label: 'Repositories', value: stats.repos, color: '#0096FF' },
    { icon: <FileCode size={26} color="#00C9B1" />, label: 'Files', value: stats.files, color: '#00C9B1' },
    { icon: <Users size={26} color="#FFD700" />, label: 'Users', value: stats.users, color: '#FFD700' },
    { icon: <BarChart3 size={26} color="#9d8fff" />, label: 'Commits', value: stats.commits, color: '#9d8fff' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar onGadgetToggle={() => setGadgetOpen(true)} />
        <GadgetDrawer open={gadgetOpen} onClose={() => setGadgetOpen(false)} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 36 }}>
                Admin Dashboard <span className="badge badge-yellow" style={{ verticalAlign: 'middle', fontSize: 13 }}>🔐 Admin</span>
              </h1>
              <p style={{ color: 'rgba(240,248,255,0.5)', marginTop: 4 }}>Full control over DoraCode's magic pocket</p>
            </div>
            <button className="btn-primary" onClick={() => nav('/new-repo')}>
              <Plus size={16} /> New Repository
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 40 }}>
            {statCards.map((s, i) => (
              <div key={i} className="clay-card stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {s.icon}
                  <span style={{ fontSize: 13, color: 'rgba(240,248,255,0.55)', fontFamily: "'Nunito'" }}>{s.label}</span>
                </div>
                <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            {/* Repos */}
            <div>
              <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 24, marginBottom: 16 }}>All Repositories</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {repos.map((repo) => (
                  <div key={repo.id} style={{ position: 'relative' }}>
                    <RepoCard repo={repo} />
                    <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={(e) => { e.stopPropagation(); nav(`/repo/${repo.id}`) }}>
                        <Settings size={12} /> Manage
                      </button>
                      <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={(e) => { e.stopPropagation(); setDeleteId(repo.id) }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 24, marginBottom: 16 }}>Recent Commits</h2>
              <div className="clay-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentCommits.length === 0 && <p style={{ color: 'rgba(240,248,255,0.35)', fontSize: 13 }}>No commits yet</p>}
                {recentCommits.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 12, borderBottom: i < recentCommits.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0096FF', marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{c.message}</div>
                      <div style={{ fontSize: 11, color: 'rgba(240,248,255,0.35)' }}>
                        {(c as typeof recentCommits[0] & { profiles?: { username: string } }).profiles?.username} · {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="clay-card modal-content" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😮</div>
            <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 24, marginBottom: 8 }}>Delete Repository?</h3>
            <p style={{ color: 'rgba(240,248,255,0.5)', marginBottom: 28 }}>This will permanently delete the repo and all its files from Doraemon's pocket.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}><Trash2 size={14} /> Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
