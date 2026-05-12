import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store'
import { ToastContainer } from '@/components/shared/Toast'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { MobileNav } from '@/components/layout/Navbar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Landing } from '@/pages/Landing'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/pages/Dashboard'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { RepoView } from '@/pages/RepoView'
import { Explore } from '@/pages/Explore'
import { Profile } from '@/pages/Profile'
import { NewRepo } from '@/pages/NewRepo'
import { Contact } from '@/pages/Contact'

export default function App() {
  const { fetchProfile, setUser } = useAuthStore()
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    // Init session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id)
      else setUser(null)
    })

    // Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else setUser(null)
    })

    // Ctrl+K command palette
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handler)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('keydown', handler)
    }
  }, [])

  return (
    <BrowserRouter>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <ToastContainer />
      <MobileNav />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/new-repo" element={
          <ProtectedRoute><NewRepo /></ProtectedRoute>
        } />
        <Route path="/repo/:repoId" element={<RepoView />} />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
