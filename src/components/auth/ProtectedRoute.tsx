import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { DoraemonLoader } from '@/components/shared/DoraemonLoader'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, loading } = useAuthStore()

  if (loading) return <DoraemonLoader text="Checking credentials..." />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
