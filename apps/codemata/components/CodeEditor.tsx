'use client'

import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { useTheme } from 'next-themes'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  label: string
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  label,
}: CodeEditorProps) {
  const { theme } = useTheme()

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height="400px"
          extensions={[javascript({ jsx: true, typescript: true })]}
          onChange={onChange}
          readOnly={readOnly}
          theme={theme === 'dark' ? 'dark' : 'light'}
          className="text-sm"
        />
      </div>
    </div>
  )
}
