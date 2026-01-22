# Phase 9: Validators/Checkers - Implementation Specification

**Status:** Planning Complete

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Final Decisions](#final-decisions)
3. [Technical Architecture](#technical-architecture)
4. [Implementation Plan](#implementation-plan)
5. [Tool Specifications](#tool-specifications)
6. [Testing Strategy](#testing-strategy)
7. [Success Criteria](#success-criteria)
8. [Timeline](#timeline)

---

## Project Overview

### Goal
Add 5-6 professional validation tools to Codemata with IDE-like validation UX featuring inline error highlighting and detailed error panels.

### Current State
- **Total Tools:** 19 (8 formatters + 6 minifiers + 5 encoders)
- **Target:** 24-25 tools (add 5-6 validators)

### Tools to Build

1. **JSON Validator** ⭐ (with schema support via ajv)
2. **Regex Tester** ⭐ (with match highlighting)
3. **HTML Validator** (using html-validate, full-throttle)
4. **CSS Validator** (syntax + linting)
5. **XML Validator** (structural validation)
6. **URL Validator** (bonus - optional quick win)

### Key Features

- ✅ Inline error highlighting via CodeMirror lint extension
- ✅ Detailed error panel below editor
- ✅ Clickable errors that scroll to line
- ✅ Pre-loaded broken examples (validate = try)
- ✅ Manual validation trigger (button)
- ✅ Bespoke UI per validator
- ✅ Mobile-optimized layouts

---

## Final Decisions

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Component Strategy** | Bespoke per tool | Each validator has unique UI needs |
| **Code Reuse** | Shared utilities (not components) | DRY for diagnostics, flexibility for UI |
| **Validation Trigger** | Manual button click | Expected UX, simpler implementation |
| **Error Display** | CodeMirror inline + panel below | Professional IDE-like experience |
| **Error Decorations** | Shared utilities wrapping `@codemirror/lint` | Consistent look, easy implementation |
| **Example Data** | Pre-loaded broken code | Zero-friction onboarding, SEO benefit |
| **Mobile Optimization** | Subtle tweaks (font, spacing) | Better UX without major refactoring |
| **Error Click Behavior** | Smooth scroll → highlight → move cursor | Natural IDE behavior |

### Tool-Specific Decisions

#### JSON Validator
- **Validation:** Syntax + optional JSON Schema via `ajv`
- **UI Layout:** Input above, collapsible schema below (collapsed by default)
- **Success State:** Card with metadata (property count, bytes, type)
- **Example:** 1-2 obvious errors (trailing comma)

#### Regex Tester
- **Flags:** Checkbox buttons (visual, easy to toggle)
- **Match Display:** Highlighted in CodeMirror + expandable details panel
- **Match Details:** Compact default, expandable for full capture group tree
- **Example:** Working regex ready to test (email pattern)

#### HTML Validator
- **Library:** `html-validate` (full-throttle, structural + a11y + best practices)
- **Error Grouping:** Separate sections for errors vs warnings
- **Example:** 2-3 errors (structural + a11y)

#### CSS Validator
- **Library:** PostCSS with safe parser
- **Focus:** Syntax errors + basic linting
- **Example:** Missing semicolon

#### XML Validator
- **Library:** `xml2js` with strict mode
- **Focus:** Well-formedness (unclosed tags, mismatched tags)
- **Example:** Structural errors

### Mobile Considerations
- Larger font in editors (16px minimum)
- Full-width validation buttons
- Comfortable touch targets (44px minimum)
- Same layout, responsive tweaks only

---

## UI Layout Sketches

### JSON Validator

```
┌─────────────────────────────────────────────────────────┐
│ JSON Validator                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  JSON Input:                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ {                                                 │  │
│  │   "name": "John Doe",                            │  │
│  │   "age": 30,                                      │  │
│  │   "tags": ["developer"],                         │  │
│  │ }  ⚠️ (trailing comma highlighted)               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [ ] Advanced: Validate Against JSON Schema            │
│      (collapsible, collapsed by default)               │
│                                                         │
│  [Validate JSON Button]                                │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ ✗ 1 Error Found                     │              │
│  │                                      │              │
│  │ ⚠ Line 5, Column 28  (clickable)     │              │
│  │   Trailing comma is not valid JSON  │              │
│  └─────────────────────────────────────┘              │
│                                                         │
│  When expanded (schema validation on):                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ JSON Schema (Optional):                          │  │
│  │ {                                                 │  │
│  │   "type": "object",                               │  │
│  │   "required": ["name", "email"]                   │  │
│  │ }                                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Success State:**
```
┌─────────────────────────────────────┐
│ ✓ Valid JSON                        │
│   - 3 properties                    │
│   - 1 nested array                  │
│   - 127 bytes                       │
│   - type: object                    │
└─────────────────────────────────────┘
```

---

### Regex Tester

```
┌─────────────────────────────────────────────────────────┐
│ Regex Tester                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Regular Expression Pattern:                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ (\w+)@(\w+\.\w+)                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Flags:                                                 │
│  [✓] g global   [✓] i case-insensitive                 │
│  [ ] m multiline [ ] s dotall                          │
│  [ ] u unicode   [ ] y sticky                          │
│                                                         │
│  Test String:                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Contact: john@example.com or jane@test.org       │  │
│  │          ████████████████    ██████████████       │  │
│  │          (highlighted matches)                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Test Regex Button]                                   │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ ✓ 2 matches found                   │              │
│  │                                      │              │
│  │ Match 1: "john@example.com" ▼       │ (collapsed)  │
│  │                                      │              │
│  │ Match 2: "jane@test.org" ▼          │ (collapsed)  │
│  └─────────────────────────────────────┘              │
│                                                         │
│  When expanded:                                         │
│  ┌─────────────────────────────────────┐              │
│  │ Match 1: "john@example.com" ▲       │              │
│  │   Group 1: "john"                   │              │
│  │   Group 2: "example.com"            │              │
│  └─────────────────────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### HTML Validator

```
┌─────────────────────────────────────────────────────────┐
│ HTML Validator                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HTML Input:                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1  <!DOCTYPE html>                                │  │
│  │ 2  <html>                                         │  │
│  │ 3 ⚠ <head><title>Test</title>                    │  │
│  │ 4    <body>                                       │  │
│  │ 5      <div>                                      │  │
│  │ 6 🔴   <p>Unclosed paragraph                      │  │
│  │ 7 🔴   <span>Mismatched</div>                     │  │
│  │ 8      </span>                                    │  │
│  │ 9    </body>                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Validate HTML Button]                                │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ ✗ 2 Errors, 1 Warning               │              │
│  │                                      │              │
│  │ Errors (2)                           │              │
│  │ ───────────────────────────────────  │              │
│  │ 🔴 Line 3, Column 6  (clickable)     │              │
│  │    Missing closing </head> tag      │              │
│  │                                      │              │
│  │ 🔴 Line 7, Column 10                 │              │
│  │    Mismatched tags: <p> vs </div>   │              │
│  │                                      │              │
│  │ Warnings (1)                         │              │
│  │ ───────────────────────────────────  │              │
│  │ ⚠️  Line 2, Column 1                 │              │
│  │    Missing lang attribute on <html> │              │
│  └─────────────────────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### CSS Validator

```
┌─────────────────────────────────────────────────────────┐
│ CSS Validator                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CSS Input:                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ .container {                                      │  │
│  │   color: #ff0000;                                 │  │
│  │   background: blue  ⚠️ (missing semicolon)       │  │
│  │   padding: 20px;                                  │  │
│  │ }                                                 │  │
│  │                                                   │  │
│  │ .header {                                         │  │
│  │   font-size: 24px;                                │  │
│  │   font-weight bold  ⚠️ (missing colon)           │  │
│  │ }                                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Validate CSS Button]                                 │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ ✗ 2 Warnings Found                  │              │
│  │                                      │              │
│  │ ⚠️  Line 3, Column 20                │              │
│  │    Expected semicolon before 'padding' │           │
│  │                                      │              │
│  │ ⚠️  Line 9, Column 16                │              │
│  │    Expected colon after property name │            │
│  └─────────────────────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### XML Validator

```
┌─────────────────────────────────────────────────────────┐
│ XML Validator                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  XML Input:                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ <?xml version="1.0"?>                             │  │
│  │ <root>                                            │  │
│  │   <item>Value</item>                              │  │
│  │   <unclosed>  🔴 (missing closing tag)           │  │
│  │   <mismatched></wrong>  🔴                        │  │
│  │ </root>                                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Validate XML Button]                                 │
│                                                         │
│  ┌─────────────────────────────────────┐              │
│  │ ✗ 2 Errors Found                    │              │
│  │                                      │              │
│  │ 🔴 Line 4, Column 12  (clickable)    │              │
│  │    Unclosed tag 'unclosed'          │              │
│  │                                      │              │
│  │ 🔴 Line 5, Column 16                 │              │
│  │    Mismatched tag: expected         │              │
│  │    </mismatched>, found </wrong>    │              │
│  └─────────────────────────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Directory Structure

```
apps/codemata/
├── app/
│   └── validators/
│       ├── actions.ts              # Server Actions (all validators)
│       ├── page.tsx                # Category landing page
│       └── [slug]/
│           └── page.tsx            # Dynamic validator pages
├── components/
│   └── validators/
│       ├── JsonValidator.tsx       # Bespoke JSON UI
│       ├── RegexTester.tsx         # Bespoke Regex UI
│       ├── HtmlValidator.tsx       # Bespoke HTML UI
│       ├── CssValidator.tsx        # Bespoke CSS UI
│       ├── XmlValidator.tsx        # Bespoke XML UI
│       ├── ValidationResults.tsx   # Shared results display component
│       └── ValidationSuccess.tsx   # Shared success state component
├── lib/
│   ├── tools-data.ts               # Add validator tools here
│   └── validators/
│       ├── diagnostics.ts          # Shared CodeMirror lint utilities
│       ├── types.ts                # Shared validation types
│       └── examples.ts             # Example data per tool
└── __tests__/
    └── validators.test.ts          # Unit tests for server actions
```

### Shared Utilities

#### `lib/validators/types.ts`

```typescript
import type { LucideIcon } from "lucide-react";

export interface ValidationError {
  line: number;           // 1-indexed
  column: number;         // 1-indexed
  message: string;
  severity: "error" | "warning" | "info";
  endLine?: number;
  endColumn?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  metadata?: Record<string, any>;  // Tool-specific (e.g., property count)
}

export interface ValidatorTool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  language: string;  // CodeMirror language mode
  example: string;   // Pre-loaded example code
  metadata: {
    title: string;
    description: string;
  };
}

export type ValidatorAction = (
  input: string,
  options?: Record<string, any>
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
```

#### `lib/validators/diagnostics.ts`

```typescript
import { linter, type Diagnostic } from "@codemirror/lint";
import type { Text } from "@codemirror/state";
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
  doc: Text
): Diagnostic[] {
  return errors.map(error => {
    const from = lineColToPos(doc, error.line, error.column);
    const to = error.endLine && error.endColumn
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
  return linter(view => createDiagnostics(errors, view.state.doc));
}

/**
 * Scroll editor to a specific line and highlight it
 * Call this when user clicks an error in the results panel
 */
export function scrollToError(
  editorView: EditorView,
  line: number,
  column: number = 1
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
```

#### `lib/validators/examples.ts`

```typescript
export const VALIDATOR_EXAMPLES = {
  json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "javascript"],
}`,

  jsonSchema: `{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number", "minimum": 0 },
    "email": { "type": "string", "format": "email" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}`,

  regex: {
    pattern: String.raw`(\w+)@(\w+\.\w+)`,
    flags: "gi",
    testString: "Contact us at john@example.com or jane@test.org for support.",
  },

  html: `<!DOCTYPE html>
<html>
  <head><title>Test Page</title>
  <body>
    <div>
      <p>Unclosed paragraph
      <span>Mismatched nesting</div>
    </span>
  </body>`,

  css: `.container {
  color: #ff0000;
  background: blue
  padding: 20px;
}

.header {
  font-size: 24px;
  font-weight bold;
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">First Item</item>
  <item id="2">
    <name>Second Item
    <value>Missing closing tag
  </item>
  <mismatched></wrong>
</root>`,
};
```

### Shared Components

#### `components/validators/ValidationResults.tsx`

```typescript
"use client";

import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ValidationResult, ValidationError } from "@/lib/validators/types";

interface ValidationResultsProps {
  result: ValidationResult;
  onErrorClick: (error: ValidationError) => void;
}

export function ValidationResults({ result, onErrorClick }: ValidationResultsProps) {
  if (result.valid && result.errors.length === 0 && result.warnings.length === 0) {
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
            {result.errors.map((error, idx) => (
              <ErrorItem
                key={idx}
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
            {result.warnings.map((warning, idx) => (
              <ErrorItem
                key={idx}
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

function ErrorItem({ error, onClick }: { error: ValidationError; onClick: () => void }) {
  const isError = error.severity === "error";

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        <AlertCircle
          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            isError ? "text-destructive" : "text-yellow-600 dark:text-yellow-500"
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

function ValidationSuccess({ metadata }: { metadata?: Record<string, any> }) {
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
```

---

## Implementation Plan

### Phase 9.1: Foundation (Day 1-2)

**Goal:** Set up shared infrastructure and visibility for all validators

#### Tasks

1. **Create directory structure**
   ```bash
   mkdir -p app/validators/[slug]
   mkdir -p components/validators
   mkdir -p lib/validators
   ```

2. **Install dependencies**
   ```bash
   pnpm --filter codemata add @codemirror/lint ajv html-validate postcss postcss-safe-parser xml2js
   pnpm --filter codemata add -D @types/xml2js
   ```

3. **Add validators to tools data (as "coming soon")**
   - [ ] Add `VALIDATOR_TOOLS` to `lib/tools-data.ts` with `comingSoon: true`
   - [ ] Add all 5-6 validators:
     - JSON Validator
     - Regex Tester
     - HTML Validator
     - CSS Validator
     - XML Validator
     - (Optional) URL Validator
   - [ ] Add to `ALL_TOOLS` registry
   - [ ] Add to search index

4. **Create validators category page**
   - [ ] `app/validators/page.tsx` - Category landing page
   - [ ] Display all validators (showing "Coming Soon" badges)
   - [ ] Include category description and benefits
   - [ ] Follow existing pattern from formatters/minifiers/encoders

5. **Add to navigation**
   - [ ] Update sidebar navigation with "Validators" section
   - [ ] Add to mobile navigation
   - [ ] Add to command menu
   - [ ] Update home page to include validators count

6. **Create shared files**
   - [ ] `lib/validators/types.ts` - Type definitions
   - [ ] `lib/validators/diagnostics.ts` - CodeMirror utilities
   - [ ] `lib/validators/examples.ts` - Example data
   - [ ] `components/validators/ValidationResults.tsx` - Results display

7. **Create category structure**
   - [ ] `app/validators/actions.ts` - Server actions file (empty scaffold)
   - [ ] `app/validators/[slug]/page.tsx` - Dynamic route handler (returns 404 for now)

#### Why "Coming Soon" First?

- **Builds anticipation:** Users see what's coming
- **Early SEO:** Category page and tool pages indexed early
- **Navigation testing:** Validate UI integration before implementation
- **Incremental rollout:** Remove "coming soon" badge as each tool completes
- **Prevents surprises:** Users won't suddenly see new category appear

#### Example `lib/tools-data.ts` Addition

```typescript
import { FileCheck, Bug, Code, Palette, FileXml } from "lucide-react";

export const VALIDATOR_TOOLS: Record<string, Tool> = {
  "json-validator": {
    id: "json",
    name: "JSON Validator",
    description: "Validate JSON syntax and optionally check against JSON Schema",
    url: "/validators/json-validator",
    icon: FileCheck,
    comingSoon: true,  // Remove this when implemented
    language: "json",
    example: "",  // Add later
    metadata: {
      title: "JSON Validator | Codemata",
      description: "Validate JSON syntax and structure. Free online JSON validator with schema support.",
    },
  },
  "regex-tester": {
    id: "regex",
    name: "Regex Tester",
    description: "Test regular expressions and see matches in real-time",
    url: "/validators/regex-tester",
    icon: Bug,
    comingSoon: true,
    language: "text",
    example: "",
    metadata: {
      title: "Regex Tester | Codemata",
      description: "Test regular expressions with match highlighting. Free online regex tester.",
    },
  },
  // ... HTML, CSS, XML similarly
};

// Add to ALL_TOOLS
export const ALL_TOOLS = {
  ...FORMATTER_TOOLS,
  ...MINIFIER_TOOLS,
  ...ENCODER_TOOLS,
  ...VALIDATOR_TOOLS,  // Now includes coming soon tools
};
```

#### Deliverables
- ✅ Validators visible in navigation with "Coming Soon" badges
- ✅ Category landing page showing all validators
- ✅ All shared utilities ready to use
- ✅ Dependencies installed
- ✅ Search index includes validators
- ✅ Tool count updated (shows 24-25 tools)

---

### Phase 9.2: JSON Validator (Day 3-4)

**Goal:** Build most complex validator first to establish patterns

#### Server Action

**File:** `app/validators/actions.ts`

```typescript
"use server";

import Ajv from "ajv";
import type { ValidationResult, ValidationError } from "@/lib/validators/types";

function parseJsonError(error: any): ValidationError {
  // Extract line/column from JSON.parse error
  const match = error.message.match(/position (\d+)/);
  const position = match ? parseInt(match[1]) : 0;

  // Convert position to line/column (simplified)
  return {
    line: 1,
    column: position + 1,
    message: error.message,
    severity: "error",
  };
}

function convertAjvErrors(errors: any[]): ValidationError[] {
  return errors.map(err => ({
    line: 1, // ajv doesn't provide line numbers
    column: 1,
    message: `${err.instancePath || "/"} ${err.message}`,
    severity: "error" as const,
  }));
}

export async function validateJson(
  input: string,
  schema?: string
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  try {
    const parsed = JSON.parse(input);

    // Schema validation if provided
    if (schema) {
      try {
        const schemaObj = JSON.parse(schema);
        const ajv = new Ajv({ allErrors: true });
        const validate = ajv.compile(schemaObj);

        if (!validate(parsed)) {
          errors.push(...convertAjvErrors(validate.errors || []));
        }
      } catch (schemaError) {
        errors.push({
          line: 1,
          column: 1,
          message: `Invalid JSON Schema: ${schemaError.message}`,
          severity: "error",
        });
      }
    }

    // Success - calculate metadata
    const metadata = {
      properties: typeof parsed === "object" && !Array.isArray(parsed)
        ? Object.keys(parsed).length
        : undefined,
      bytes: input.length,
      type: Array.isArray(parsed) ? "array" : typeof parsed,
    };

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
      metadata,
    };
  } catch (e: any) {
    // Parse error
    return {
      valid: false,
      errors: [parseJsonError(e)],
      warnings: [],
    };
  }
}
```

#### Component

**File:** `components/validators/JsonValidator.tsx`

```typescript
"use client";

import { useState } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CodeEditor } from "@/components/CodeEditor";
import { ValidationResults } from "./ValidationResults";
import { createLinter, scrollToError } from "@/lib/validators/diagnostics";
import { validateJson } from "@/app/validators/actions";
import type { ValidationResult, ValidationError } from "@/lib/validators/types";

interface JsonValidatorProps {
  example: string;
  exampleSchema?: string;
}

export function JsonValidator({ example, exampleSchema = "" }: JsonValidatorProps) {
  const [input, setInput] = useState(example);
  const [schema, setSchema] = useState(exampleSchema);
  const [showSchema, setShowSchema] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [editorView, setEditorView] = useState<any>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    const validationResult = await validateJson(input, schema || undefined);
    setResult(validationResult);
    setIsValidating(false);
  };

  const handleErrorClick = (error: ValidationError) => {
    if (editorView) {
      scrollToError(editorView, error.line, error.column);
    }
  };

  return (
    <div className="space-y-4">
      {/* JSON Input */}
      <div>
        <label className="text-sm font-medium mb-2 block">JSON Input</label>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="json"
          extensions={result ? [createLinter([...result.errors, ...result.warnings])] : []}
          onViewUpdate={setEditorView}
        />
      </div>

      {/* Schema (Collapsible) */}
      <Collapsible open={showSchema} onOpenChange={setShowSchema}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            Advanced: Validate Against JSON Schema
            <ChevronDown className={`w-4 h-4 transition-transform ${showSchema ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <label className="text-sm font-medium mb-2 block">JSON Schema (Optional)</label>
          <CodeEditor
            value={schema}
            onChange={setSchema}
            language="json"
            placeholder="Paste JSON Schema here (optional)"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Validate Button */}
      <Button onClick={handleValidate} disabled={isValidating} className="w-full sm:w-auto">
        {isValidating ? "Validating..." : "Validate JSON"}
      </Button>

      {/* Results */}
      {result && <ValidationResults result={result} onErrorClick={handleErrorClick} />}
    </div>
  );
}
```

#### Page Route

**File:** `app/validators/[slug]/page.tsx`

```typescript
import { JsonValidator } from "@/components/validators/JsonValidator";
import { VALIDATOR_EXAMPLES } from "@/lib/validators/examples";

export default async function ValidatorPage({ params }: { params: { slug: string } }) {
  if (params.slug === "json-validator") {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">JSON Validator</h1>
        <p className="text-muted-foreground mb-8">
          Validate JSON syntax and optionally check against a JSON Schema
        </p>
        <JsonValidator
          example={VALIDATOR_EXAMPLES.json}
          exampleSchema={VALIDATOR_EXAMPLES.jsonSchema}
        />
      </div>
    );
  }

  // ... other validators
}
```

#### Tests

**File:** `__tests__/validators.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { validateJson } from "../app/validators/actions";

describe("validateJson", () => {
  it("validates correct JSON", async () => {
    const result = await validateJson('{"valid": true}');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects syntax errors", async () => {
    const result = await validateJson('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("detects trailing commas", async () => {
    const result = await validateJson('{"key": "value",}');
    expect(result.valid).toBe(false);
  });

  it("validates against schema", async () => {
    const schema = '{"type": "object", "required": ["name"]}';
    const result = await validateJson('{"age": 30}', schema);
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain("required");
  });

  it("returns metadata for valid JSON", async () => {
    const result = await validateJson('{"a": 1, "b": 2}');
    expect(result.metadata?.properties).toBe(2);
    expect(result.metadata?.type).toBe("object");
  });
});
```

---

### Phase 9.3: Regex Tester (Day 5-6)

**Goal:** Build unique UI with match highlighting

#### Server Action

```typescript
export async function testRegex(
  pattern: string,
  flags: string,
  testString: string
): Promise<RegexTestResult> {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes('g')) {
      let match;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index,
        });

        // Prevent infinite loop
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index,
        });
      }
    }

    return { valid: true, matches };
  } catch (e: any) {
    return {
      valid: false,
      error: e.message,
      matches: [],
    };
  }
}
```

#### Component

**File:** `components/validators/RegexTester.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CodeEditor } from "@/components/CodeEditor";
import { testRegex } from "@/app/validators/actions";
import type { RegexTestResult } from "@/lib/validators/types";

