import { type Diagnostic, linter } from "@codemirror/lint";
import type { Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ValidationError } from "./types";

/**
 * Convert line/column (1-indexed) to CodeMirror position
 */
function lineColToPos(doc: Text, line: number, column: number): number {
  const lineObj = doc.line(line);
  return lineObj.from + Math.min(column - 1, lineObj.length);
}

/**
 * Convert validation errors to CodeMirror diagnostics
 */
export function createDiagnostics(
  errors: ValidationError[],
  doc: Text,
): Diagnostic[] {
  return errors.map((error) => {
    const from = lineColToPos(doc, error.line, error.column);
    const to =
      error.endLine && error.endColumn
        ? lineColToPos(doc, error.endLine, error.endColumn)
        : doc.line(error.line).to;

    return {
      from,
      to: Math.max(from, to), // Ensure to >= from
      severity: error.severity,
      message: error.message,
    };
  });
}

/**
 * Create a CodeMirror linter extension from validation errors
 * Use this in your component to add error decorations
 */
export function createLinter(errors: ValidationError[]) {
  return linter((view) => createDiagnostics(errors, view.state.doc));
}

/**
 * Scroll editor to a specific line and highlight it
 * Call this when user clicks an error in the results panel
 */
export function scrollToError(
  editorView: EditorView,
  line: number,
  column = 1,
) {
  const pos = lineColToPos(editorView.state.doc, line, column);

  // Dispatch transaction to move cursor and scroll
  editorView.dispatch({
    selection: { anchor: pos },
    effects: EditorView.scrollIntoView(pos, { y: "center" }),
  });

  // Focus the editor
  editorView.focus();
}
