"use server";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as csstree from "css-tree";
import { XMLValidator } from "fast-xml-parser";
import { HtmlValidate } from "html-validate";
import type { ValidationError, ValidationResult } from "@/lib/validators/types";

/**
 * Parse JSON syntax errors and extract line/column
 */
function parseSyntaxError(input: string, error: unknown): ValidationError {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Try to extract position from error message
  const posMatch = errorMessage.match(/position (\d+)/);

  if (posMatch) {
    const pos = Number.parseInt(posMatch[1], 10);
    // Guard against invalid positions
    if (pos <= 0 || pos > input.length) {
      return {
        line: 1,
        column: 1,
        message: errorMessage.replace(/^JSON\.parse: /, ""),
        severity: "error",
      };
    }
    const lines = input.slice(0, pos).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return {
      line,
      column,
      message: errorMessage.replace(/^JSON\.parse: /, ""),
      severity: "error",
    };
  }

  // Fallback to line 1 if we can't parse position
  return {
    line: 1,
    column: 1,
    message: errorMessage,
    severity: "error",
  };
}

/**
 * Convert ajv validation errors to our format
 */
function convertAjvErrors(errors: unknown[]): ValidationError[] {
  return errors.map((err) => {
    const error = err as { instancePath?: string; message?: string };
    return {
      line: 1, // ajv doesn't provide line numbers
      column: 1,
      message: `${error.instancePath || "/"}: ${error.message || "validation error"}`,
      severity: "error" as const,
    };
  });
}

/**
 * Validate JSON with optional schema validation
 */
export async function validateJson(
  input: string,
  schema?: string,
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  // Step 1: Syntax validation
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e: unknown) {
    return {
      valid: false,
      errors: [parseSyntaxError(input, e)],
      warnings: [],
    };
  }

  // Step 2: Schema validation (if provided)
  if (schema?.trim()) {
    try {
      const schemaObj = JSON.parse(schema);
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv); // Add format validators (email, uri, etc.)

      const validate = ajv.compile(schemaObj);

      if (!validate(parsed)) {
        errors.push(...convertAjvErrors(validate.errors || []));
      }
    } catch (schemaError: unknown) {
      const errorMessage =
        schemaError instanceof Error
          ? schemaError.message
          : String(schemaError);
      errors.push({
        line: 1,
        column: 1,
        message: `Invalid JSON Schema: ${errorMessage}`,
        severity: "error",
      });
    }
  }

  // Step 3: Return result
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      warnings: [],
    };
  }

  return {
    valid: true,
    errors: [],
    warnings: [],
    metadata: { toolName: "JSON" },
  };
}

/**
 * Validate HTML structure, accessibility, and best practices
 */
export async function validateHtml(input: string): Promise<ValidationResult> {
  const htmlvalidate = new HtmlValidate({
    extends: ["html-validate:recommended"],
  });

  const report = await htmlvalidate.validateString(input);

  // Extract errors (severity 2) and warnings (severity 1)
  const messages = report.results?.[0]?.messages || [];

  const errors: ValidationError[] = messages
    .filter((msg: { severity: number }) => msg.severity === 2)
    .map((msg: { line?: number; column?: number; message: string }) => ({
      line: msg.line ?? 1,
      column: msg.column ?? 1,
      message: msg.message,
      severity: "error" as const,
    }));

  const warnings: ValidationError[] = messages
    .filter((msg: { severity: number }) => msg.severity === 1)
    .map((msg: { line?: number; column?: number; message: string }) => ({
      line: msg.line ?? 1,
      column: msg.column ?? 1,
      message: msg.message,
      severity: "warning" as const,
    }));

  return {
    valid: errors.length === 0 && warnings.length === 0,
    errors,
    warnings,
    metadata: { toolName: "HTML" },
  };
}

/**
 * Validate CSS syntax using css-tree parser
 */
export async function validateCss(input: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Parse CSS with css-tree (strict parser that catches syntax errors)
    csstree.parse(input, {
      onParseError: (error) => {
        errors.push({
          line: error.line,
          column: error.column,
          message: error.message,
          severity: "error",
        });
      },
    });

    return {
      valid: errors.length === 0 && warnings.length === 0,
      errors,
      warnings,
      metadata: { toolName: "CSS" },
    };
  } catch (error: unknown) {
    // Fallback for unexpected errors
    if (error instanceof Error) {
      errors.push({
        line: 1,
        column: 1,
        message: error.message,
        severity: "error",
      });
    } else {
      errors.push({
        line: 1,
        column: 1,
        message: String(error),
        severity: "error",
      });
    }

    return {
      valid: false,
      errors,
      warnings,
      metadata: { toolName: "CSS" },
    };
  }
}

/**
 * Format XML error messages to be more user-friendly
 */
function formatXmlErrorMessage(message: string): string {
  // Convert technical messages to user-friendly language
  if (message.includes("Expected closing tag")) {
    // Extract tag names from message like:
    // "Expected closing tag 'mismatched' (opened in line 4, col 3) instead of closing tag 'wrong'."
    const match = message.match(
      /Expected closing tag '([^']+)'.*instead of closing tag '([^']+)'/,
    );
    if (match) {
      return `Mismatched tag: expected </${match[1]}>, found </${match[2]}>`;
    }
  }

  if (
    message.includes("Closing tag") &&
    message.includes("doesn't have matching Opening tag")
  ) {
    const match = message.match(/Closing tag '([^']+)'/);
    if (match) {
      return `Unexpected closing tag </${match[1]}> without matching opening tag`;
    }
  }

  if (message.includes("Unclosed tag")) {
    const match = message.match(/Unclosed tag '([^']+)'/);
    if (match) {
      return `Missing closing tag for <${match[1]}>`;
    }
  }

  // Return original message if no pattern matches
  return message;
}

/**
 * Validate XML structure and well-formedness
 */
export async function validateXml(input: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!input.trim()) {
    errors.push({
      line: 1,
      column: 1,
      message: "XML input is empty",
      severity: "error",
    });

    return {
      valid: false,
      errors,
      warnings,
      metadata: { toolName: "XML" },
    };
  }

  try {
    // Validate with fast-xml-parser (provides excellent line/column info)
    const validationResult = XMLValidator.validate(input, {
      allowBooleanAttributes: true,
    });

    if (validationResult === true) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        metadata: { toolName: "XML" },
      };
    }

    // Extract error with line/column info
    const error = validationResult.err;
    errors.push({
      line: error.line || 1,
      column: error.col || 1,
      message: formatXmlErrorMessage(error.msg),
      severity: "error",
    });

    return {
      valid: false,
      errors,
      warnings,
      metadata: { toolName: "XML" },
    };
  } catch (error: unknown) {
    // Handle unexpected failures
    errors.push({
      line: 1,
      column: 1,
      message: error instanceof Error ? error.message : "Validation failed",
      severity: "error",
    });

    return {
      valid: false,
      errors,
      warnings,
      metadata: { toolName: "XML" },
    };
  }
}
