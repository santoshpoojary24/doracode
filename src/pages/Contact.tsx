import { useNavigate } from 'react-router-dom'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { Camera, Mail, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'

export function Contact() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        
        <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => nav(-1)}
            style={{ marginBottom: 24, padding: '8px 16px', fontSize: 14 }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card" 
            style={{ padding: '48px 40px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>📞</div>
            <h1 style={{ fontFamily: "'Fredoka One'", fontSize: 36, marginBottom: 12, background: 'linear-gradient(135deg, #0096FF, #00C9B1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Support Center
            </h1>
            <p style={{ color: 'rgba(240,248,255,0.6)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
              Need help finding your way out of the magic pocket? Reach out to the admin directly!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a 
                href="https://instagram.com/xxiv.sparky" 
                target="_blank" 
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', 
                    background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={24} color="white" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'rgba(240,248,255,0.5)', fontSize: 12, fontFamily: "'Nunito'", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Instagram</div>
                    <div style={{ color: 'white', fontSize: 18, fontFamily: "'Nunito'", fontWeight: 700 }}>@xxiv.sparky</div>
                  </div>
                </motion.div>
              </a>

              <a 
                href="mailto:santoshpoojary2004@gmail.com" 
                style={{ textDecoration: 'none' }}
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', 
                    background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={24} color="white" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'rgba(240,248,255,0.5)', fontSize: 12, fontFamily: "'Nunito'", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Email</div>
                    <div style={{ color: 'white', fontSize: 18, fontFamily: "'Nunito'", fontWeight: 700 }}>santoshpoojary2004@gmail.com</div>
                  </div>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
