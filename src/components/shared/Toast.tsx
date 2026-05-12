import { useEffect } from 'react'
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '@/store'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ message, type = 'info', onClose }: { message: string; type?: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])

  const icon = type === 'success' ? <CheckCircle size={18} color="#00C9B1" /> : type === 'error' ? <AlertTriangle size={18} color="#FF4757" /> : <Info size={18} color="#0096FF" />
  return (
    <div className="toast">
      {icon}
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,248,255,0.5)', marginLeft: 8 }}>
        <X size={14} />
      </button>
    </div>
  )
}
