"use client";

import type { EditorView } from "@codemirror/view";
import { useMemo, useState } from "react";
import { validateHtml } from "@/app/validators/actions";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { createLinter, scrollToError } from "@/lib/validators/diagnostics";
import type { ValidationError, ValidationResult } from "@/lib/validators/types";
import { ValidationResults } from "./ValidationResults";

interface HtmlValidatorProps {
  example: string;
}

export function HtmlValidator({ example }: HtmlValidatorProps) {
  const [input, setInput] = useState(example);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const validationResult = await validateHtml(input);
      setResult(validationResult);
    } catch (error) {
      console.error("Validation failed:", error);
      setResult({
        valid: false,
        errors: [
          {
            line: 1,
            column: 1,
            message: "Validation failed. Please try again.",
            severity: "error",
          },
        ],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleErrorClick = (error: ValidationError) => {
    if (editorView) {
      scrollToError(editorView, error.line, error.column);
    }
  };

  // Memoize extensions to prevent unnecessary CodeMirror reconfiguration
  const editorExtensions = useMemo(() => {
    return result ? [createLinter([...result.errors, ...result.warnings])] : [];
  }, [result]);

  return (
    <div
      className={
        result ? "grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-4" : ""
      }
    >
      {/* Left Column: Editor + Button */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="html-input"
            className="text-sm font-medium mb-2 block"
          >
            HTML Input
          </label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="html"
            extensions={editorExtensions}
            onViewUpdate={setEditorView}
            label="HTML Input"
          />
        </div>

        {/* Validate Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleValidate}
            disabled={!input.trim() || isValidating}
            className="w-full sm:w-auto"
            size="default"
          >
            {isValidating ? "Validating..." : "Validate HTML"}
          </Button>
        </div>
      </div>

      {/* Right Column: Results */}
      {result && (
        <div className="lg:sticky lg:top-4 lg:self-start">
          <ValidationResults result={result} onErrorClick={handleErrorClick} />
        </div>
      )}
    </div>
  );
}
