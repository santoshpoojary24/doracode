import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, GitBranch, Calendar, Edit3, Save, LogOut, Camera } from 'lucide-react'
import { useAuthStore } from '@/store'
import { supabase, type Repository } from '@/lib/supabase'
import { RepoCard } from '@/components/repository/RepoCard'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { timeAgo } from '@/utils'

export function Profile() {
  const { user, fetchProfile, signOut } = useAuthStore()
  const [repos, setRepos] = useState<Repository[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nav = useNavigate()

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!user) return
    setBio(user.bio || '')
    setUsername(user.username || '')
    setAvatarUrl(user.avatar_url || '')
    supabase.from('repositories').select('*').eq('owner_id', user.id).then(({ data }) => setRepos(data || []))
  }, [user])

  const saveProfile = async () => {
    if (!user) return
    await supabase.from('profiles').update({ bio, username, avatar_url: avatarUrl }).eq('id', user.id)
    await fetchProfile(user.id)
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
          {/* Profile Card */}
          <div className="clay-card" style={{ padding: '24px', marginBottom: 32, display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar with camera button */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #0096FF, #00C9B1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, overflow: 'hidden' }}>
                {(isEditing ? avatarUrl : user.avatar_url) ? (
                  <img src={isEditing ? avatarUrl : user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={40} color="white" />
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0096FF,#00C9B1)', border: '2px solid rgba(10,22,40,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Camera size={15} color="white" />
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input className="clay-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ fontSize: 20, fontFamily: "'Fredoka One'" }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 14, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                    <Camera size={16} color="rgba(240,248,255,0.5)" />
                    <span style={{ fontSize: 14, color: 'rgba(240,248,255,0.5)' }}>{avatarUrl ? '✅ Photo selected — tap to change' : '📷 Tap to upload profile photo from device'}</span>
                  </div>
                  <textarea className="clay-input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} style={{ resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={saveProfile}><Save size={14} /> Save Profile</button>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 32, margin: 0 }}>{user.username}</h1>
                    {user.role === 'admin' && <span className="badge badge-yellow">🔐 Admin</span>}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setIsEditing(true)}>
                        <Edit3 size={12} /> Edit Profile
                      </button>
                      <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={signOut}>
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(240,248,255,0.4)', fontSize: 13, display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span><Calendar size={12} style={{ display: 'inline' }} /> Joined {timeAgo(user.created_at)}</span>
                    <span><GitBranch size={12} style={{ display: 'inline' }} /> {repos.length} repositories</span>
                  </div>
                  <p style={{ color: 'rgba(240,248,255,0.6)', fontSize: 15, lineHeight: 1.6 }}>
                    {user.bio || 'No bio yet. Click edit to add one!'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Repos */}
          <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 26, marginBottom: 20 }}>Repositories</h2>
          {repos.length === 0 ? (
            <div className="clay-card" style={{ padding: 48, textAlign: 'center' }}>
              <p style={{ color: 'rgba(240,248,255,0.4)' }}>No repositories yet</p>
              {user.role === 'admin' && <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => nav('/new-repo')}>Create Repository</button>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {repos.map((r) => <RepoCard key={r.id} repo={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