const FLAGS = [
  { id: "g", label: "global", description: "Find all matches" },
  { id: "i", label: "case-insensitive", description: "Ignore case" },
  { id: "m", label: "multiline", description: "^ and $ match line starts/ends" },
  { id: "s", label: "dotall", description: ". matches newlines" },
  { id: "u", label: "unicode", description: "Unicode support" },
  { id: "y", label: "sticky", description: "Match from lastIndex" },
];

export function RegexTester({ example }: {
  example: { pattern: string; flags: string; testString: string }
}) {
  const [pattern, setPattern] = useState(example.pattern);
  const [flags, setFlags] = useState<Set<string>>(new Set(example.flags.split("")));
  const [testString, setTestString] = useState(example.testString);
  const [result, setResult] = useState<RegexTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    const testResult = await testRegex(pattern, Array.from(flags).join(""), testString);
    setResult(testResult);
    setIsTesting(false);
  };

  const toggleFlag = (flag: string) => {
    const newFlags = new Set(flags);
    if (newFlags.has(flag)) {
      newFlags.delete(flag);
    } else {
      newFlags.add(flag);
    }
    setFlags(newFlags);
  };

  return (
    <div className="space-y-4">
      {/* Regex Pattern */}
      <div>
        <label className="text-sm font-medium mb-2 block">Regular Expression Pattern</label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="w-full px-3 py-2 border rounded-md font-mono"
          placeholder="Enter regex pattern"
        />
      </div>

      {/* Flags */}
      <div>
        <label className="text-sm font-medium mb-2 block">Flags</label>
        <div className="flex flex-wrap gap-4">
          {FLAGS.map(flag => (
            <div key={flag.id} className="flex items-center gap-2">
              <Checkbox
                id={flag.id}
                checked={flags.has(flag.id)}
                onCheckedChange={() => toggleFlag(flag.id)}
              />
              <label htmlFor={flag.id} className="text-sm cursor-pointer">
                <span className="font-mono font-semibold">{flag.id}</span>
                {" "}
                <span className="text-muted-foreground">{flag.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="text-sm font-medium mb-2 block">Test String</label>
        <CodeEditor
          value={testString}
          onChange={setTestString}
          language="text"
          // TODO: Add match highlighting extension
        />
      </div>

      {/* Test Button */}
      <Button onClick={handleTest} disabled={isTesting} className="w-full sm:w-auto">
        {isTesting ? "Testing..." : "Test Regex"}
      </Button>

      {/* Results */}
      {result && <RegexResults result={result} />}
    </div>
  );
}

function RegexResults({ result }: { result: RegexTestResult }) {
  if (!result.valid) {
    return (
      <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10">
        <p className="text-sm text-destructive">{result.error}</p>
      </div>
    );
  }

  if (result.matches.length === 0) {
    return (
      <div className="p-4 rounded-md border">
        <p className="text-sm text-muted-foreground">No matches found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        ✓ {result.matches.length} {result.matches.length === 1 ? "match" : "matches"} found
      </p>
      {result.matches.map((match, idx) => (
        <MatchDetails key={idx} match={match} index={idx} />
      ))}
    </div>
  );
}

function MatchDetails({ match, index }: { match: RegexMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-3 rounded-md border">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center justify-between"
      >
        <span className="font-mono text-sm">
          Match {index + 1}: "{match.fullMatch}"
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && match.groups.length > 0 && (
        <div className="mt-2 pl-4 space-y-1">
          {match.groups.map((group, gidx) => (
            <div key={gidx} className="text-sm text-muted-foreground">
              Group {gidx + 1}: "{group}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Phase 9.4: HTML Validator (Day 7-8)

#### Server Action

```typescript
import { HtmlValidate } from "html-validate";

export async function validateHtml(input: string): Promise<ValidationResult> {
  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:recommended"],
  });

  const report = await htmlvalidate.validateString(input);
  const messages = report.results[0]?.messages || [];

  const errors = messages
    .filter(msg => msg.severity === 2)
    .map(msg => ({
      line: msg.line,
      column: msg.column,
      message: msg.message,
      severity: "error" as const,
    }));

  const warnings = messages
    .filter(msg => msg.severity === 1)
    .map(msg => ({
      line: msg.line,
      column: msg.column,
      message: msg.message,
      severity: "warning" as const,
    }));

  return {
    valid: report.valid,
    errors,
    warnings,
  };
}
```

---

### Phase 9.5: CSS Validator (Day 9)

#### Server Action

```typescript
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

export async function validateCss(input: string): Promise<ValidationResult> {
  try {
    const result = await postcss().process(input, {
      parser: safeParser,
      from: undefined,
    });

    const warnings = result.warnings().map(warning => ({
      line: warning.line || 1,
      column: warning.column || 1,
      message: warning.text,
      severity: "warning" as const,
    }));

    return {
      valid: warnings.length === 0,
      errors: [],
      warnings,
    };
  } catch (e: any) {
    return {
      valid: false,
      errors: [{
        line: 1,
        column: 1,
        message: e.message,
        severity: "error",
      }],
      warnings: [],
    };
  }
}
```

---

### Phase 9.6: XML Validator (Day 10)

#### Server Action

```typescript
import { parseStringPromise } from "xml2js";

export async function validateXml(input: string): Promise<ValidationResult> {
  try {
    await parseStringPromise(input, {
      strict: true,
      async: true,
    });

    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  } catch (e: any) {
    const lineMatch = e.message.match(/Line: (\d+)/);
    const columnMatch = e.message.match(/Column: (\d+)/);

    return {
      valid: false,
      errors: [{
        line: lineMatch ? parseInt(lineMatch[1]) : 1,
        column: columnMatch ? parseInt(columnMatch[1]) : 1,
        message: e.message,
        severity: "error",
      }],
      warnings: [],
    };
  }
}
```

---

### Phase 9.7: Integration & Data (Day 11-12)

#### Add to `lib/tools-data.ts`

```typescript
import { FileCheck, Bug, Code, Palette, Database } from "lucide-react";
import { validateJson, testRegex, validateHtml, validateCss, validateXml } from "../app/validators/actions";

export const VALIDATOR_TOOLS: Record<string, ValidatorTool> = {
  "json-validator": {
    id: "json",
    name: "JSON Validator",
    description: "Validate JSON syntax and optionally check against JSON Schema",
    url: "/validators/json-validator",
    icon: FileCheck,
    language: "json",
    example: VALIDATOR_EXAMPLES.json,
    metadata: {
      title: "JSON Validator | Codemata",
      description: "Validate JSON syntax and structure. Free online JSON validator with schema support.",
    },
  },
  "regex-tester": {
    id: "regex",
    name: "Regex Tester",
    description: "Test regular expressions and see matches in real-time",
    url: "/validators/regex-tester",
    icon: Bug,
    language: "text",
    example: VALIDATOR_EXAMPLES.regex.testString,
    metadata: {
      title: "Regex Tester | Codemata",
      description: "Test regular expressions with match highlighting. Free online regex tester.",
    },
  },
  // ... add HTML, CSS, XML similarly
};

// Add to ALL_TOOLS
export const ALL_TOOLS = {
  ...FORMATTER_TOOLS,
  ...MINIFIER_TOOLS,
  ...ENCODER_TOOLS,
  ...VALIDATOR_TOOLS,
};
```

#### Update Navigation

Add validators category to sidebar navigation with icon and tool list.

#### Update Sitemap

```typescript
// app/sitemap.ts
const validatorUrls = Object.values(VALIDATOR_TOOLS).map(tool => ({
  url: `${SITE_URL}${tool.url}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));

// Add to sitemap array
```

#### Update Search Index

```typescript
// lib/search-index.ts
const validatorEntries = Object.values(VALIDATOR_TOOLS).map(tool => ({
  id: tool.id,
  name: tool.name,
  description: tool.description,
  url: tool.url,
  category: 'validators',
  keywords: [tool.id, 'validate', 'check', 'test'],
}));
```

---

### Phase 9.8: AI Content Generation (Day 13)

Create validator-specific AI prompts that cover:

1. **How validation works** - Technical explanation
2. **Common errors** - What to look for
3. **Best practices** - How to write valid code
4. **CI/CD integration** - Using validators in pipelines
5. **Tool-specific tips** - Contextual recommendations

Generate content for all 5-6 validators using existing AI system patterns.

---

### Phase 9.9: Testing & Polish (Day 14-15)

#### Unit Tests
- Test all server actions
- Edge cases and error handling
- Schema validation edge cases
- Regex flag combinations

#### E2E Tests (Sample-Based)
```typescript
// tests/e2e/validators.spec.ts
test.describe("JSON Validator", () => {
  test("validates broken JSON and shows errors", async ({ page }) => {
    await page.goto("/validators/json-validator");

    // Example is pre-loaded with broken JSON
    await page.click('button:has-text("Validate JSON")');

    // Should show error
    await expect(page.locator("text=Error")).toBeVisible();

    // Click error should scroll to line
    await page.click('button:has-text("Line")').first();

    // Editor should be focused
    await expect(page.locator(".cm-editor")).toBeFocused();
  });
});
```

#### Mobile Testing
- Test on iPhone 13 viewport
- Verify touch targets ≥ 44px
- Check responsive layout
- Test collapsible schema

#### Accessibility
- Keyboard navigation
- Screen reader labels
- Color contrast
- Focus management

---

## Testing Strategy

### Unit Tests

**Coverage Requirements:**
- All server actions (100%)
- Shared utilities (100%)
- Error parsing functions (100%)

**Test Cases:**
- Valid input
- Invalid input (various error types)
- Edge cases (empty, very large)
- Optional parameters (schema, flags)

### E2E Tests

**Sample-Based Approach:**
- Test 1-2 representative validators (JSON + HTML)
- Test shared behavior once (validation flow, error clicking)
- Desktop + mobile viewports

**Test Scenarios:**
- Pre-loaded broken example validates and shows errors
- Click error scrolls to line and highlights
- Success state shows metadata
- Mobile layout works correctly

### Accessibility Tests

**Standards:**
- WCAG 2.1 Level AA
- Keyboard navigation
- Screen reader compatibility
- Color contrast (4.5:1 minimum)

**Checks:**
- All interactive elements keyboard accessible
- Error panel items have proper labels
- Color not sole indicator (icons + text)
- Focus indicators visible

---

## Success Criteria

### Functional Requirements
- [ ] 5-6 validators working end-to-end
- [ ] Inline error highlighting via CodeMirror lint
- [ ] Error panel with clickable errors
- [ ] Smooth scroll to error on click
- [ ] Pre-loaded broken examples
- [ ] Schema validation for JSON (collapsible)
- [ ] Match highlighting for Regex
- [ ] Mobile-optimized layouts
- [ ] Validation button states (loading, disabled)

### Quality Requirements
- [ ] All unit tests passing (100% coverage for actions)
- [ ] E2E tests covering sample validators
- [ ] WCAG 2.1 Level AA compliance
- [ ] Lighthouse scores ≥90% (performance, accessibility, SEO)
- [ ] AI content generated for all tools
- [ ] No console errors or warnings

### Integration Requirements
- [ ] Tools appear in navigation sidebar
- [ ] Search index includes validators
- [ ] Sitemap includes validator pages
- [ ] OG images generated
- [ ] Command menu includes validators
- [ ] Category landing page lists all validators
- [ ] Recent tools tracking works

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **9.1 Foundation** | 2 days | Shared utilities + structure |
| **9.2 JSON Validator** | 2 days | Full JSON validator with schema |
| **9.3 Regex Tester** | 2 days | Regex tester with highlighting |
| **9.4 HTML Validator** | 2 days | HTML validator with html-validate |
| **9.5 CSS Validator** | 1 day | CSS syntax validator |
| **9.6 XML Validator** | 1 day | XML structure validator |
| **9.7 Integration** | 2 days | Site integration + data updates |
| **9.8 AI Content** | 1 day | Generate AI content for all tools |
| **9.9 Testing** | 2 days | Unit + E2E + accessibility tests |
| **9.10 Deploy** | 1 day | Production deployment + monitoring |
| **Total** | **16 days** | **5-6 validators live** |

**Buffer for unknowns:** +2 days = **18 days total**

---

## Dependencies

### NPM Packages

```json
{
  "dependencies": {
    "@codemirror/lint": "^6.x",
    "ajv": "^8.x",
    "html-validate": "^8.x",
    "postcss": "^8.x",
    "postcss-safe-parser": "^6.x",
    "xml2js": "^0.6.x"
  },
  "devDependencies": {
    "@types/xml2js": "^0.4.x"
  }
}
```

### CodeMirror Extensions

- `@codemirror/lint` - Error/warning decorations
- `@codemirror/view` - Scroll and highlight utilities
- Language modes already installed (json, html, css, xml)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| CodeMirror lint integration complexity | Medium | Use existing lint API, reference docs |
| Error line/column parsing varies by library | Medium | Create standardized conversion utilities |
| Match highlighting performance (Regex) | Low | Limit test string length, debounce |
| Schema validation complexity | Medium | Start simple, iterate based on feedback |
| Mobile layout issues | Low | Test early, use existing responsive patterns |

---

## Post-Launch

### Metrics to Track

**Week 1:**
- Validator page views
- Validation button clicks
- Error panel interactions
- Mobile vs desktop usage

**Month 1:**
- Organic search traffic
- Time on page
- Return visitor rate
- Most popular validator

### Iteration Opportunities

**Based on Analytics:**
1. Add more validators (URL, OpenAPI, etc.)
2. Enhance JSON validator with examples
3. Add "Copy Fixed Code" button
4. Visual regex diagram generator
5. Dark mode syntax highlighting optimization

**Based on User Feedback:**
1. Export validation reports
2. Batch validation (multiple files)
3. Custom validation rules
4. Integration with code editors (via API)

---

## Notes

- **Bespoke UI:** Each validator has unique needs, resist premature abstraction
- **Shared Utilities:** Focus on diagnostics and error handling, not UI components
- **Example Data:** Must be broken by default to demonstrate value immediately
- **Mobile First:** Test on mobile throughout development, not at the end
- **AI Content:** Generate after tools work, don't block on content
- **Progressive Enhancement:** Tools work without JS for basic validation

---

## Resources

- [CodeMirror Lint Documentation](https://codemirror.net/docs/ref/#lint)
- [ajv JSON Schema Documentation](https://ajv.js.org/)
- [html-validate Documentation](https://html-validate.org/)
- [PostCSS Documentation](https://postcss.org/)
- [xml2js Documentation](https://github.com/Leonidas-from-XIV/node-xml2js)

---

**Specification Status:** ✅ Complete and ready for implementation

**Next Step:** Create feature branch and begin Phase 9.1 (Foundation)
