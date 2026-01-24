"use server";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { ValidationResult, ValidationError } from "@/lib/validators/types";

/**
 * Parse JSON syntax errors and extract line/column
 */
function parseSyntaxError(input: string, error: Error): ValidationError {
  // Try to extract position from error message
  const posMatch = error.message.match(/position (\d+)/);

  if (posMatch) {
    const pos = Number.parseInt(posMatch[1]);
    const lines = input.slice(0, pos).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return {
      line,
      column,
      message: error.message.replace(/^JSON\.parse: /, ""),
      severity: "error",
    };
  }

  // Fallback to line 1 if we can't parse position
  return {
    line: 1,
    column: 1,
    message: error.message,
    severity: "error",
  };
}

/**
 * Convert ajv validation errors to our format
 */
function convertAjvErrors(errors: any[]): ValidationError[] {
  return errors.map((err) => ({
    line: 1, // ajv doesn't provide line numbers
    column: 1,
    message: `${err.instancePath || "/"}: ${err.message}`,
    severity: "error" as const,
  }));
}

/**
 * Calculate metadata about valid JSON
 */
function calculateMetadata(parsed: any, input: string): Record<string, any> {
  const type = Array.isArray(parsed) ? "array" : typeof parsed;

  const metadata: Record<string, any> = {
    type,
    bytes: new TextEncoder().encode(input).length,
  };

  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    metadata.properties = Object.keys(parsed).length;
  }

  if (Array.isArray(parsed)) {
    metadata.items = parsed.length;
  }

  return metadata;
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
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (e: any) {
    return {
      valid: false,
      errors: [parseSyntaxError(input, e)],
      warnings: [],
    };
  }

  // Step 2: Schema validation (if provided)
  if (schema && schema.trim()) {
    try {
      const schemaObj = JSON.parse(schema);
      const ajv = new Ajv({ allErrors: true, strict: false });
      addFormats(ajv); // Add format validators (email, uri, etc.)

      const validate = ajv.compile(schemaObj);

      if (!validate(parsed)) {
        errors.push(...convertAjvErrors(validate.errors || []));
      }
    } catch (schemaError: any) {
      errors.push({
        line: 1,
        column: 1,
        message: `Invalid JSON Schema: ${schemaError.message}`,
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
    metadata: calculateMetadata(parsed, input),
  };
}
