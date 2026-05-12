import { motion } from 'framer-motion'

export function DoraemonLoader({ text = 'Loading magic...' }: { text?: string }) {
  return (
    <div className="dora-loader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative', zIndex: 10, padding: 40 }}>
      {/* Floating Doraemon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', width: 90, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png" 
          alt="Doraemon" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(0, 150, 255, 0.6))' }}
        />
        {/* Magical spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '3px dashed rgba(0, 201, 177, 0.4)', borderTopColor: '#FFD700', borderBottomColor: '#0096FF', opacity: 0.8 }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '2px dotted rgba(255, 71, 87, 0.4)', opacity: 0.6 }}
        />
      </motion.div>
      
      {/* Text */}
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#6dd5ff', fontSize: 18, letterSpacing: 1, marginTop: 12, textShadow: '0 0 10px rgba(109, 213, 255, 0.5)' }}
      >
        {text}
      </motion.p>
      
      {/* Bouncing Dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i} 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            style={{ 
              width: 10, height: 10, borderRadius: '50%', 
              background: i === 0 ? '#0096FF' : i === 1 ? '#00C9B1' : '#FFD700',
              boxShadow: `0 0 10px ${i === 0 ? '#0096FF' : i === 1 ? '#00C9B1' : '#FFD700'}`
            }} 
          />
        ))}
      </div>
    </div>
  )
}
