import { useNavigate } from 'react-router-dom'
import { Home, Compass, Upload, User, GitBranch, Settings } from 'lucide-react'
import { useAuthStore } from '@/store'
import { motion } from 'framer-motion'

export function Navbar({ onGadgetToggle }: { onGadgetToggle?: () => void }) {
  const { user, signOut } = useAuthStore()
  const nav = useNavigate()

  return (
    <nav className="navbar">
      {/* Logo */}
      <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="logo-svg">
          <motion.img 
            src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png" 
            alt="Doraemon" 
            width={40} 
            height={40} 
            animate={{ y: [0, -4, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: 26, background: 'linear-gradient(135deg, #0096FF, #00C9B1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          DoraCode
        </span>
      </button>

      {/* Nav links */}
      <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/explore')}>
              <Compass size={15} /> Explore
            </button>
            {user.role === 'admin' && (
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/admin')}>
                <Settings size={15} /> Admin
              </button>
            )}
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/dashboard')}>
              <Home size={15} /> Dashboard
            </button>
            <button onClick={onGadgetToggle} style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', padding: '8px 14px', borderRadius: 12, cursor: 'pointer', fontSize: 18 }}>
              🔔
            </button>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/profile')}>
              <User size={15} />
              <span>{user.username}</span>
              {user.role === 'admin' && <span className="badge badge-yellow">Admin</span>}
            </button>
            <button className="btn-danger" style={{ padding: '8px 14px', fontSize: 13 }} onClick={signOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }} onClick={() => nav('/explore')}>
              <Compass size={15} /> Explore
            </button>
            <button className="btn-primary" onClick={() => nav('/login')}>Sign In</button>
          </>
        )}
      </div>
    </nav>
  )
}

export function MobileNav() {
  const { user } = useAuthStore()
  const nav = useNavigate()
  const path = window.location.pathname

  if (!user) return null
  const items = [
    { icon: <Home size={20} />, label: 'Home', path: '/dashboard' },
    { icon: <Compass size={20} />, label: 'Explore', path: '/explore' },
    { icon: <Upload size={20} />, label: 'Upload', path: '/new-repo' },
    { icon: <GitBranch size={20} />, label: 'Repos', path: '/dashboard' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="mobile-nav">
      {items.map((it) => (
        <button key={it.path} className={`mobile-nav-item${path === it.path ? ' active' : ''}`} onClick={() => nav(it.path)}>
          {it.icon}<span>{it.label}</span>
        </button>
      ))}
    </nav>
  )
}
