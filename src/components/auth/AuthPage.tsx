import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore, useToastStore } from '@/store'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { motion } from 'framer-motion'
// useAuthStore.getState() lets us read the role synchronously after fetchProfile

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { fetchProfile, user } = useAuthStore()
  const { addToast } = useToastStore()
  const nav = useNavigate()

  useEffect(() => {
    if (user) {
      nav(user.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, nav])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, role: 'viewer' } },
        })
        if (error) throw error

        // If no session, email confirmation is still required
        if (!data.session) {
          addToast('📧 Check your email to confirm your account!', 'info')
          setLoading(false)
          return
        }

        if (data.user) {
          // Trigger auto-creates the profile — just fetch it
          await new Promise((r) => setTimeout(r, 800)) // brief wait for trigger
          await fetchProfile(data.user.id)
          addToast('🎉 Welcome to DoraCode!', 'success')
          const profile = useAuthStore.getState().user
          nav(profile?.role === 'admin' ? '/admin' : '/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.user) {
          await fetchProfile(data.user.id)
          // Read the role directly from store state (synchronous after await)
          const profile = useAuthStore.getState().user
          if (!profile) {
            addToast('❌ Profile not found. Please contact admin.', 'error')
            setLoading(false)
            return
          }
          addToast('👋 Welcome back!', 'success')
          // Navigate based on actual role from DB, not which portal was clicked
          nav(profile.role === 'admin' ? '/admin' : '/dashboard')
        }
      }
    } catch (err: unknown) {
      addToast((err as Error).message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 24 }}>
      <AnimatedBackground />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="clay-card modal-content" 
        style={{ padding: '40px 36px', position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}
      >
        <button 
          onClick={() => nav('/')} 
          style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 8, borderRadius: '50%', color: 'rgba(240,248,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.img 
            src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png" 
            alt="Doraemon" 
            width={72} 
            height={72} 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ margin: '0 auto 12px', display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(0, 150, 255, 0.6)) drop-shadow(0 0 32px rgba(0, 201, 177, 0.4))' }}
          />
          <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 32, background: 'linear-gradient(135deg,#0096FF,#00C9B1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DoraCode</h1>
          <p style={{ color: 'rgba(240,248,255,0.5)', fontSize: 14, marginTop: 4 }}>
            ✨ Welcome to the magical code repository
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 28, gap: 4 }}>
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Nunito'", fontWeight: 700, fontSize: 14, transition: 'all 0.25s ease',
                background: mode === m ? 'linear-gradient(135deg,#0096FF,#0066cc)' : 'none',
                color: mode === m ? 'white' : 'rgba(240,248,255,0.5)',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,248,255,0.35)' }} />
              <input className="clay-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required style={{ paddingLeft: 42 }} />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,248,255,0.35)' }} />
            <input className="clay-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{ paddingLeft: 42 }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,248,255,0.35)' }} />
            <input className="clay-input" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ paddingLeft: 42, paddingRight: 42 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,248,255,0.35)', cursor: 'pointer' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 16px rgba(0, 150, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, marginTop: 4 }}
          >
            {loading ? '🔄 Loading...' : mode === 'signin' ? '🚀 Sign In' : '✨ Create Account'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
