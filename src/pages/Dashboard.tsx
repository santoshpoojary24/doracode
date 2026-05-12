import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, GitBranch, FileCode, Clock, TrendingUp } from 'lucide-react'
import { useAuthStore, useRepoStore } from '@/store'
import { RepoCard } from '@/components/repository/RepoCard'
import { Navbar } from '@/components/layout/Navbar'
import { GadgetDrawer } from '@/components/layout/GadgetDrawer'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { DoraemonLoader } from '@/components/shared/DoraemonLoader'
import { supabase } from '@/lib/supabase'

export function Dashboard() {
  const { user } = useAuthStore()
  const { repos, loading, fetchRepos } = useRepoStore()
  const [gadgetOpen, setGadgetOpen] = useState(false)
  const [fileCount, setFileCount] = useState(0)
  const [commitCount, setCommitCount] = useState(0)
  const nav = useNavigate()

  useEffect(() => {
    if (user) {
      fetchRepos(user.id)
      supabase.from('files').select('id', { count: 'exact' }).then(({ count }) => setFileCount(count || 0))
      supabase.from('commits').select('id', { count: 'exact' }).then(({ count }) => setCommitCount(count || 0))
    }
  }, [user])

  if (loading && repos.length === 0) return <DoraemonLoader text="Loading your repositories..." />

  const stats = [
    { icon: <GitBranch size={24} color="#0096FF" />, label: 'Repositories', value: repos.length },
    { icon: <FileCode size={24} color="#00C9B1" />, label: 'Total Files', value: fileCount },
    { icon: <Clock size={24} color="#FFD700" />, label: 'Commits', value: commitCount },
    { icon: <TrendingUp size={24} color="#9d8fff" />, label: 'Stars Earned', value: repos.reduce((a, r) => a + r.stars, 0) },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar onGadgetToggle={() => setGadgetOpen(true)} />
        <GadgetDrawer open={gadgetOpen} onClose={() => setGadgetOpen(false)} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px clamp(16px, 5vw, 24px)' }}>
          {/* Welcome */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 36, marginBottom: 4 }}>
              Hey, {user?.username}! 👋
            </h1>
            <p style={{ color: 'rgba(240,248,255,0.5)' }}>Welcome to your magic code pocket.</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 40 }}>
            {stats.map((s, i) => (
              <div key={i} className="clay-card stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {s.icon}
                  <span style={{ fontSize: 13, color: 'rgba(240,248,255,0.55)', fontFamily: "'Nunito'" }}>{s.label}</span>
                </div>
                <div className="stat-number">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Repos section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 26 }}>Your Repositories</h2>
            <button className="btn-primary" onClick={() => nav('/new-repo')}>
              <Plus size={16} /> New Repository
            </button>
          </div>

          {repos.length === 0 ? (
            <div className="clay-card" style={{ padding: 'clamp(24px, 8vw, 60px)', textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
              <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 22, marginBottom: 8 }}>No repositories yet</h3>
              <p style={{ color: 'rgba(240,248,255,0.45)', marginBottom: 24 }}>Create your first repository to get started!</p>
              <button className="btn-primary" onClick={() => nav('/new-repo')}>
                <Plus size={16} /> Create Repository
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
