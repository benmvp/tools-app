"use client";

import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  label,
}: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height="400px"
          extensions={[javascript({ jsx: true, typescript: true })]}
          onChange={onChange}
          readOnly={readOnly}
          theme={theme === "dark" ? "dark" : "light"}
          className="text-sm font-mono"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
