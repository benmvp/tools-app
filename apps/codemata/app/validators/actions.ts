"use server";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as csstree from "css-tree";
import { XMLValidator } from "fast-xml-parser";
import { HtmlValidate } from "html-validate";
import yaml from "js-yaml";
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

/**
 * Parse query parameters from URLSearchParams, handling array values
 */
function parseQueryParams(
	searchParams: URLSearchParams,
): Array<{ key: string; value: string | string[] }> {
	const params: Array<{ key: string; value: string | string[] }> = [];
	const processedKeys = new Set<string>();

	for (const key of searchParams.keys()) {
		if (processedKeys.has(key)) continue;
		processedKeys.add(key);

		const values = searchParams.getAll(key);
		params.push({
			key,
			value: values.length === 1 ? values[0] : values,
		});
	}

	return params;
}

/**
 * Get default port for a protocol
 */
function getDefaultPort(protocol: string): string | null {
	const defaults: Record<string, string> = {
		"http:": "80",
		"https:": "443",
		"ftp:": "21",
		"ws:": "80",
		"wss:": "443",
	};
	return defaults[protocol] || null;
}

/**
 * Validate URLs (multiple URLs, one per line)
 * Returns parsed URL components and validation errors
 */
export async function validateUrl(input: string): Promise<{
	validCount: number;
	errorCount: number;
	urls: Array<{
		line: number;
		url: string;
		valid: boolean;
		error?: string;
		parsed?: {
			protocol: string;
			hostname: string;
			port?: string;
			pathname?: string;
			query?: Array<{ key: string; value: string | string[] }>;
			hash?: string;
			username?: string;
			password?: string;
		};
	}>;
}> {
	const lines = input.split("\n");
	const urls: Array<{
		line: number;
		url: string;
		valid: boolean;
		error?: string;
		parsed?: {
			protocol: string;
			hostname: string;
			port?: string;
			pathname?: string;
			query?: Array<{ key: string; value: string | string[] }>;
			hash?: string;
			username?: string;
			password?: string;
		};
	}> = [];
	let validCount = 0;
	let errorCount = 0;

	for (const [index, line] of lines.entries()) {
		const trimmed = line.trim();

		// Skip empty lines
		if (!trimmed) continue;

		const lineNumber = index + 1;

		try {
			const parsed = new URL(trimmed);

			// Extract smart metadata
			const port = parsed.port;
			const defaultPort = getDefaultPort(parsed.protocol);
			const hasNonDefaultPort = port && port !== defaultPort;

			const pathname = parsed.pathname !== "/" ? parsed.pathname : undefined;
			const query = parsed.search
				? parseQueryParams(parsed.searchParams)
				: undefined;
			const hash = parsed.hash
				? decodeURIComponent(parsed.hash.slice(1))
				: undefined;
			const username = parsed.username || undefined;
			const password = parsed.password ? "[redacted]" : undefined;

			urls.push({
				line: lineNumber,
				url: trimmed,
				valid: true,
				parsed: {
					protocol: parsed.protocol.slice(0, -1), // Remove trailing ":"
					hostname: parsed.hostname,
					port: hasNonDefaultPort ? port : undefined,
					pathname,
					query,
					hash,
					username,
					password,
				},
			});

			validCount++;
		} catch (error) {
			let errorMessage = "Invalid URL";

			if (error instanceof TypeError) {
				const msg = error.message.toLowerCase();

				// Detect common errors and provide helpful messages
				if (msg.includes("invalid url")) {
					if (!trimmed.includes("://")) {
						errorMessage = `Missing protocol (try https://${trimmed})`;
					} else if (trimmed.startsWith("/")) {
						errorMessage = "Not a valid URL (must include protocol and domain)";
					} else {
						// Extract protocol if malformed
						const protocolMatch = trimmed.match(/^(\w+):\/\//);
						if (protocolMatch) {
							const protocol = protocolMatch[1];
							errorMessage = `Invalid URL: Unknown protocol '${protocol}' (try http://)`;
						} else {
							errorMessage = "Invalid URL syntax";
						}
					}
				}
			}

			urls.push({
				line: lineNumber,
				url: trimmed,
				valid: false,
				error: errorMessage,
			});

			errorCount++;
		}
	}

	return {
		validCount,
		errorCount,
		urls,
	};
}

/**
 * Validate Dockerfile syntax and best practices
 */
export async function validateDockerfile(
	input: string,
): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	// Check for empty input
	if (!input.trim()) {
		return {
			valid: false,
			errors: [
				{
					line: 1,
					column: 1,
					message: "Dockerfile is empty",
					severity: "error",
				},
			],
			warnings: [],
		};
	}

	// Use dynamic import to avoid issues with CJS module
	const dockerfilelint = await import("dockerfilelint");

	try {
		// Run dockerfilelint
		const results = dockerfilelint.run("", input);

		// Process each result item
		for (const item of results) {
			// Skip null items (disabled rules)
			if (!item) continue;

			// Determine severity based on category
			let severity: "error" | "warning" | "info" = "warning";
			if (item.category === "Possible Bug") {
				severity = "error";
			} else if (
				item.category === "Clarity" ||
				item.category === "Optimization"
			) {
				severity = "warning";
			}

			// Create validation error
			const validationError: ValidationError = {
				line: item.line || 1,
				column: 1, // dockerfilelint doesn't provide column info
				message: item.title || item.description || "Unknown error",
				severity,
			};

			// Add to appropriate array
			if (severity === "error") {
				errors.push(validationError);
			} else {
				warnings.push(validationError);
			}
		}

		return {
			valid: errors.length === 0,
			errors,
			warnings,
			metadata: { toolName: "Dockerfile" },
		};
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Validation failed";

		return {
			valid: false,
			errors: [
				{
					line: 1,
					column: 1,
					message: errorMessage,
					severity: "error",
				},
			],
			warnings: [],
			metadata: { toolName: "Dockerfile" },
		};
	}
}

