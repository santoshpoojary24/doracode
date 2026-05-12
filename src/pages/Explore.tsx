import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase, type Repository } from '@/lib/supabase'
import { RepoCard } from '@/components/repository/RepoCard'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { DoraemonLoader } from '@/components/shared/DoraemonLoader'

export function Explore() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [filtered, setFiltered] = useState<Repository[]>([])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'newest' | 'stars' | 'name'>('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('repositories').select('*, profiles!owner_id(username,avatar_url)').eq('is_private', false).then(({ data }) => {
      setRepos(data || [])
      setFiltered(data || [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let f = repos.filter((r) =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(q.toLowerCase())
    )
    if (sort === 'stars') f = [...f].sort((a, b) => b.stars - a.stars)
    else if (sort === 'name') f = [...f].sort((a, b) => a.name.localeCompare(b.name))
    else f = [...f].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setFiltered(f)
  }, [q, sort, repos])

  if (loading) return <DoraemonLoader text="Exploring repositories..." />

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 40, marginBottom: 8, background: 'linear-gradient(135deg,#0096FF,#00C9B1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Explore Repositories 🔍
            </h1>
            <p style={{ color: 'rgba(240,248,255,0.5)', fontSize: 16 }}>Discover public code from Doraemon's magic pocket</p>
          </div>

          {/* Search & Sort */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,248,255,0.35)' }} />
              <input className="clay-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search repositories..." style={{ paddingLeft: 42 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <SlidersHorizontal size={16} color="rgba(240,248,255,0.4)" />
              {(['newest', 'stars', 'name'] as const).map((s) => (
                <button key={s} onClick={() => setSort(s)} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13, transition: 'all 0.25s ease',
                  background: sort === s ? 'linear-gradient(135deg,#0096FF,#0066cc)' : 'rgba(255,255,255,0.07)',
                  color: sort === s ? 'white' : 'rgba(240,248,255,0.5)',
                }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p style={{ color: 'rgba(240,248,255,0.4)', fontSize: 13, marginBottom: 20 }}>{filtered.length} repositories found</p>

          {filtered.length === 0 ? (
            <div className="clay-card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Fredoka One'", fontSize: 22 }}>No repositories found</h3>
              <p style={{ color: 'rgba(240,248,255,0.4)', marginTop: 8 }}>Try a different search term</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {filtered.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
