import { useNavigate } from 'react-router-dom'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { DoorOpen, Languages, History, Send, Copy, Feather, Eye, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store'

export function Landing() {
  const nav = useNavigate()
  const { user } = useAuthStore()

  const features = [
    { icon: <DoorOpen size={28} color="#FF4757" />, title: 'Anywhere Door Routing', desc: 'Jump instantly between files, repositories, and code without any lag.' },
    { icon: <Languages size={28} color="#00C9B1" />, title: 'Translation Gummy Syntax', desc: 'Fluently read and write over 30+ programming languages with perfect highlighting.' },
    { icon: <History size={28} color="#FFD700" />, title: 'Time Machine Commits', desc: 'Made a bug? Hop in the time machine drawer and view any past code state.' },
    { icon: <Send size={28} color="#0096FF" />, title: 'Take-Copter Uploads', desc: 'Propel your projects into the cloud pocket instantly with drag-and-drop magic.' },
    { icon: <Copy size={28} color="#9d8fff" />, title: 'Copying Toast Editor', desc: 'Powered by Monaco, making writing and formatting code smooth and delicious.' },
    { icon: <Feather size={28} color="#ff8a94" />, title: 'Small Light UI', desc: 'A beautiful, minified claymorphic interface that stays lightweight.' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <AnimatedBackground />

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px clamp(16px, 5vw, 48px)', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.img 
            src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png" 
            alt="Doraemon" 
            width={52} 
            height={52} 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(0, 150, 255, 0.6)) drop-shadow(0 0 32px rgba(0, 201, 177, 0.4))' }}
          />
          <span style={{ fontFamily: "'Fredoka One'", fontSize: 32, background: 'linear-gradient(135deg,#0096FF,#00C9B1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DoraCode</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary" 
            style={{ padding: '8px 20px', borderRadius: 99, background: 'rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700' }}
            onClick={() => nav('/contact')}
          >
            <HelpCircle size={18} /> Support
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '80px 24px 60px' }}
      >
        <div className="badge badge-blue" style={{ display: 'inline-flex', marginBottom: 24, fontSize: 13 }}>
          🎒 Powered by Doraemon's Magic Pocket
        </div>
        <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1.1, marginBottom: 24 }}>
          <span style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #6dd5ff 50%, #FFD700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(109, 213, 255, 0.3)' }}>
            Code Repositories
          </span>
          <br />
          <span style={{ background: 'linear-gradient(135deg, #FF4757, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(255, 71, 87, 0.3)' }}>
            Powered by Magic
          </span>
        </h1>
        <p style={{ fontSize: 20, color: 'rgba(240,248,255,0.65)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          DoraCode is a Doraemon-themed GitHub clone — store, view, and collaborate on code with a magical claymorphic experience.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 150, 255, 0.5)' }} 
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            onClick={() => nav(user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login')} 
            style={{ padding: '16px 36px', fontSize: 18, borderRadius: 20 }}
          >
            {user ? '🚀 Go to Dashboard' : '🚀 Get Started Free'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} 
            whileTap={{ scale: 0.95 }}
            className="btn-secondary" 
            onClick={() => nav('/explore')} 
            style={{ padding: '16px 36px', fontSize: 18, borderRadius: 20 }}
          >
            <Eye size={20} /> Browse Repos
          </motion.button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: "'Fredoka One'", fontSize: 36, marginBottom: 48, color: 'rgba(240,248,255,0.9)' }}>
          Everything in the Pocket 🎒
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i % 2 === 0 ? 0 : 0.1 }}
              whileHover={{ scale: 1.05, y: -8, rotate: i % 2 === 0 ? 2 : -2 }}
              className="clay-card" 
              style={{ padding: '32px 24px', cursor: 'pointer', textAlign: 'center' }}
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 16, display: 'inline-block' }}
              >
                {f.icon}
              </motion.div>
              <h3 style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 20, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: 'rgba(240,248,255,0.55)', fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '40px 24px 80px' }}
      >
        <div className="clay-card" style={{ display: 'inline-block', padding: '48px 64px', maxWidth: 600 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔵</div>
          <h2 style={{ fontFamily: "'Fredoka One'", fontSize: 32, marginBottom: 12, background: 'linear-gradient(135deg,#0096FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to code magically?
          </h2>
          <p style={{ color: 'rgba(240,248,255,0.5)', marginBottom: 28 }}>Join DoraCode today and store your code in the magic pocket.</p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(0, 150, 255, 0.6)' }} 
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            onClick={() => nav(user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login')} 
            style={{ padding: '16px 40px', fontSize: 18, borderRadius: 20 }}
          >
            {user ? '✨ Enter Dashboard' : '✨ Start Free'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
