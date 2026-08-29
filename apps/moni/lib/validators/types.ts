import type { ValidationError, ValidationResult } from "@repo/shared";
import type { LucideIcon } from "lucide-react";

// Re-export for backwards compatibility with existing imports
export type { ValidationError, ValidationResult };

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

// URL-specific types
export interface ParsedUrl {
	line: number; // Line number in textarea (1-indexed)
	url: string; // Original URL string
	valid: boolean;
	error?: string; // Error message if invalid
	parsed?: {
		protocol: string; // "https", "http", "ftp", etc.
		hostname: string; // "example.com"
		port?: string; // Only if non-default (not 80/443)
		pathname?: string; // Only if not just "/"
		query?: QueryParam[]; // Parsed query parameters
		hash?: string; // Fragment without # symbol
		username?: string; // For FTP URLs
		password?: string; // Always "[redacted]" if present
	};
}

export interface QueryParam {
	key: string;
	value: string | string[]; // Array for duplicate keys
}

export interface UrlValidationResult {
	validCount: number;
	errorCount: number;
	urls: ParsedUrl[];
}
