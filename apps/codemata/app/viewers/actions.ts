"use server";

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { createHighlighter } from "shiki";

/**
 * Maximum input size: 50KB (~12,500 words)
 * Prevents abuse and ensures fast rendering
 */
const MAX_INPUT_SIZE = 50 * 1024; // 50KB in bytes

/**
 * Cached highlighter instance for performance
 * Shiki is expensive to initialize, so we cache it
 */
let highlighterCache: Awaited<ReturnType<typeof createHighlighter>> | null =
  null;

async function getHighlighterInstance() {
  if (!highlighterCache) {
    highlighterCache = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "json",
        "html",
        "css",
        "python",
        "bash",
        "shell",
        "yaml",
        "markdown",
        "xml",
        "sql",
        "graphql",
        "jsx",
        "tsx",
      ],
    });
  }
  return highlighterCache;
}

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
  if (inputSize > MAX_INPUT_SIZE) {
    throw new Error(
      `Input too large. Maximum size is ${MAX_INPUT_SIZE / 1024}KB (~${Math.floor(MAX_INPUT_SIZE / 4)} words). Your input is ${Math.ceil(inputSize / 1024)}KB.`,
    );
  }

  try {
    // Get Shiki highlighter instance
    const highlighter = await getHighlighterInstance();

    // Custom renderer for code blocks with Shiki highlighting
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
      // Default to plaintext if no language specified
      const language = lang || "plaintext";

      try {
        // Get available languages (normalize common aliases)
        const languageMap: Record<string, string> = {
          js: "javascript",
          ts: "typescript",
          sh: "bash",
          yml: "yaml",
        };
        const normalizedLang = languageMap[language] || language;

        // Try to highlight with Shiki
        const highlighted = highlighter.codeToHtml(text, {
          lang: normalizedLang,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });
        return highlighted;
      } catch {
        // Fallback to plain code block if language not supported
        return `<pre><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
      }
    };

    // Parse markdown to HTML
    const html = await marked.parse(input, { renderer });

    // Sanitize HTML to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(html, {
      // Allow common HTML elements and attributes
      ALLOWED_TAGS: [
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
      ALLOWED_ATTR: [
        "href",
        "title",
        "alt",
        "src",
        "class",
        "style",
        "id",
        "type",
        "checked",
        "disabled",
      ],
      // Allow data attributes for Shiki themes
      ALLOW_DATA_ATTR: true,
      // Keep relative links
      ALLOW_UNKNOWN_PROTOCOLS: false,
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
