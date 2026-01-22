"use client";

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ValidationError, ValidationResult } from "@/lib/validators/types";

interface ValidationResultsProps {
  result: ValidationResult;
  onErrorClick: (error: ValidationError) => void;
}

export function ValidationResults({
  result,
  onErrorClick,
}: ValidationResultsProps) {
  if (
    result.valid &&
    result.errors.length === 0 &&
    result.warnings.length === 0
  ) {
    return <ValidationSuccess metadata={result.metadata} />;
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {errorCount > 0 && (
          <span className="text-destructive">
            {errorCount} {errorCount === 1 ? "Error" : "Errors"}
          </span>
        )}
        {errorCount > 0 && warningCount > 0 && <span>•</span>}
        {warningCount > 0 && (
          <span className="text-yellow-600 dark:text-yellow-500">
            {warningCount} {warningCount === 1 ? "Warning" : "Warnings"}
          </span>
        )}
      </div>

      {/* Errors Section */}
      {errorCount > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            Errors ({errorCount})
          </h3>
          <div className="space-y-2">
            {result.errors.map((error) => (
              <ErrorItem
                key={`error-${error.line}-${error.column}-${error.message}`}
                error={error}
                onClick={() => onErrorClick(error)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Warnings Section */}
      {warningCount > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            Warnings ({warningCount})
          </h3>
          <div className="space-y-2">
            {result.warnings.map((warning) => (
              <ErrorItem
                key={`warning-${warning.line}-${warning.column}-${warning.message}`}
                error={warning}
                onClick={() => onErrorClick(warning)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorItem({
  error,
  onClick,
}: {
  error: ValidationError;
  onClick: () => void;
}) {
  const isError = error.severity === "error";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${error.severity === "error" ? "Error" : "Warning"} at line ${error.line}, column ${error.column}: ${error.message}`}
      className="w-full text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        <AlertCircle
          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            isError
              ? "text-destructive"
              : "text-yellow-600 dark:text-yellow-500"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground mb-1">
            Line {error.line}, Column {error.column}
          </div>
          <div className="text-sm">{error.message}</div>
        </div>
      </div>
    </button>
  );
}

function ValidationSuccess({
  metadata,
}: {
  metadata?: Record<string, unknown>;
}) {
  return (
    <div className="p-4 rounded-md border border-green-500/50 bg-green-500/10">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-green-600 dark:text-green-500 mb-1">
            Valid!
          </h3>
          {metadata && (
            <ul className="text-sm text-muted-foreground space-y-1">
              {Object.entries(metadata).map(([key, value]) => (
                <li key={key}>
                  {key}: {String(value)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
