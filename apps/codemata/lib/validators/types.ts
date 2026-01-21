import type { LucideIcon } from "lucide-react";

export interface ValidationError {
  line: number; // 1-indexed
  column: number; // 1-indexed
  message: string;
  severity: "error" | "warning" | "info";
  endLine?: number;
  endColumn?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  metadata?: Record<string, unknown>; // Tool-specific (e.g., property count)
}

export interface ValidatorTool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  language: string; // CodeMirror language mode
  example: string; // Pre-loaded example code
  metadata: {
    title: string;
    description: string;
  };
}

export type ValidatorAction = (
  input: string,
  options?: Record<string, unknown>,
) => Promise<ValidationResult>;

// Regex-specific types
export interface RegexMatch {
  fullMatch: string;
  groups: string[];
  index: number;
}

export interface RegexTestResult {
  valid: boolean;
  matches: RegexMatch[];
  error?: string;
}
