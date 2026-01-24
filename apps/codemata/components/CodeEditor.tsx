"use client";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import type { EncoderTool, FormatterTool, MinifierTool } from "@/lib/types";

type CodeEditorLanguage =
  | FormatterTool["language"]
  | MinifierTool["language"]
  | EncoderTool["language"];

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  language?: CodeEditorLanguage;
  lineWrapping?: boolean;
  extensions?: Extension[];
  placeholder?: string;
  /**
   * Callback invoked when the editor view is updated.
   * Should be memoized with useCallback to prevent unnecessary re-renders.
   */
  onViewUpdate?: (view: EditorView) => void;
}

/**
 * Get language support extension for CodeMirror based on language type
 */
function getLanguageExtension(language: CodeEditorLanguage): Extension {
  switch (language) {
    case "json":
      return json();
    case "yaml":
      return yaml();
    case "css":
      return css();
    case "html":
      return html();
    case "markdown":
      return markdown();
    case "xml":
      return xml();
    case "sql":
      return sql();
    case "graphql":
      // GraphQL uses javascript for now as a fallback
      return javascript();
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ jsx: true, typescript: true });
    case "text":
      // Plain text - no syntax highlighting
      return [];
    default:
      return javascript({ jsx: true, typescript: true });
  }
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  label,
  language = "typescript",
  lineWrapping = false,
  extensions: customExtensions = [],
  placeholder,
  onViewUpdate,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<EditorView | null>(null);
  const editorId = `code-editor-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Avoid hydration mismatch by only rendering theme after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Notify parent of view updates
  useEffect(() => {
    if (view && onViewUpdate) {
      onViewUpdate(view);
    }
  }, [view, onViewUpdate]);

  const extensions = useMemo(() => {
    const exts: Extension[] = [getLanguageExtension(language)];
    if (lineWrapping) {
      exts.push(EditorView.lineWrapping);
    }
    // Add custom extensions (like linter for validators)
    if (customExtensions.length > 0) {
      exts.push(...customExtensions);
    }
    return exts;
  }, [language, lineWrapping, customExtensions]);

  return (
    <div className="w-full">
      <label
        id={editorId}
        htmlFor={editorId}
        className="text-sm font-medium mb-2 block sr-only"
      >
        {label}
      </label>
      <section
        role="region"
        className="border rounded-md overflow-hidden"
        aria-labelledby={editorId}
      >
        <CodeMirror
          value={value}
          height="400px"
          extensions={extensions}
          onChange={onChange}
          onCreateEditor={(view) => setView(view)}
          readOnly={readOnly}
          placeholder={placeholder}
          theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
          className="text-sm font-mono"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </section>
    </div>
  );
}
