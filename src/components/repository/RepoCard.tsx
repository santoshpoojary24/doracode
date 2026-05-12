import { useNavigate } from 'react-router-dom'
import { GitBranch, Lock, Globe, Clock } from 'lucide-react'
import type { Repository } from '@/lib/supabase'
import { LANG_COLORS, timeAgo } from '@/utils'
import { StarButton } from '@/components/shared/StarButton'
import { useAuthStore } from '@/store'

export function RepoCard({ repo, onStar }: { repo: Repository; onStar?: () => void }) {
  const nav = useNavigate()
  const { user } = useAuthStore()

  return (
    <div
      className="clay-card"
      style={{ padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}
      onClick={() => nav(`/repo/${repo.id}`)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch size={18} color="#0096FF" />
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 17, color: '#6dd5ff', wordBreak: 'break-all', paddingRight: 8 }}>{repo.name}</div>
            {(repo as Repository & { profiles?: { username: string } }).profiles?.username && (
              <div style={{ fontSize: 12, color: 'rgba(240,248,255,0.45)' }}>
                by {(repo as Repository & { profiles?: { username: string } }).profiles?.username}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {repo.is_private
            ? <span className="badge badge-red"><Lock size={9} /> Private</span>
            : <span className="badge badge-teal"><Globe size={9} /> Public</span>
          }
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p style={{ fontSize: 13, color: 'rgba(240,248,255,0.6)', lineHeight: 1.5 }}>{repo.description}</p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {repo.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span className="lang-dot" style={{ background: LANG_COLORS[repo.language.toLowerCase()] || '#aaa' }} />
              {repo.language}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'rgba(240,248,255,0.4)' }}>
            <Clock size={11} /> {timeAgo(repo.updated_at)}
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <StarButton count={repo.stars} onToggle={onStar} />
        </div>
      </div>
    </div>
  )
}
