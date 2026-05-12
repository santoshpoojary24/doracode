import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const magicalItems = ['🔔', '🚁', '🚪', '🥞', '🕰️', '🥖']

export function AnimatedBackground() {
  const [items, setItems] = useState<{ id: number; icon: string; x: number; size: number; duration: number; delay: number }[]>([])

  useEffect(() => {
    // Generate random items for the background
    const newItems = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      icon: magicalItems[Math.floor(Math.random() * magicalItems.length)],
      x: Math.random() * 100, // percentage
      size: 20 + Math.random() * 40, // px
      duration: 15 + Math.random() * 30, // seconds
      delay: Math.random() * 10, // seconds
    }))
    setItems(newItems)
  }, [])

  return (
    <div className="bg-animated" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
      {/* Dynamic Magical Items */}
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: '110vh', x: `${item.x}vw`, rotate: 0, opacity: 0.1 }}
          animate={{ 
            y: '-10vh', 
            x: [`${item.x}vw`, `${item.x + 5}vw`, `${item.x - 5}vw`, `${item.x}vw`],
            rotate: 360, 
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ 
            y: { duration: item.duration, repeat: Infinity, ease: 'linear', delay: item.delay },
            x: { duration: item.duration / 2, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
            rotate: { duration: item.duration * 1.5, repeat: Infinity, ease: 'linear', delay: item.delay },
            opacity: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }
          }}
          style={{ position: 'absolute', fontSize: item.size }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Magical Gradient Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(0,150,255,0.08), transparent 50%), radial-gradient(circle at bottom left, rgba(0,201,177,0.08), transparent 50%)' }} />
    </div>
  )
}