/**
 * Validate YAML syntax and structure
 * Detects duplicate keys and provides detailed error messages
 */
export async function validateYaml(input: string): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	// Empty input check
	if (!input.trim()) {
		return {
			valid: false,
			errors: [
				{
					line: 1,
					column: 1,
					message: "Empty input. Please provide YAML content to validate.",
					severity: "error",
				},
			],
			warnings: [],
			metadata: { toolName: "YAML" },
		};
	}

	try {
		// Parse YAML - will throw on syntax errors and duplicate keys
		yaml.load(input, {
			filename: "input.yaml",
			onWarning: (warning: yaml.YAMLException) => {
				warnings.push({
					line: warning.mark?.line ? warning.mark.line + 1 : 1,
					column: warning.mark?.column ? warning.mark.column + 1 : 1,
					message: warning.message || "YAML warning",
					severity: "warning",
				});
			},
		});

		// Success
		return {
			valid: true,
			errors: [],
			warnings,
			metadata: { toolName: "YAML" },
		};
	} catch (error: unknown) {
		// Handle YAML parsing errors
		if (error instanceof yaml.YAMLException) {
			// Check if this is a duplicate key error (should be a warning, not an error)
			// Use error.reason for stable detection (not affected by formatting/line numbers)
			if (error.reason === "duplicated mapping key") {
				warnings.push({
					line: error.mark?.line ? error.mark.line + 1 : 1,
					column: error.mark?.column ? error.mark.column + 1 : 1,
					message: "Duplicate key detected (last value wins)",
					severity: "warning",
				});

				// Parse is still valid, just with a warning
				return {
					valid: true,
					errors: [],
					warnings,
					metadata: { toolName: "YAML" },
				};
			}

			// All other YAML errors are actual errors
			errors.push({
				line: error.mark?.line ? error.mark.line + 1 : 1,
				column: error.mark?.column ? error.mark.column + 1 : 1,
				message: error.reason || error.message || "YAML syntax error",
				severity: "error",
			});
		} else {
			// Unexpected error
			const errorMessage =
				error instanceof Error ? error.message : "Validation failed";
			errors.push({
				line: 1,
				column: 1,
				message: errorMessage,
				severity: "error",
			});
		}

		return {
			valid: false,
			errors,
			warnings,
			metadata: { toolName: "YAML" },
		};
	}
}
