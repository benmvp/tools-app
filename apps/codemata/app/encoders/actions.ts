"use server";

import type { EncoderMode } from "@repo/shared";
import jwt from "jsonwebtoken";

/**
 * Base64 Encoder/Decoder
 */
export async function encodeBase64(
	input: string,
	mode: EncoderMode,
): Promise<string> {
	if (!input || input.trim() === "") {
		throw new Error("Input cannot be empty");
	}

	try {
		if (mode === "encode") {
			return Buffer.from(input, "utf-8").toString("base64");
		} else {
			return Buffer.from(input, "base64").toString("utf-8");
		}
	} catch (error) {
		throw new Error(
			`Base64 ${mode} failed: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

/**
 * URL Encoder/Decoder
 */
export async function encodeUrl(
	input: string,
	mode: EncoderMode,
): Promise<string> {
	if (!input || input.trim() === "") {
		throw new Error("Input cannot be empty");
	}

	try {
		if (mode === "encode") {
			return encodeURIComponent(input);
		} else {
			return decodeURIComponent(input);
		}
	} catch (error) {
		throw new Error(
			`URL ${mode} failed: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

/**
 * HTML Entity Encoder/Decoder
 * Uses native Node.js approach for encoding/decoding HTML entities
 */
export async function encodeHtmlEntity(
	input: string,
	mode: EncoderMode,
): Promise<string> {
	if (!input || input.trim() === "") {
		throw new Error("Input cannot be empty");
	}

	try {
		if (mode === "encode") {
			// Encode HTML entities manually
			return input
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#39;");
		} else {
			// Decode HTML entities - decode &amp; LAST to avoid breaking other entities
			return input
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&#39;/g, "'")
				.replace(/&#x27;/g, "'")
				.replace(/&#x2F;/g, "/")
				.replace(/&amp;/g, "&");
		}
	} catch (error) {
		throw new Error(
			`HTML Entity ${mode} failed: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

// Unescape special characters
// Use placeholder strategy to preserve literal backslashes
// Using a unique string token that's extremely unlikely to appear in user input
const BACKSLASH_PLACEHOLDER = "__ESCAPED_BACKSLASH_PLACEHOLDER_xF3zQ9__";

/**
 * JavaScript String Encoder/Decoder
 * Encodes/decodes JavaScript string literals (escapes special characters)
 */
export async function encodeJsString(
	input: string,
	mode: EncoderMode,
): Promise<string> {
	if (!input || input.trim() === "") {
		throw new Error("Input cannot be empty");
	}

	try {
		if (mode === "encode") {
			// Encode: Escape special characters and wrap in quotes
			const escaped = input
				.replace(/\\/g, "\\\\")
				.replace(/"/g, '\\"')
				.replace(/'/g, "\\'")
				.replace(/\n/g, "\\n")
				.replace(/\r/g, "\\r")
				.replace(/\t/g, "\\t")
				.replace(/\f/g, "\\f")
				.replace(/\v/g, "\\v")
				.replace(/\0/g, "\\0");
			return `"${escaped}"`;
		} else {
			// Decode: Remove quotes and unescape
			let decoded = input.trim();
			// Remove surrounding quotes if present
			if (
				(decoded.startsWith('"') && decoded.endsWith('"')) ||
				(decoded.startsWith("'") && decoded.endsWith("'"))
			) {
				decoded = decoded.slice(1, -1);
			}

			/**
			 * CRITICAL: Escape sequence processing order
			 *
			 * Problem: Escaped backslashes (\\) must be handled carefully to avoid
			 * misinterpreting sequences like \\n (backslash + n) as \n (newline).
			 *
			 * Solution: Use placeholder strategy
			 * 1. Replace \\\\ with placeholder (protects literal backslashes)
			 * 2. Process all other escape sequences (\n, \t, etc.)
			 * 3. Restore placeholder back to single backslash
			 *
			 * Example: "\\\\n" → placeholder+"n" → placeholder+"n" → "\\n" (backslash+n, NOT newline)
			 */
			return decoded
				.replace(/\\\\/g, BACKSLASH_PLACEHOLDER) // Step 1: Protect escaped backslashes
				.replace(/\\"/g, '"')
				.replace(/\\'/g, "'")
				.replace(/\\n/g, "\n")
				.replace(/\\r/g, "\r")
				.replace(/\\t/g, "\t")
				.replace(/\\f/g, "\f")
				.replace(/\\v/g, "\v")
				.replace(/\\0/g, "\0")
				.replace(new RegExp(BACKSLASH_PLACEHOLDER, "g"), "\\"); // Step 3: Restore literal backslashes
		}
	} catch (error) {
		throw new Error(
			`JavaScript String ${mode} failed: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}

/**
 * JWT Decoder (decode-only)
 * Returns nested JSON structure with header and payload
 */
export async function decodeJwt(input: string): Promise<string> {
	if (!input || input.trim() === "") {
		throw new Error("JWT token cannot be empty");
	}

	try {
		const decoded = jwt.decode(input, { complete: true });

		if (!decoded || typeof decoded !== "object" || !("header" in decoded)) {
			throw new Error("Invalid JWT format");
		}

		// Return nested JSON structure
		return JSON.stringify(
			{
				header: decoded.header,
				payload: decoded.payload,
			},
			null,
			2,
		);
	} catch (error) {
		throw new Error(
			`JWT decode failed: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}
}
