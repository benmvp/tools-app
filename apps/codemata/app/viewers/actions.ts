"use server";

import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import type { Tokens } from "marked";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { codeToHtml } from "shiki";
import { MAX_VIEWER_INPUT_SIZE } from "@/lib/viewers/constants";

const LANGUAGE_ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	sh: "bash",
	yml: "yaml",
};

extend([namesPlugin]);

const SAFE_COLOR_VALUES = new Set(["inherit", "currentcolor", "transparent"]);

const ANY_STYLE_VALUE = [/^[\s\S]*$/];

type AttributeMap = sanitizeHtml.Attributes;

function isSafeColor(value: unknown): boolean {
	if (typeof value !== "string") {
		return false;
	}
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		return false;
	}
	const normalized = trimmed.toLowerCase();
	if (SAFE_COLOR_VALUES.has(normalized)) {
		return true;
	}
	const parsed = colord(trimmed);
	return parsed.isValid();
}

const STYLE_VALIDATORS: Record<string, (value: string) => boolean> = {
	color: (value) => isSafeColor(value),
	"background-color": (value) => isSafeColor(value),
	"font-style": (value) => /^(?:normal|italic)$/i.test(value.trim()),
	"font-weight": (value) => /^(?:normal|bold|[1-9]00)$/i.test(value.trim()),
	"text-decoration": (value) =>
		/^(?:none|underline|line-through)$/i.test(value.trim()),
	"text-decoration-line": (value) =>
		/^(?:none|underline|line-through)$/i.test(value.trim()),
};

function sanitizeStyleValue(styleValue: string): string | undefined {
	const declarations = styleValue
		.split(";")
		.map((declaration) => declaration.trim())
		.filter(Boolean);

	const sanitized: string[] = [];

	for (const declaration of declarations) {
		const [propertyRaw, ...valueParts] = declaration.split(":");
		if (!propertyRaw || valueParts.length === 0) {
			continue;
		}

		const property = propertyRaw.trim().toLowerCase();
		if (!property) {
			continue;
		}

		const value = valueParts.join(":").trim();
		if (!value || value.includes("!important")) {
			continue;
		}

		const validator = STYLE_VALIDATORS[property];
		if (!validator || !validator(value)) {
			continue;
		}

		sanitized.push(`${property}: ${value}`);
	}

	if (sanitized.length === 0) {
		return undefined;
	}

	return sanitized.join("; ");
}

// Re-validate inline styles with structured checks to avoid brittle regex patterns.
function transformStyle(
	tagName: string,
	attribs: AttributeMap,
): sanitizeHtml.Tag {
	if (!attribs || typeof attribs.style !== "string") {
		return { tagName, attribs };
	}

	const sanitizedStyle = sanitizeStyleValue(attribs.style);
	const nextAttribs: AttributeMap = { ...attribs };

	if (sanitizedStyle) {
		nextAttribs.style = sanitizedStyle;
	} else {
		delete nextAttribs.style;
	}

	return { tagName, attribs: nextAttribs };
}

/**
 * Configure marked with GitHub Flavored Markdown (GFM) support
 */
marked.setOptions({
	gfm: true, // GitHub Flavored Markdown
	breaks: true, // Convert \n to <br>
});

marked.use({
	async: true,
	walkTokens: async (token) => {
		if (token.type !== "code") {
			return;
		}

		const codeToken = token as Tokens.Code;
		const rawLanguage = codeToken.lang || "text";
		const sanitizedLanguage = rawLanguage.match(/^[a-z0-9-]+$/i)
			? rawLanguage
			: "text";

		try {
			const normalizedLang =
				LANGUAGE_ALIASES[sanitizedLanguage] || sanitizedLanguage;
			const highlighted = await codeToHtml(codeToken.text, {
				lang: normalizedLang,
				themes: {
					light: "github-light",
					dark: "github-dark",
				},
			});
			codeToken.text = highlighted;
			codeToken.lang = "__shiki__";
		} catch {
			codeToken.lang = sanitizedLanguage;
		}
	},
});

/**
 * Preview markdown with server-side rendering
 * Converts markdown to sanitized HTML with syntax-highlighted code blocks
 *
 * @param input - Raw markdown text
 * @returns Sanitized HTML string
 * @throws Error if input exceeds size limit or parsing fails
 */
export async function previewMarkdown(input: string): Promise<string> {
	// Validate input size
	const inputSize = new TextEncoder().encode(input).length;
	if (inputSize > MAX_VIEWER_INPUT_SIZE) {
		throw new Error(
			`Input too large. Maximum size is ${MAX_VIEWER_INPUT_SIZE / 1024}KB (~${Math.floor(MAX_VIEWER_INPUT_SIZE / 4)} words). Your input is ${Math.ceil(inputSize / 1024)}KB.`,
		);
	}

	try {
		// Custom renderer to use pre-highlighted code
		const renderer = new marked.Renderer();
		renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
			// If pre-rendered by Shiki, return as-is
			if (lang === "__shiki__") {
				return text;
			}
			// Fallback to plain code block
			const sanitizedLanguage = (lang || "text").match(/^[a-z0-9-]+$/i)
				? lang
				: "text";
			return `<pre><code class="language-${sanitizedLanguage}">${escapeHtml(text)}</code></pre>`;
		};

		// Parse markdown to HTML
		const html = await marked.parse(input, { renderer });

		// Sanitize HTML to prevent XSS attacks
		const sanitized = sanitizeHtml(html, {
			// Allow common HTML elements
			allowedTags: [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"p",
				"br",
				"hr",
				"strong",
				"em",
				"del",
				"ul",
				"ol",
				"li",
				"a",
				"blockquote",
				"code",
				"pre",
				"table",
				"thead",
				"tbody",
				"tr",
				"th",
				"td",
				"div",
				"span",
				"img",
				"input",
			],
			// Allow common attributes
			allowedAttributes: {
				a: ["href", "title"],
				img: ["src", "alt", "title"],
				input: ["type", "checked", "disabled"],
				pre: ["class", "style"],
				code: ["class", "style", "data-language", "data-theme"],
				span: ["class", "style"],
				"*": ["class", "id", "data-*"],
			},
			allowedStyles: {
				pre: {
					color: ANY_STYLE_VALUE,
					"background-color": ANY_STYLE_VALUE,
				},
				code: {
					color: ANY_STYLE_VALUE,
					"background-color": ANY_STYLE_VALUE,
				},
				span: {
					color: ANY_STYLE_VALUE,
					"background-color": ANY_STYLE_VALUE,
					"font-style": ANY_STYLE_VALUE,
					"font-weight": ANY_STYLE_VALUE,
					"text-decoration": ANY_STYLE_VALUE,
					"text-decoration-line": ANY_STYLE_VALUE,
				},
			},
			transformTags: {
				pre: transformStyle,
				code: transformStyle,
				span: transformStyle,
			},
			// Keep relative links for markdown
			allowProtocolRelative: true,
			// Don't strip unknown protocols (keep relative links)
			allowedSchemes: ["http", "https", "mailto"],
		});

		return sanitized;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to preview markdown: ${error.message}`);
		}
		throw new Error("Failed to preview markdown: Unknown error");
	}
}

/**
 * Escape HTML special characters
 * Used as fallback when syntax highlighting fails
 */
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	};
	return text.replace(/[&<>"']/g, (char) => map[char]);
}
