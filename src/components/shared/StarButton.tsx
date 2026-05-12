import { useState } from 'react'
import { Star } from 'lucide-react'
import { useToastStore } from '@/store'

interface Props {
  count: number
  starred?: boolean
  onToggle?: () => void
}

export function StarButton({ count, starred = false, onToggle }: Props) {
  const [anim, setAnim] = useState(false)
  const { addToast } = useToastStore()

  const handle = () => {
    setAnim(true)
    setTimeout(() => setAnim(false), 600)
    onToggle?.()
    addToast(starred ? 'Removed from starred ⭐' : 'Added to starred! ⭐', 'success')
  }

  return (
    <button
      className={`star-btn${anim ? ' starred' : ''}`}
      onClick={handle}
      style={{ display: 'flex', alignItems: 'center', gap: 6, color: starred ? '#FFD700' : 'rgba(240,248,255,0.5)', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14 }}
    >
      <Star size={16} fill={starred ? '#FFD700' : 'none'} color={starred ? '#FFD700' : 'currentColor'} />
      {count}
    </button>
  )
}
