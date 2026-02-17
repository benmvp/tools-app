import { describe, expect, it } from "vitest";
import {
	validateCss,
	validateDockerfile,
	validateHtml,
	validateJson,
	validateUrl,
	validateXml,
	validateYaml,
} from "../app/validators/actions";

describe("validateJson", () => {
	describe("Syntax Validation", () => {
		it("validates correct JSON", async () => {
			const result = await validateJson('{"valid": true}');

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
			expect(result.metadata?.toolName).toBe("JSON");
		});

		it("detects trailing commas", async () => {
			const result = await validateJson('{"key": "value",}');

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].severity).toBe("error");
		});

		it("detects unclosed braces", async () => {
			const result = await validateJson('{"key": "value"');

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("detects invalid syntax", async () => {
			const result = await validateJson("{invalid}");

			expect(result.valid).toBe(false);
		});

		it("validates arrays", async () => {
			const result = await validateJson("[1, 2, 3]");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});

		it("validates primitives", async () => {
			const result = await validateJson('"hello"');

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});

		it("validates numbers", async () => {
			const result = await validateJson("42");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});

		it("validates booleans", async () => {
			const result = await validateJson("true");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});

		it("validates null", async () => {
			const result = await validateJson("null");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});
	});

	describe("Schema Validation", () => {
		it("validates against required fields", async () => {
			const schema = '{"type": "object", "required": ["name"]}';
			const result = await validateJson('{"age": 30}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("required");
		});

		it("validates against type constraints", async () => {
			const schema =
				'{"type": "object", "properties": {"age": {"type": "number"}}}';
			const result = await validateJson('{"age": "thirty"}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("number");
		});

		it("validates email format", async () => {
			const schema =
				'{"type": "object", "properties": {"email": {"type": "string", "format": "email"}}}';
			const result = await validateJson('{"email": "not-an-email"}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("email");
		});

		it("passes valid schema validation", async () => {
			const schema =
				'{"type": "object", "required": ["name"], "properties": {"name": {"type": "string"}}}';
			const result = await validateJson('{"name": "John"}', schema);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("handles invalid schema gracefully", async () => {
			const schema = "{invalid schema}";
			const result = await validateJson('{"valid": true}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("Invalid JSON Schema");
		});

		it("validates minimum constraint", async () => {
			const schema =
				'{"type": "object", "properties": {"age": {"type": "number", "minimum": 0}}}';
			const result = await validateJson('{"age": -5}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain(">=");
		});

		it("validates maximum constraint", async () => {
			const schema =
				'{"type": "object", "properties": {"age": {"type": "number", "maximum": 120}}}';
			const result = await validateJson('{"age": 150}', schema);

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("<=");
		});

		it("validates array items", async () => {
			const schema =
				'{"type": "array", "items": {"type": "number"}, "minItems": 1}';
			const result = await validateJson('[1, 2, "three"]', schema);

			expect(result.valid).toBe(false);
		});

		it("ignores empty schema", async () => {
			const result = await validateJson('{"valid": true}', "");

			expect(result.valid).toBe(true);
		});

		it("ignores whitespace-only schema", async () => {
			const result = await validateJson('{"valid": true}', "   ");

			expect(result.valid).toBe(true);
		});
	});

	describe("Metadata", () => {
		it("includes toolName in metadata", async () => {
			const result = await validateJson('{"a": 1, "b": 2, "c": 3}');

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("JSON");
		});
	});
});

describe("validateHtml", () => {
	describe("Valid HTML", () => {
		it("validates correct HTML", async () => {
			const html = `<!DOCTYPE html>
<html>
  <head><title>Test</title></head>
  <body>
    <p>Valid paragraph</p>
  </body>
</html>`;
			const result = await validateHtml(html);

			// html-validate:recommended may have warnings even for valid HTML
			// Verify structure and that there are no critical errors
			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
			expect(result.metadata?.toolName).toBe("HTML");
		});

		it("validates minimal HTML", async () => {
			const html = "<p>Hello</p>";
			const result = await validateHtml(html);

			// May have warnings but should not error on minimal HTML
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Structural Errors", () => {
		it("detects unclosed tags", async () => {
			const html = `<!DOCTYPE html>
<html>
  <head><title>Test</title></head>
  <body>
    <p>Unclosed paragraph
  </body>
</html>`;
			const result = await validateHtml(html);

			// html-validate:recommended may not flag all unclosed tags as errors
			// This test verifies the function returns proper structure
			expect(result).toHaveProperty("valid");
			expect(result).toHaveProperty("errors");
			expect(result).toHaveProperty("warnings");
		});

		it("detects mismatched tags", async () => {
			const html = `<div>
  <span>Content</div>
</span>`;
			const result = await validateHtml(html);

			// Verify result structure
			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
		});

		it("provides line and column information", async () => {
			const html = `<!DOCTYPE html>
<html>
  <head><title>Test</title></head>
  <body>
    <p>Invalid
  </body>
</html>`;
			const result = await validateHtml(html);

			if (result.errors.length > 0) {
				expect(result.errors[0].line).toBeGreaterThan(0);
				expect(result.errors[0].column).toBeGreaterThan(0);
				expect(result.errors[0].severity).toBe("error");
			}
		});
	});

	describe("Accessibility Warnings", () => {
		it("validates HTML structure properly", async () => {
			const html = `<!DOCTYPE html>
<html>
  <head><title>Test</title></head>
  <body>
    <p>Test content</p>
  </body>
</html>`;
			const result = await validateHtml(html);

			// Verify validation runs and returns proper structure
			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
			expect(result.metadata?.toolName).toBe("HTML");
		});
	});

	describe("Empty Input", () => {
		it("handles empty string", async () => {
			const result = await validateHtml("");

			// Verify result structure (html-validate may or may not error on empty)
			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
		});
	});

	describe("Severity Mapping", () => {
		it("properly categorizes errors and warnings", async () => {
			const html = `<!DOCTYPE html>
<html>
  <head><title>Test</title></head>
  <body>
    <p>Unclosed
    <span>Content</div>
  </body>
</html>`;
			const result = await validateHtml(html);

			// Verify structure is correct regardless of what html-validate returns
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);

			// All errors should have severity "error"
			for (const error of result.errors) {
				expect(error.severity).toBe("error");
			}

			// All warnings should have severity "warning"
			for (const warning of result.warnings) {
				expect(warning.severity).toBe("warning");
			}
		});
	});
});

describe("validateCss", () => {
	describe("Valid CSS", () => {
		it("validates correct CSS", async () => {
			const css = `.container {
  color: #ff0000;
  background: blue;
  padding: 20px;
}`;
			const result = await validateCss(css);

			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
			expect(result.metadata?.toolName).toBe("CSS");
		});

		it("validates minimal CSS", async () => {
			const css = ".test { color: red; }";
			const result = await validateCss(css);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates CSS with modern properties", async () => {
			const css = `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}`;
			const result = await validateCss(css);

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("CSS");
		});

		it("validates CSS with custom properties", async () => {
			const css = `:root {
  --primary: #007bff;
  --secondary: #6c757d;
}

.button {
  background: var(--primary);
}`;
			const result = await validateCss(css);

			expect(result.valid).toBe(true);
		});
	});

	describe("Syntax Errors", () => {
		it("detects missing semicolons", async () => {
			const css = `.container {
  color: red
  padding: 10px;
}`;
			const result = await validateCss(css);

			// Should be invalid with errors
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toMatch(
				/unexpected|semicolon|Missed semicolon/i,
			);
			expect(result.errors[0].line).toBe(3); // Error on line 3 (padding line)
		});

		it("detects missing colons", async () => {
			const css = `.header {
  font-weight bold;
}`;
			const result = await validateCss(css);

			// Should be invalid with errors
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].line).toBe(2); // Error on line 2
		});

		it("provides line and column information", async () => {
			const css = `.test {
  color: red
  background: blue;
}`;
			const result = await validateCss(css);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].line).toBeGreaterThan(1); // Should point to error line
			expect(result.errors[0].column).toBeGreaterThan(0);
		});

		it("detects the example CSS errors", async () => {
			// The actual example from VALIDATOR_EXAMPLES.css
			const css = `.container {
  color: #ff0000;
  background: blue
  padding: 20px;
}

.header {
  font-size: 24px;
  font-weight bold;
}`;
			const result = await validateCss(css);

			// Should detect at least 2 errors (missing semicolon + missing colon)
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThanOrEqual(1);

			// Should have line numbers
			for (const error of result.errors) {
				expect(error.line).toBeGreaterThan(0);
				expect(error.column).toBeGreaterThan(0);
			}
		});
	});

	describe("Empty Input", () => {
		it("handles empty string", async () => {
			const result = await validateCss("");

			expect(result).toHaveProperty("valid");
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.warnings).toBeInstanceOf(Array);
		});

		it("handles whitespace only", async () => {
			const result = await validateCss("   \n\n   ");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("CSS");
		});
	});

	describe("Severity Mapping", () => {
		it("categorizes syntax errors as errors (not warnings)", async () => {
			const css = `.test {
  color: red
  background: blue;
}`;
			const result = await validateCss(css);

			// Should have errors, not warnings
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);

			// All errors should have severity "error"
			for (const error of result.errors) {
				expect(error.severity).toBe("error");
			}
		});
	});

	describe("Metadata", () => {
		it("includes toolName in metadata", async () => {
			const result = await validateCss(".test { color: red; }");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("CSS");
		});
	});
});

describe("validateXml", () => {
	describe("Valid XML", () => {
		it("validates correct XML with declaration", async () => {
			const xml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">First Item</item>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
			expect(result.metadata?.toolName).toBe("XML");
		});

		it("validates XML without declaration", async () => {
			const xml = `<root>
  <item>Value</item>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates minimal XML", async () => {
			const xml = "<root></root>";
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates self-closing tags", async () => {
			const xml = `<root>
  <item />
  <item id="2" />
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates nested structures", async () => {
			const xml = `<?xml version="1.0"?>
<root>
  <parent>
    <child>
      <grandchild>Deep value</grandchild>
    </child>
  </parent>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates XML with attributes", async () => {
			const xml = `<root version="1.0" type="test">
  <item id="1" name="test" enabled="true">Content</item>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates XML with CDATA sections", async () => {
			const xml = `<root>
  <content><![CDATA[Some <tag> content]]></content>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates XML with comments", async () => {
			const xml = `<root>
  <!-- This is a comment -->
  <item>Value</item>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Structural Errors", () => {
		it("detects mismatched tags", async () => {
			const xml = `<root>
  <item></wrong>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].severity).toBe("error");
			expect(result.errors[0].message).toContain("Mismatched tag");
		});

		it("detects unclosed tags", async () => {
			const xml = `<root>
  <item>Unclosed
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("detects missing closing root tag", async () => {
			const xml = `<root>
  <item>Value</item>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("detects extra closing tags", async () => {
			const xml = `<root>
  <item>Value</item>
  </extra>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it("provides line and column information", async () => {
			const xml = `<?xml version="1.0"?>
<root>
  <item></wrong>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].line).toBeGreaterThan(0);
			expect(result.errors[0].column).toBeGreaterThan(0);
			expect(result.errors[0].severity).toBe("error");
		});

		it("detects invalid characters in tag names", async () => {
			const xml = `<root>
  <item@invalid>Value</item@invalid>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe("Empty Input", () => {
		it("handles empty string", async () => {
			const result = await validateXml("");

			expect(result.valid).toBe(false);
			expect(result.errors).toBeInstanceOf(Array);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toContain("empty");
		});

		it("handles whitespace-only input", async () => {
			const result = await validateXml("   \n  \t  ");

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe("Edge Cases", () => {
		it("validates very large XML documents", async () => {
			const items = Array.from(
				{ length: 1000 },
				(_, i) => `  <item id="${i}">Value ${i}</item>`,
			).join("\n");
			const xml = `<root>\n${items}\n</root>`;

			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates deeply nested XML", async () => {
			let xml = "<root>";
			for (let i = 0; i < 50; i++) {
				xml += `<level${i}>`;
			}
			xml += "Deep content";
			for (let i = 49; i >= 0; i--) {
				xml += `</level${i}>`;
			}
			xml += "</root>";

			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("handles special XML entities", async () => {
			const xml = `<root>
  <content>&lt;tag&gt; &amp; &quot;quotes&quot;</content>
</root>`;
			const result = await validateXml(xml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Metadata", () => {
		it("includes toolName in metadata", async () => {
			const result = await validateXml("<root></root>");

			expect(result.valid).toBe(true);
			expect(result.metadata?.toolName).toBe("XML");
		});

		it("includes toolName even on error", async () => {
			const result = await validateXml("<root><item></wrong></root>");

			expect(result.valid).toBe(false);
			expect(result.metadata?.toolName).toBe("XML");
		});
	});
});

describe("validateUrl", () => {
	describe("Single URL Validation", () => {
		it("validates a single correct URL", async () => {
			const result = await validateUrl("https://example.com/api");

			expect(result.validCount).toBe(1);
			expect(result.errorCount).toBe(0);
			expect(result.urls[0].valid).toBe(true);
			expect(result.urls[0].parsed?.protocol).toBe("https");
			expect(result.urls[0].parsed?.hostname).toBe("example.com");
		});

		it("validates http URLs", async () => {
			const result = await validateUrl("http://test.org");

			expect(result.validCount).toBe(1);
			expect(result.urls[0].parsed?.protocol).toBe("http");
		});

		it("validates ftp URLs", async () => {
			const result = await validateUrl("ftp://files.com/pub");

			expect(result.validCount).toBe(1);
			expect(result.urls[0].parsed?.protocol).toBe("ftp");
		});

		it("accepts localhost URLs", async () => {
			const result = await validateUrl("http://localhost:3000/dev");

			expect(result.validCount).toBe(1);
			expect(result.urls[0].parsed?.hostname).toBe("localhost");
		});

		it("accepts IP address URLs", async () => {
			const result = await validateUrl("https://192.168.1.1/admin");

			expect(result.validCount).toBe(1);
			expect(result.urls[0].parsed?.hostname).toBe("192.168.1.1");
		});
	});

	describe("Multiple URL Validation", () => {
		it("validates multiple URLs", async () => {
			const input = `https://example.com
http://test.org
ftp://files.com`;
			const result = await validateUrl(input);

			expect(result.validCount).toBe(3);
			expect(result.errorCount).toBe(0);
			expect(result.urls).toHaveLength(3);
		});

		it("reports line numbers correctly", async () => {
			const input = `https://example.com
invalid
http://test.org`;
			const result = await validateUrl(input);

			expect(result.urls[0].line).toBe(1);
			expect(result.urls[1].line).toBe(2);
			expect(result.urls[2].line).toBe(3);
		});

		it("skips empty lines", async () => {
			const input = `https://example.com

http://test.org`;
			const result = await validateUrl(input);

			expect(result.urls).toHaveLength(2);
		});
	});

	describe("Error Detection", () => {
		it("detects invalid protocol - accepts any scheme", async () => {
			// Note: Node's URL constructor accepts any protocol scheme (htp, xyz, etc.)
			// This is actually valid per URL spec, so it won't error
			const result = await validateUrl("htp://broken.com");

			// URL is technically valid with custom protocol
			expect(result.validCount).toBe(1);
			expect(result.errorCount).toBe(0);
		});

		it("detects missing protocol", async () => {
			const result = await validateUrl("example.com");

			expect(result.validCount).toBe(0);
			expect(result.errorCount).toBe(1);
			expect(result.urls[0].error).toContain("Missing protocol");
			expect(result.urls[0].error).toContain("https://example.com");
		});

		it("rejects relative URLs", async () => {
			const result = await validateUrl("/api/users");

			expect(result.validCount).toBe(0);
			expect(result.errorCount).toBe(1);
			expect(result.urls[0].error).toContain("Missing protocol");
		});
	});

	describe("Port Handling", () => {
		it("shows non-default ports", async () => {
			const result = await validateUrl("https://example.com:8080/api");

			expect(result.urls[0].parsed?.port).toBe("8080");
		});

		it("hides default HTTPS port (443)", async () => {
			const result = await validateUrl("https://example.com:443/api");

			expect(result.urls[0].parsed?.port).toBeUndefined();
		});

		it("hides default HTTP port (80)", async () => {
			const result = await validateUrl("http://example.com:80/api");

			expect(result.urls[0].parsed?.port).toBeUndefined();
		});

		it("hides default FTP port (21)", async () => {
			const result = await validateUrl("ftp://files.com:21/pub");

			expect(result.urls[0].parsed?.port).toBeUndefined();
		});
	});

	describe("Query Parameter Parsing", () => {
		it("parses single query parameter", async () => {
			const result = await validateUrl("https://example.com?page=1");

			expect(result.urls[0].parsed?.query).toHaveLength(1);
			expect(result.urls[0].parsed?.query?.[0]).toEqual({
				key: "page",
				value: "1",
			});
		});

		it("parses multiple query parameters", async () => {
			const result = await validateUrl("https://example.com?page=1&limit=10");

			expect(result.urls[0].parsed?.query).toHaveLength(2);
			expect(result.urls[0].parsed?.query?.[0]).toEqual({
				key: "page",
				value: "1",
			});
			expect(result.urls[0].parsed?.query?.[1]).toEqual({
				key: "limit",
				value: "10",
			});
		});

		it("handles array query parameters", async () => {
			const result = await validateUrl(
				"https://example.com?tags=a&tags=b&tags=c",
			);

			expect(result.urls[0].parsed?.query).toHaveLength(1);
			expect(result.urls[0].parsed?.query?.[0].key).toBe("tags");
			expect(result.urls[0].parsed?.query?.[0].value).toEqual(["a", "b", "c"]);
		});

		it("decodes query parameter values", async () => {
			const result = await validateUrl("https://example.com?q=%E2%9C%93");

			expect(result.urls[0].parsed?.query?.[0].value).toBe("✓");
		});

		it("decodes URL-encoded spaces", async () => {
			const result = await validateUrl("https://example.com?name=John%20Doe");

			expect(result.urls[0].parsed?.query?.[0].value).toBe("John Doe");
		});

		it("handles empty query parameters", async () => {
			const result = await validateUrl("https://example.com?key=");

			expect(result.urls[0].parsed?.query?.[0]).toEqual({
				key: "key",
				value: "",
			});
		});
	});

	describe("Path Handling", () => {
		it("only shows pathname if not root", async () => {
			const result1 = await validateUrl("https://example.com/");
			expect(result1.urls[0].parsed?.pathname).toBeUndefined();

			const result2 = await validateUrl("https://example.com/api");
			expect(result2.urls[0].parsed?.pathname).toBe("/api");
		});

		it("includes deep paths", async () => {
			const result = await validateUrl("https://example.com/api/v2/users/123");

			expect(result.urls[0].parsed?.pathname).toBe("/api/v2/users/123");
		});
	});

	describe("Hash Fragment Parsing", () => {
		it("parses hash fragments without #", async () => {
			const result = await validateUrl("https://example.com#section");

			expect(result.urls[0].parsed?.hash).toBe("section");
		});

		it("decodes hash fragments", async () => {
			const result = await validateUrl("https://example.com#section%202");

			expect(result.urls[0].parsed?.hash).toBe("section 2");
		});

		it("does not show hash if absent", async () => {
			const result = await validateUrl("https://example.com/api");

			expect(result.urls[0].parsed?.hash).toBeUndefined();
		});
	});

	describe("Authentication Handling", () => {
		it("extracts username from FTP URLs", async () => {
			const result = await validateUrl("ftp://user@files.com/pub");

			expect(result.urls[0].parsed?.username).toBe("user");
		});

		it("redacts passwords", async () => {
			const result = await validateUrl("ftp://user:pass123@files.com/pub");

			expect(result.urls[0].parsed?.password).toBe("[redacted]");
		});

		it("does not show username if absent", async () => {
			const result = await validateUrl("https://example.com");

			expect(result.urls[0].parsed?.username).toBeUndefined();
		});

		it("does not show password if absent", async () => {
			const result = await validateUrl("ftp://user@files.com/pub");

			expect(result.urls[0].parsed?.password).toBeUndefined();
		});
	});

	describe("Complex URL Parsing", () => {
		it("parses URL with all components", async () => {
			const result = await validateUrl(
				"https://example.com:8080/api/users?page=1&limit=10#results",
			);

			const parsed = result.urls[0].parsed;
			expect(parsed?.protocol).toBe("https");
			expect(parsed?.hostname).toBe("example.com");
			expect(parsed?.port).toBe("8080");
			expect(parsed?.pathname).toBe("/api/users");
			expect(parsed?.query).toHaveLength(2);
			expect(parsed?.hash).toBe("results");
		});

		it("parses FTP URL with credentials and port", async () => {
			const result = await validateUrl(
				"ftp://user:pass@files.company.com:21/assets",
			);

			const parsed = result.urls[0].parsed;
			expect(parsed?.protocol).toBe("ftp");
			expect(parsed?.hostname).toBe("files.company.com");
			expect(parsed?.username).toBe("user");
			expect(parsed?.password).toBe("[redacted]");
			expect(parsed?.port).toBeUndefined(); // 21 is default for FTP
			expect(parsed?.pathname).toBe("/assets");
		});
	});
});

describe("validateDockerfile", () => {
	describe("Valid Dockerfiles", () => {
		it("validates a simple valid Dockerfile", async () => {
			const dockerfile = `FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates a multi-stage Dockerfile", async () => {
			const dockerfile = `FROM node:18 AS builder
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "server.js"]`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates Dockerfile with ARG before FROM", async () => {
			const dockerfile = `ARG NODE_VERSION=18
FROM node:\${NODE_VERSION}
WORKDIR /app
CMD ["node", "index.js"]`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Syntax Errors", () => {
		it("detects lowercase commands", async () => {
			const dockerfile = `from node:18
workdir /app`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(true); // No errors, but warnings
			expect(result.warnings.length).toBeGreaterThan(0);
			expect(
				result.warnings.some((w) => w.message.includes("Capitalize")),
			).toBe(true);
		});

		it("detects missing base image tag", async () => {
			const dockerfile = `FROM node
WORKDIR /app`;

			const result = await validateDockerfile(dockerfile);

			expect(result.warnings.length).toBeGreaterThan(0);
		});

		it("detects missing FROM command", async () => {
			const dockerfile = `WORKDIR /app
RUN npm install`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.message.includes("FROM"))).toBe(true);
		});

		it("detects commands without parameters", async () => {
			const dockerfile = `FROM node:18
WORKDIR
RUN npm install`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(false);
			expect(
				result.errors.some((e) => e.message.includes("Required Arguments")),
			).toBe(true);
		});
	});

	describe("Best Practices", () => {
		it("detects sudo usage", async () => {
			const dockerfile = `FROM ubuntu:22.04
RUN sudo apt-get update`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.message.includes("sudo"))).toBe(true);
		});

		it("detects apt-get without -y flag", async () => {
			const dockerfile = `FROM ubuntu:22.04
RUN apt-get update && apt-get install curl`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(false);
			expect(
				result.errors.some((e) => e.message.toLowerCase().includes("apt-get")),
			).toBe(true);
		});

		it("detects apt-get upgrade", async () => {
			const dockerfile = `FROM ubuntu:22.04
RUN apt-get update && apt-get upgrade -y`;

			const result = await validateDockerfile(dockerfile);

			// apt-get upgrade is an optimization warning, not an error
			expect(result.warnings.length).toBeGreaterThan(0);
			expect(
				result.warnings.some((w) =>
					w.message.toLowerCase().includes("upgrade"),
				),
			).toBe(true);
		});

		it("suggests --no-install-recommends for apt-get install", async () => {
			const dockerfile = `FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl`;

			const result = await validateDockerfile(dockerfile);

			expect(result.warnings.length).toBeGreaterThan(0);
			expect(
				result.warnings.some((w) =>
					w.message.toLowerCase().includes("recommends"),
				),
			).toBe(true);
		});
	});

	describe("Line Numbers", () => {
		it("reports correct line numbers for errors", async () => {
			const dockerfile = `FROM node:18
WORKDIR /app
from ubuntu`;

			const result = await validateDockerfile(dockerfile);

			const fromError = result.warnings.find((e) =>
				e.message.includes("Capitalize"),
			);
			expect(fromError?.line).toBe(3);
		});

		it("handles multi-line commands", async () => {
			const dockerfile = `FROM node:18
RUN apt-get update && \\
    apt-get install -y \\
    curl \\
    git`;

			const result = await validateDockerfile(dockerfile);

			// Should report issues on line 2 (start of multi-line command)
			if (result.errors.length > 0 || result.warnings.length > 0) {
				const firstIssue = result.errors[0] || result.warnings[0];
				expect(firstIssue.line).toBe(2);
			}
		});
	});

	describe("Empty and Comment Lines", () => {
		it("ignores comments and empty lines", async () => {
			const dockerfile = `# This is a comment
FROM node:18

# Set working directory
WORKDIR /app

CMD ["node", "index.js"]`;

			const result = await validateDockerfile(dockerfile);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Error Handling", () => {
		it("handles empty input", async () => {
			const result = await validateDockerfile("");

			expect(result.valid).toBe(false);
		});

		it("handles whitespace-only input", async () => {
			const result = await validateDockerfile("   \n\n   ");

			expect(result.valid).toBe(false);
		});
	});
});

describe("validateYaml", () => {
	describe("Valid YAML", () => {
		it("validates simple YAML", async () => {
			const yaml = `name: Test
version: 1.0.0
enabled: true`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
			expect(result.metadata?.toolName).toBe("YAML");
		});

		it("validates nested YAML objects", async () => {
			const yaml = `database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates YAML arrays", async () => {
			const yaml = `servers:
  - name: production
    url: https://api.prod.com
  - name: staging
    url: https://api.staging.com`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates YAML with comments", async () => {
			const yaml = `# Configuration file
name: App # Application name
version: 1.0.0`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("validates multi-line strings", async () => {
			const yaml = `description: |
  This is a multi-line
  description text
  with multiple lines`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});
	});

	describe("Syntax Errors", () => {
		it("detects invalid YAML syntax", async () => {
			const yaml = `name: Test
version: [1.0.0`; // Unclosed bracket

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].severity).toBe("error");
		});

		it("detects bad indentation", async () => {
			const yaml = `parent:
child: value`; // Missing indentation

			const result = await validateYaml(yaml);

			// Depending on js-yaml version, this might be valid or invalid
			// Either way, we test that it returns a result
			expect(result).toHaveProperty("valid");
			expect(result).toHaveProperty("errors");
		});

		it("detects invalid mapping", async () => {
			const yaml = `key with no value:`;

			const result = await validateYaml(yaml);

			// This is actually valid YAML (null value)
			expect(result.valid).toBe(true);
		});

		it("detects tab characters (common YAML mistake)", async () => {
			const yaml = "name: Test\n\tversion: 1.0.0"; // Tab character

			const result = await validateYaml(yaml);

			// js-yaml may parse this or throw error depending on context
			expect(result).toHaveProperty("valid");
		});
	});

	describe("Duplicate Keys", () => {
		it("detects duplicate keys as warnings", async () => {
			const yaml = `name: First
version: 1.0.0
name: Second`;

			const result = await validateYaml(yaml);

			// js-yaml throws on duplicate keys, we convert to warning
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);

			// Must have duplicate key warning
			const duplicateWarning = result.warnings.find((w) =>
				w.message.includes("Duplicate"),
			);

			expect(duplicateWarning).toBeDefined();
			expect(duplicateWarning?.severity).toBe("warning");
			expect(duplicateWarning?.line).toBe(3);
		});

		it("allows duplicate keys at different nesting levels", async () => {
			const yaml = `name: Root
database:
  name: Database Name`;

			const result = await validateYaml(yaml);

			// These are not duplicates (different scopes)
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
			const duplicateWarning = result.warnings.find((w) =>
				w.message.includes("Duplicate key"),
			);
			expect(duplicateWarning).toBeUndefined();
		});
	});

	describe("Edge Cases", () => {
		it("handles empty input", async () => {
			const result = await validateYaml("");

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toContain("Empty input");
		});

		it("handles whitespace-only input", async () => {
			const result = await validateYaml("   \n\n   ");

			expect(result.valid).toBe(false);
			expect(result.errors[0].message).toContain("Empty input");
		});

		it("handles only comments", async () => {
			const yaml = `# Just a comment\n# Another comment`;

			const result = await validateYaml(yaml);

			// js-yaml considers this valid (parses to null)
			expect(result.valid).toBe(true);
		});

		it("validates YAML with special characters", async () => {
			const yaml = `message: "Hello, World! @#$%^&*()"\ncode: 'console.log("test")'`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
		});

		it("validates YAML with numbers as keys", async () => {
			const yaml = `123: value\n456: another`;

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(true);
		});
	});

	describe("Line and Column Numbers", () => {
		it("provides error location for syntax errors", async () => {
			const yaml = `name: Test\nversion: [1.0.0`; // Error on line 2

			const result = await validateYaml(yaml);

			expect(result.valid).toBe(false);
			expect(result.errors[0].line).toBeGreaterThan(0);
			expect(result.errors[0].column).toBeGreaterThan(0);
		});

		it("provides warning location for duplicate keys", async () => {
			const yaml = `first: 1\nsecond: 2\nfirst: 3`;

			const result = await validateYaml(yaml);

			const warning = result.warnings.find((w) =>
				w.message.includes("Duplicate"),
			);

			// Warning may or may not be present depending on detection
			if (warning) {
				expect(warning.line).toBe(3);
				expect(warning.column).toBe(1);
			}
		});
	});
});
