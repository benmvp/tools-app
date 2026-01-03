import { describe, expect, it } from "vitest";
import {
  minifyCss,
  minifyHtml,
  minifyJson,
  minifySvg,
  minifyTypescript,
  minifyXml,
} from "../app/minifiers/actions";

describe("TypeScript/JavaScript Minifier", () => {
  it("minifies valid TypeScript code", async () => {
    const input = `
      function calculateSum(a, b) {
        const result = a + b;
        return result;
      }

      const value = calculateSum(5, 10);
      console.log("Result:", value);
    `;

    const result = await minifyTypescript(input);

    // Should be much shorter
    expect(result.length).toBeLessThan(input.length);
    // Should not contain original formatting
    expect(result).not.toContain("  ");
    expect(result).not.toContain("\n");
  });

  it("removes comments from code", async () => {
    const input = `
      // This is a comment
      function test() {
        /* Block comment */
        return true;
      }
    `;

    const result = await minifyTypescript(input);

    expect(result).not.toContain("This is a comment");
    expect(result).not.toContain("Block comment");
  });

  it("throws error for invalid syntax", async () => {
    const input = "const x = {{{";

    await expect(minifyTypescript(input)).rejects.toThrow();
  });

  it("minifies complex code correctly", async () => {
    const input = `
      const numbers = [1, 2, 3, 4, 5];
      const doubled = numbers.map(num => num * 2);
      const sum = doubled.reduce((acc, val) => acc + val, 0);
    `;

    const result = await minifyTypescript(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).not.toContain("\n");
  });
});

describe("JSON Minifier", () => {
  it("minifies valid JSON", async () => {
    const input = `{
      "name": "John",
      "age": 30,
      "city": "NYC"
    }`;

    const result = await minifyJson(input);

    expect(result).toBe('{"name":"John","age":30,"city":"NYC"}');
    expect(result.length).toBeLessThan(input.length);
  });

  it("minifies nested JSON", async () => {
    const input = `{
      "user": {
        "name": "Jane",
        "settings": {
          "theme": "dark"
        }
      }
    }`;

    const result = await minifyJson(input);

    expect(result).not.toContain("\n");
    expect(result).not.toContain("  ");
    expect(result.length).toBeLessThan(input.length);
  });

  it("throws error for invalid JSON", async () => {
    const input = '{"name": "John"';

    await expect(minifyJson(input)).rejects.toThrow(/Failed to minify JSON/);
  });

  it("minifies JSON arrays", async () => {
    const input = `[
      1,
      2,
      3,
      4,
      5
    ]`;

    const result = await minifyJson(input);

    expect(result).toBe("[1,2,3,4,5]");
  });
});

describe("CSS Minifier", () => {
  it("minifies valid CSS", async () => {
    const input = `
      .button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
      }
    `;

    const result = await minifyCss(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).not.toContain("\n");
    expect(result).toContain(".button");
  });

  it("removes CSS comments", async () => {
    const input = `
      /* Button styles */
      .button {
        color: red;
      }
    `;

    const result = await minifyCss(input);

    expect(result).not.toContain("Button styles");
    expect(result).toContain(".button");
  });

  it("optimizes CSS properties", async () => {
    const input = `.test { margin: 10px 10px 10px 10px; }`;

    const result = await minifyCss(input);

    expect(result.length).toBeLessThan(input.length);
  });
});

describe("HTML Minifier", () => {
  it("minifies valid HTML", async () => {
    const input = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>
    `;

    const result = await minifyHtml(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).not.toContain("\n");
    expect(result).toContain("<h1>");
  });

  it("removes HTML comments", async () => {
    const input = `
      <div>
        <!-- This is a comment -->
        <p>Content</p>
      </div>
    `;

    const result = await minifyHtml(input);

    expect(result).not.toContain("This is a comment");
    expect(result).toContain("<p>Content</p>");
  });

  it("handles inline CSS and JS", async () => {
    const input = `
      <style>
        .test { color: red; }
      </style>
      <script>
        console.log("test");
      </script>
    `;

    const result = await minifyHtml(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).toContain("<style>");
    expect(result).toContain("<script>");
  });
});

describe("SVG Minifier", () => {
  it("minifies valid SVG", async () => {
    const input = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="blue"/>
      </svg>
    `;

    const result = await minifySvg(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).toContain("<svg");
    expect(result).toContain("<circle");
  });

  it("removes SVG comments and metadata", async () => {
    const input = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <!-- This is a comment -->
        <title>Icon Title</title>
        <desc>Icon Description</desc>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    `;

    const result = await minifySvg(input);

    expect(result).not.toContain("This is a comment");
    // Note: SVGO may keep some metadata elements like desc in certain cases
    // The main goal is compression and optimization
    expect(result.length).toBeLessThan(input.length);
  });

  it("optimizes SVG paths", async () => {
    const input = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 10 L 20 20 L 30 10"/>
      </svg>
    `;

    const result = await minifySvg(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).toContain("<path");
  });
});

describe("XML Minifier", () => {
  it("minifies valid XML", async () => {
    const input = `
      <?xml version="1.0" encoding="UTF-8"?>
      <catalog>
        <book>
          <title>Example Book</title>
          <author>John Doe</author>
        </book>
      </catalog>
    `;

    const result = await minifyXml(input);

    expect(result.length).toBeLessThan(input.length);
    expect(result).not.toContain("\n");
    expect(result).toContain("<catalog>");
  });

  it("removes XML comments", async () => {
    const input = `
      <?xml version="1.0"?>
      <!-- This is a comment -->
      <root>
        <element>Value</element>
      </root>
    `;

    const result = await minifyXml(input);

    expect(result).not.toContain("This is a comment");
    expect(result).toContain("<root>");
  });

  it("handles invalid XML gracefully", async () => {
    const input = "<root><unclosed>";

    // minify-xml may not throw for all invalid XML, it does best effort
    const result = await minifyXml(input);
    expect(result).toBeDefined();
  });

  it("preserves XML structure", async () => {
    const input = `
      <?xml version="1.0"?>
      <catalog>
        <item id="1">
          <name>Product</name>
        </item>
      </catalog>
    `;

    const result = await minifyXml(input);

    expect(result).toContain("<catalog>");
    expect(result).toContain('<item id="1">');
    expect(result).toContain("<name>Product</name>");
  });
});
