"use client";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "yaml"
  | "css"
  | "html"
  | "graphql"
  | "markdown"
  | "xml";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  language?: SupportedLanguage;
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
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height="400px"
          extensions={[getLanguageExtension(language)]}
          onChange={onChange}
          readOnly={readOnly}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          className="text-sm font-mono"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
      </div>
    </div>
  );
}
