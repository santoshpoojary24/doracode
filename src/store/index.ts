import { create } from 'zustand'
import { supabase, type Profile } from '@/lib/supabase'

interface AuthState {
  user: Profile | null
  loading: boolean
  setUser: (u: Profile | null) => void
  signOut: () => Promise<void>
  fetchProfile: (id: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  fetchProfile: async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    set({ user: data, loading: false })
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))

// ── Repo Store ──
import type { Repository } from '@/lib/supabase'

interface RepoState {
  repos: Repository[]
  loading: boolean
  fetchRepos: (ownerId?: string) => Promise<void>
  createRepo: (data: Partial<Repository>) => Promise<Repository | null>
  deleteRepo: (id: string) => Promise<void>
  starRepo: (repoId: string, userId: string, starred: boolean) => Promise<void>
}

export const useRepoStore = create<RepoState>((set) => ({
  repos: [],
  loading: false,
  fetchRepos: async (ownerId) => {
    set({ loading: true })
    let q = supabase.from('repositories').select('*, profiles!owner_id(username, avatar_url)').order('updated_at', { ascending: false })
    if (ownerId) q = q.eq('owner_id', ownerId)
    const { data } = await q
    set({ repos: data || [], loading: false })
  },
  createRepo: async (data) => {
    const { data: repo } = await supabase.from('repositories').insert(data).select().single()
    if (repo) set((s) => ({ repos: [repo, ...s.repos] }))
    return repo
  },
  deleteRepo: async (id) => {
    await supabase.from('repositories').delete().eq('id', id)
    set((s) => ({ repos: s.repos.filter((r) => r.id !== id) }))
  },
  starRepo: async (repoId, userId, starred) => {
    if (starred) {
      await supabase.from('stars').delete().eq('repo_id', repoId).eq('user_id', userId)
      await supabase.from('repositories').update({ stars: supabase.rpc('decrement_stars', { repo_id: repoId }) }).eq('id', repoId)
    } else {
      await supabase.from('stars').insert({ repo_id: repoId, user_id: userId })
      await supabase.from('repositories').update({ stars: supabase.rpc('increment_stars', { repo_id: repoId }) }).eq('id', repoId)
    }
  },
}))

// ── Toast Store ──
interface Toast { id: string; message: string; type?: 'info' | 'success' | 'error' }
interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
