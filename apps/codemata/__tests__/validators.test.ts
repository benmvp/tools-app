import { describe, expect, it } from "vitest";
import { validateJson } from "../app/validators/actions";

describe("validateJson", () => {
  describe("Syntax Validation", () => {
    it("validates correct JSON", async () => {
      const result = await validateJson('{"valid": true}');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metadata?.type).toBe("object");
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
      expect(result.metadata?.type).toBe("array");
      expect(result.metadata?.items).toBe(3);
    });

    it("validates primitives", async () => {
      const result = await validateJson('"hello"');

      expect(result.valid).toBe(true);
      expect(result.metadata?.type).toBe("string");
    });

    it("validates numbers", async () => {
      const result = await validateJson("42");

      expect(result.valid).toBe(true);
      expect(result.metadata?.type).toBe("number");
    });

    it("validates booleans", async () => {
      const result = await validateJson("true");

      expect(result.valid).toBe(true);
      expect(result.metadata?.type).toBe("boolean");
    });

    it("validates null", async () => {
      const result = await validateJson("null");

      expect(result.valid).toBe(true);
      expect(result.metadata?.type).toBe("null");
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

  describe("Metadata Calculation", () => {
    it("calculates object metadata", async () => {
      const result = await validateJson('{"a": 1, "b": 2, "c": 3}');

      expect(result.metadata?.type).toBe("object");
      expect(result.metadata?.properties).toBe(3);
      expect(result.metadata?.bytes).toBeGreaterThan(0);
    });

    it("calculates array metadata", async () => {
      const result = await validateJson("[1, 2, 3, 4, 5]");

      expect(result.metadata?.type).toBe("array");
      expect(result.metadata?.items).toBe(5);
      expect(result.metadata?.bytes).toBeGreaterThan(0);
    });

    it("handles nested structures", async () => {
      const result = await validateJson('{"nested": {"deep": "value"}}');

      expect(result.valid).toBe(true);
      expect(result.metadata?.type).toBe("object");
      expect(result.metadata?.properties).toBe(1);
    });

    it("calculates bytes correctly", async () => {
      const input = '{"test": "value"}';
      const result = await validateJson(input);

      // Bytes should match input length (UTF-8)
      expect(result.metadata?.bytes).toBe(
        new TextEncoder().encode(input).length,
      );
    });
  });
});
