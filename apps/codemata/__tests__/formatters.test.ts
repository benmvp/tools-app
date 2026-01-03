import { describe, expect, it } from "vitest";
import {
  formatCss,
  formatGraphql,
  formatHtml,
  formatJson,
  formatMarkdown,
  formatTypescript,
  formatXml,
  formatYaml,
} from "../app/formatters/actions";

describe("TypeScript/JavaScript Formatter", () => {
  it("formats valid TypeScript code with 2-space indentation", async () => {
    const input =
      'const x={a:1,b:2,c:3,d:4,e:5};function test(){return"hello";}';
    const result = await formatTypescript(input, { indentation: "two-spaces" });
    expect(result).toContain("const x");
    expect(result).toContain("function test()");
    expect(result).toContain(";");
  });

  it("formats with 4-space indentation", async () => {
    const input = "function test(){if(true){const x=1;return x;}}";
    const result = await formatTypescript(input, {
      indentation: "four-spaces",
    });
    expect(result).toContain("function test()");
    expect(result).toContain("if (true)");
  });

  it("formats with tabs", async () => {
    const input = "function test(){if(true){const x=1;return x;}}";
    const result = await formatTypescript(input, { indentation: "tabs" });
    expect(result).toContain("function test()");
    expect(result).toContain("if (true)");
  });

  it("throws error for invalid syntax", async () => {
    const input = "const x = {{{";
    await expect(
      formatTypescript(input, { indentation: "two-spaces" }),
    ).rejects.toThrow();
  });
});

describe("JSON Formatter", () => {
  it("formats valid JSON with 2-space indentation", async () => {
    const input =
      '{"name":"John","age":30,"address":{"city":"NYC","zip":"10001"}}';
    const result = await formatJson(input, { indentation: "two-spaces" });
    expect(result).toContain('"name"');
    expect(result).toContain('"John"');
    expect(result).toContain('"address"');
  });

  it("formats with 4-space indentation", async () => {
    const input = '{"name":"John","nested":{"value":123}}';
    const result = await formatJson(input, { indentation: "four-spaces" });
    expect(result).toContain('"name"');
    expect(result).toContain('"nested"');
  });

  it("formats with tabs", async () => {
    const input = '{"name":"John","nested":{"value":123}}';
    const result = await formatJson(input, { indentation: "tabs" });
    expect(result).toContain('"name"');
    expect(result).toContain('"nested"');
  });

  it("throws error for invalid JSON", async () => {
    const input = '{"name":}';
    await expect(
      formatJson(input, { indentation: "two-spaces" }),
    ).rejects.toThrow();
  });
});

describe("YAML Formatter", () => {
  it("formats valid YAML with 2-space indentation", async () => {
    const input = "name: John\nage: 30\naddress:\n  city: NYC";
    const result = await formatYaml(input, { indentation: "two-spaces" });
    expect(result).toContain("name: John");
    expect(result).toContain("age: 30");
  });

  it("formats with 4-space indentation", async () => {
    const input = "name: John\naddress:\n  city: NYC";
    const result = await formatYaml(input, { indentation: "four-spaces" });
    expect(result).toContain("name: John");
  });

  it("throws error for invalid YAML", async () => {
    const input = "name: John\n  : invalid";
    await expect(
      formatYaml(input, { indentation: "two-spaces" }),
    ).rejects.toThrow();
  });
});

describe("CSS Formatter", () => {
  it("formats valid CSS with 2-space indentation", async () => {
    const input = ".button{color:red;padding:10px;margin:5px;display:block;}";
    const result = await formatCss(input, { indentation: "two-spaces" });
    expect(result).toContain(".button {");
    expect(result).toMatch(/\n {2}/); // Has 2-space indentation
  });

  it("formats with 4-space indentation", async () => {
    const input = ".button{color:red;padding:10px;}";
    const result = await formatCss(input, { indentation: "four-spaces" });
    expect(result).toMatch(/\n {4}/); // Has 4-space indentation
  });

  it("handles CSS successfully", async () => {
    const input = ".button { color: red; }";
    const result = await formatCss(input, { indentation: "two-spaces" });
    expect(result).toContain(".button");
    expect(result).toContain("color: red");
  });
});

describe("HTML Formatter", () => {
  it("formats valid HTML with 2-space indentation", async () => {
    const input =
      "<html><head><title>Test</title></head><body><div><p>Hello</p></div></body></html>";
    const result = await formatHtml(input, { indentation: "two-spaces" });
    expect(result).toContain("<html>");
    expect(result).toMatch(/\n {2}/); // Has 2-space indentation
  });

  it("formats with 4-space indentation", async () => {
    const input = "<html><head><title>Test</title></head></html>";
    const result = await formatHtml(input, { indentation: "four-spaces" });
    expect(result).toMatch(/\n {4}/); // Has 4-space indentation
  });

  it("handles HTML successfully", async () => {
    const input = "<div><p>Test</p></div>";
    const result = await formatHtml(input, { indentation: "two-spaces" });
    expect(result).toContain("<div>");
    expect(result).toContain("<p>Test</p>");
  });
});

describe("GraphQL Formatter", () => {
  it("formats valid GraphQL with 2-space indentation", async () => {
    const input = "query{user{id name}}";
    const result = await formatGraphql(input, { indentation: "two-spaces" });
    expect(result).toContain("query");
    expect(result).toContain("user");
  });

  it("formats with 4-space indentation", async () => {
    const input = "query{user{id}}";
    const result = await formatGraphql(input, { indentation: "four-spaces" });
    expect(result).toContain("query");
  });

  it("throws error for invalid GraphQL", async () => {
    const input = "query { user { }}";
    await expect(
      formatGraphql(input, { indentation: "two-spaces" }),
    ).rejects.toThrow();
  });
});

describe("Markdown Formatter", () => {
  it("formats valid Markdown with 2-space indentation", async () => {
    const input = "# Title\n\nThis is a paragraph.";
    const result = await formatMarkdown(input, { indentation: "two-spaces" });
    expect(result).toContain("# Title");
    expect(result).toContain("This is a paragraph.");
  });

  it("formats with 4-space indentation", async () => {
    const input = "# Title\n\n- List item";
    const result = await formatMarkdown(input, { indentation: "four-spaces" });
    expect(result).toContain("# Title");
  });
});

describe("XML Formatter", () => {
  it("formats valid XML with 2-space indentation", async () => {
    const input =
      "<root><person><name>John</name><age>30</age></person></root>";
    const result = await formatXml(input, { indentation: "two-spaces" });
    expect(result).toContain("<root>");
    expect(result).toContain("<person>");
    expect(result).toContain("<name>John</name>");
  });

  it("formats with 4-space indentation", async () => {
    const input = "<root><person><name>John</name></person></root>";
    const result = await formatXml(input, { indentation: "four-spaces" });
    expect(result).toContain("<root>");
    expect(result).toContain("<person>");
  });

  it("throws error for invalid XML", async () => {
    const input = "<root><child>Unclosed";
    await expect(
      formatXml(input, { indentation: "two-spaces" }),
    ).rejects.toThrow();
  });
});
