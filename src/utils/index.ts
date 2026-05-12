// Language color map (GitHub-style)
export const LANG_COLORS: Record<string, string> = {
  typescript: '#3178c6', javascript: '#f1e05a', python: '#3572A5',
  rust: '#dea584', go: '#00ADD8', java: '#b07219', cpp: '#f34b7d',
  c: '#555555', csharp: '#178600', ruby: '#701516', php: '#4F5D95',
  swift: '#F05138', kotlin: '#A97BFF', dart: '#00B4AB', html: '#e34c26',
  css: '#563d7c', scss: '#c6538c', shell: '#89e051', markdown: '#083fa1',
  json: '#cbcb41', yaml: '#cb171e', xml: '#0060ac', sql: '#e38c00',
  r: '#198CE7', matlab: '#e16737', vue: '#41b883', svelte: '#ff3e00',
}

export const LANG_FROM_EXT: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
  py: 'python', rs: 'rust', go: 'go', java: 'java', cpp: 'cpp', cc: 'cpp',
  c: 'c', cs: 'csharp', rb: 'ruby', php: 'php', swift: 'swift', kt: 'kotlin',
  dart: 'dart', html: 'html', css: 'css', scss: 'scss', sh: 'shell',
  bash: 'shell', md: 'markdown', json: 'json', yaml: 'yaml', yml: 'yaml',
  xml: 'xml', sql: 'sql', r: 'r', vue: 'vue', svelte: 'svelte',
  txt: 'plaintext', env: 'plaintext', toml: 'toml', lock: 'plaintext',
}

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return LANG_FROM_EXT[ext] || 'plaintext'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const icons: Record<string, string> = {
    ts: '🟦', tsx: '🟦', js: '🟨', jsx: '🟨', py: '🐍', rs: '🦀',
    go: '🐹', java: '☕', cpp: '⚙️', c: '⚙️', cs: '💜', rb: '💎',
    php: '🐘', swift: '🐦', kt: '🎭', dart: '🎯', html: '🌐', css: '🎨',
    scss: '🎨', sh: '⚡', md: '📝', json: '📋', yaml: '📋', yml: '📋',
    sql: '🗄️', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️',
    pdf: '📄', zip: '📦', txt: '📃',
  }
  return icons[ext] || '📄'
}
