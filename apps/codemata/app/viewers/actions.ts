"use server";

import type { Tokens } from "marked";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { codeToHtml } from "shiki";
import { MAX_VIEWER_INPUT_SIZE } from "@/lib/viewers/constants";

/**
 * Configure marked with GitHub Flavored Markdown (GFM) support
 */
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
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
    // Use walkTokens to pre-process code blocks asynchronously
    // Store highlighted HTML in token for later rendering
    marked.use({
      async: true,
      walkTokens: async (token) => {
        if (token.type === "code") {
          const codeToken = token as Tokens.Code;
          // Sanitize language to prevent HTML injection (allow only alphanumeric + hyphens)
          const rawLanguage = codeToken.lang || "text";
          const sanitizedLanguage = rawLanguage.match(/^[a-z0-9-]+$/i)
            ? rawLanguage
            : "text";

          try {
            // Normalize common language aliases
            const languageMap: Record<string, string> = {
              js: "javascript",
              ts: "typescript",
              sh: "bash",
              yml: "yaml",
            };
            const normalizedLang =
              languageMap[sanitizedLanguage] || sanitizedLanguage;

            // Highlight with Shiki and store in token
            codeToken.text = await codeToHtml(codeToken.text, {
              lang: normalizedLang,
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
            });
            // Mark as pre-rendered HTML
            codeToken.lang = "__shiki__";
          } catch {
            // Keep original text if highlighting fails
            // Fallback rendering will handle it
          }
        }
      },
    });

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
        // Allow class, id, style, and data-* on all elements (for Shiki themes)
        "*": ["class", "id", "style", "data-*"],
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
