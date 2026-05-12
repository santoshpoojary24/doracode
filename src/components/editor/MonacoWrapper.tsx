import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'
import { doraTheme } from '@/styles/editor-theme'
import { useToastStore } from '@/store'

interface Props {
  content: string
  language?: string
  readOnly?: boolean
  onChange?: (v: string) => void
  height?: string
}

export function MonacoWrapper({ content, language = 'plaintext', readOnly = true, onChange, height = '500px' }: Props) {
  const monaco = useMonaco()
  const { addToast } = useToastStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!monaco) return
    monaco.editor.defineTheme('dora', doraTheme as Parameters<typeof monaco.editor.defineTheme>[1])
    monaco.editor.setTheme('dora')
  }, [monaco])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    addToast("Copied to Doraemon's Pocket! 📋", 'success')
  }

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1.5px solid rgba(0,150,255,0.2)' }}>
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: 12, gap: 6 }}
        >
          {copied ? <><Check size={13} color="#00C9B1" /> Copied!</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <Editor
        height={height}
        language={language}
        value={content}
        theme="dora"
        onChange={(v) => onChange?.(v || '')}
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
        }}
      />
    </div>
  )
}
