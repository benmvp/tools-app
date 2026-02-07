import { describe, expect, it } from "vitest";
import { previewMarkdown } from "../app/viewers/actions";

describe("Markdown Previewer", () => {
  describe("Basic Markdown", () => {
    it("renders headings correctly", async () => {
      const input = "# Heading 1\n## Heading 2\n### Heading 3";
      const result = await previewMarkdown(input);

      expect(result).toContain("<h1");
      expect(result).toContain("Heading 1");
      expect(result).toContain("<h2");
      expect(result).toContain("Heading 2");
      expect(result).toContain("<h3");
      expect(result).toContain("Heading 3");
    });

    it("renders bold and italic text", async () => {
      const input = "**bold text** and *italic text* and ***both***";
      const result = await previewMarkdown(input);

      expect(result).toContain("<strong>bold text</strong>");
      expect(result).toContain("<em>italic text</em>");
    });

    it("renders lists correctly", async () => {
      const input = "- Item 1\n- Item 2\n- Item 3";
      const result = await previewMarkdown(input);

      expect(result).toContain("<ul");
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
      expect(result).toContain("<li>Item 3</li>");
    });

    it("renders links correctly", async () => {
      const input = "[GitHub](https://github.com)";
      const result = await previewMarkdown(input);

      expect(result).toContain('<a href="https://github.com">GitHub</a>');
    });

    it("renders blockquotes", async () => {
      const input = "> This is a quote";
      const result = await previewMarkdown(input);

      expect(result).toContain("<blockquote");
      expect(result).toContain("This is a quote");
    });
  });

  describe("GitHub Flavored Markdown (GFM)", () => {
    it("renders tables", async () => {
      const input = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;
      const result = await previewMarkdown(input);

      expect(result).toContain("<table");
      expect(result).toContain("<thead");
      expect(result).toContain("<th>Header 1</th>");
      expect(result).toContain("<th>Header 2</th>");
      expect(result).toContain("<td>Cell 1</td>");
      expect(result).toContain("<td>Cell 2</td>");
    });

    it("renders task lists", async () => {
      const input = "- [x] Completed task\n- [ ] Incomplete task";
      const result = await previewMarkdown(input);

      expect(result).toContain("<input");
      expect(result).toContain('type="checkbox"');
      expect(result).toContain("checked");
    });

    it("renders strikethrough", async () => {
      const input = "~~strikethrough text~~";
      const result = await previewMarkdown(input);

      expect(result).toContain("<del>strikethrough text</del>");
    });
  });

  describe("Code Blocks", () => {
    it("renders inline code", async () => {
      const input = "This is `inline code` here";
      const result = await previewMarkdown(input);

      expect(result).toContain("<code");
      expect(result).toContain("inline code");
    });

    it("renders code blocks with syntax highlighting", async () => {
      const input = "```javascript\nconst x = 42;\n```";
      const result = await previewMarkdown(input);

      expect(result).toContain("<pre");
      expect(result).toContain("const");
      expect(result).toContain("42");
      // Should contain Shiki styling or classes
      expect(result).toMatch(/shiki|style|data-/i);
    });

    it("handles code blocks without language", async () => {
      const input = "```\nplain code\n```";
      const result = await previewMarkdown(input);

      expect(result).toContain("<pre");
      expect(result).toContain("plain code");
    });

    it("handles multiple code blocks with different languages", async () => {
      const input = `\`\`\`javascript
const foo = "bar";
\`\`\`

\`\`\`typescript
interface User {
  name: string;
}
\`\`\``;
      const result = await previewMarkdown(input);

      expect(result).toContain("foo");
      expect(result).toContain("interface");
      expect(result).toContain("User");
    });
  });

  describe("Security (XSS Prevention)", () => {
    it("sanitizes script tags", async () => {
      const input = '<script>alert("XSS")</script>\n\nHello world';
      const result = await previewMarkdown(input);

      expect(result).not.toContain("<script");
      expect(result).not.toContain("alert");
      expect(result).toContain("Hello world");
    });

    it("sanitizes javascript: URLs", async () => {
      const input = '[Click me](javascript:alert("XSS"))';
      const result = await previewMarkdown(input);

      expect(result).not.toContain("javascript:");
      expect(result).not.toContain("alert");
    });

    it("sanitizes event handlers", async () => {
      const input = '<a href="#" onclick="alert(\'XSS\')">Link</a>';
      const result = await previewMarkdown(input);

      expect(result).not.toContain("onclick");
      expect(result).not.toContain("alert");
    });
  });

  describe("Input Validation", () => {
    it("throws error for input exceeding 50KB", async () => {
      // Create a string larger than 50KB
      const largeInput = `# Big Markdown\n${"a".repeat(51 * 1024)}`;

      await expect(previewMarkdown(largeInput)).rejects.toThrow(
        /Input too large/,
      );
    });

    it("allows input close to the limit", async () => {
      // Create a string just under 50KB (~49KB)
      const input = `# Heading\n${"word ".repeat(10000)}`;

      const result = await previewMarkdown(input);
      expect(result).toContain("Heading");
    });
  });

  describe("Error Handling", () => {
    it("handles empty input gracefully", async () => {
      const result = await previewMarkdown("");

      expect(result).toBe("");
    });

    it("handles whitespace-only input", async () => {
      const result = await previewMarkdown("   \n\n  \t  ");

      // Should return minimal HTML (empty or just whitespace)
      expect(result.length).toBeLessThan(50);
    });
  });

  describe("Complex Documents", () => {
    it("renders a complete README-style document", async () => {
      const input = `# Project Title

## Description

This is a **complex** document with:
- Multiple sections
- *Various* formatting

## Features

1. First feature
2. Second feature

### Code Example

\`\`\`typescript
interface Config {
  name: string;
  value: number;
}
\`\`\`

## Table

| Feature | Supported |
|---------|-----------|
| Tables  | ✅ Yes    |
| Lists   | ✅ Yes    |

## Tasks

- [x] Setup project
- [ ] Write tests

> Note: This is important

---

[GitHub](https://github.com)`;

      const result = await previewMarkdown(input);

      // Verify major sections are present
      expect(result).toContain("<h1");
      expect(result).toContain("Project Title");
      expect(result).toContain("<h2");
      expect(result).toContain("Description");
      expect(result).toContain("<strong>complex</strong>");
      expect(result).toContain("<ul");
      expect(result).toContain("<ol");
      expect(result).toContain("<table");
      expect(result).toContain("interface");
      expect(result).toContain("checkbox");
      expect(result).toContain("<blockquote");
      expect(result).toContain("github.com");
    });
  });
});
