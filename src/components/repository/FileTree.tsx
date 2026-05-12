import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'
import { supabase, type FileRecord } from '@/lib/supabase'
import { getFileIcon } from '@/utils'

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
  file?: FileRecord
}

function buildTree(files: FileRecord[]): TreeNode[] {
  const root: TreeNode[] = []
  const map: Record<string, TreeNode> = {}

  files.forEach((f) => {
    const parts = f.path.split('/')
    let current = root
    parts.forEach((part, i) => {
      const fullPath = parts.slice(0, i + 1).join('/')
      if (!map[fullPath]) {
        const node: TreeNode = {
          name: part,
          path: fullPath,
          type: i === parts.length - 1 ? 'file' : 'folder',
          children: [],
          file: i === parts.length - 1 ? f : undefined,
        }
        map[fullPath] = node
        current.push(node)
      }
      current = map[fullPath].children!
    })
  })

  return root.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

interface Props { repoId: string; activeFileId?: string; onFileSelect: (f: FileRecord) => void; refreshTrigger?: number }

export function FileTree({ repoId, activeFileId, onFileSelect, refreshTrigger = 0 }: Props) {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('files').select('*').eq('repo_id', repoId).then(({ data, error }) => {
      if (error) setErrorMsg(error.message)
      setTree(buildTree(data || []))
      setLoading(false)
    })
  }, [repoId, refreshTrigger])

  if (loading) return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" style={{ height: 32, borderRadius: 10 }} />)}
    </div>
  )

  if (errorMsg) return <div style={{ padding: 16, color: '#FF4757', fontSize: 13 }}>Error: {errorMsg}</div>

  return (
    <div style={{ padding: '8px 4px' }}>
      {tree.map((node, i) => (
        <TreeItem key={node.path} node={node} depth={0} index={i} activeFileId={activeFileId} onFileSelect={onFileSelect} />
      ))}
    </div>
  )
}

function TreeItem({ node, depth, index, activeFileId, onFileSelect }: { node: TreeNode; depth: number; index: number; activeFileId?: string; onFileSelect: (f: FileRecord) => void }) {
  const [open, setOpen] = useState(depth === 0)

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="file-tree-item"
          style={{ paddingLeft: `${12 + depth * 16}px`, animationDelay: `${index * 0.05}s` }}
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronDown size={14} color="#0096FF" /> : <ChevronRight size={14} color="rgba(240,248,255,0.4)" />}
          {open ? <FolderOpen size={15} color="#FFD700" /> : <Folder size={15} color="#FFD700" />}
          <span>{node.name}</span>
        </div>
        {open && node.children?.map((child, i) => (
          <TreeItem key={child.path} node={child} depth={depth + 1} index={i} activeFileId={activeFileId} onFileSelect={onFileSelect} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`file-tree-item${node.file?.id === activeFileId ? ' active' : ''}`}
      style={{ paddingLeft: `${12 + depth * 16}px`, animationDelay: `${index * 0.05}s` }}
      onClick={() => node.file && onFileSelect(node.file)}
    >
      <span style={{ width: 14 }} />
      <span>{getFileIcon(node.name)}</span>
      <span>{node.name}</span>
    </div>
  )
}
