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

type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "yaml"
  | "css"
  | "html"
  | "graphql"
  | "markdown"
  | "xml"
  | "sql";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  language?: SupportedLanguage;
  lineWrapping?: boolean;
}

function getLanguageExtension(language: SupportedLanguage): Extension {
  switch (language) {
    case "typescript":
    case "javascript":
      return javascript({ jsx: true, typescript: true });
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
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const extensions = useMemo(() => {
    const exts: Extension[] = [getLanguageExtension(language)];
    if (lineWrapping) {
      exts.push(EditorView.lineWrapping);
    }
    return exts;
  }, [language, lineWrapping]);

  return (
    <div className="space-y-2">
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height="400px"
          extensions={extensions}
          onChange={onChange}
          readOnly={readOnly}
          theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
          className="text-sm font-mono"
          aria-label={label || (readOnly ? "Output" : "Input")}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
