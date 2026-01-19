import { describe, expect, it } from "vitest";
import {
  decodeJwt,
  encodeBase64,
  encodeHtmlEntity,
  encodeJsString,
  encodeUrl,
} from "../app/encoders/actions";

describe("encodeBase64", () => {
  it("encodes text to Base64", async () => {
    const input = "Hello, World!";
    const result = await encodeBase64(input, "encode");
    expect(result).toBe("SGVsbG8sIFdvcmxkIQ==");
  });

  it("decodes Base64 to text", async () => {
    const input = "SGVsbG8sIFdvcmxkIQ==";
    const result = await encodeBase64(input, "decode");
    expect(result).toBe("Hello, World!");
  });

  it("handles round-trip encoding/decoding", async () => {
    const original = "Test string with special chars: !@#$%^&*()";
    const encoded = await encodeBase64(original, "encode");
    const decoded = await encodeBase64(encoded, "decode");
    expect(decoded).toBe(original);
  });
});

describe("encodeUrl", () => {
  it("encodes URL-unsafe characters", async () => {
    const input = "Hello World!";
    const result = await encodeUrl(input, "encode");
    expect(result).toBe("Hello%20World!");
  });

  it("decodes URL-encoded strings", async () => {
    const input = "Hello%20World%21";
    const result = await encodeUrl(input, "decode");
    expect(result).toBe("Hello World!");
  });

  it("handles round-trip encoding/decoding", async () => {
    const original = "Test with spaces & special chars: !@#$";
    const encoded = await encodeUrl(original, "encode");
    const decoded = await encodeUrl(encoded, "decode");
    expect(decoded).toBe(original);
  });

  it("throws error on invalid URL decode", async () => {
    const input = "%E0%A4%A"; // Invalid percent encoding
    await expect(encodeUrl(input, "decode")).rejects.toThrow();
  });
});

describe("encodeHtmlEntity", () => {
  it("encodes HTML entities", async () => {
    const input = '<div class="container">Hello & World</div>';
    const result = await encodeHtmlEntity(input, "encode");
    expect(result).toContain("&lt;");
    expect(result).toContain("&gt;");
    expect(result).toContain("&quot;");
    expect(result).toContain("&amp;");
  });

  it("decodes HTML entities", async () => {
    const input =
      "&lt;div class=&quot;container&quot;&gt;Hello &amp; World&lt;/div&gt;";
    const result = await encodeHtmlEntity(input, "decode");
    expect(result).toBe('<div class="container">Hello & World</div>');
  });

  it("handles round-trip encoding/decoding", async () => {
    const original = '<script>alert("XSS")</script>';
    const encoded = await encodeHtmlEntity(original, "encode");
    const decoded = await encodeHtmlEntity(encoded, "decode");
    expect(decoded).toBe(original);
  });
});

describe("encodeJsString", () => {
  it("encodes JavaScript string literals", async () => {
    const input = 'Hello "World"!\nNew line';
    const result = await encodeJsString(input, "encode");
    expect(result).toMatch(/^".*"$/); // Should be wrapped in quotes
    expect(result).toContain('\\"'); // Quotes should be escaped
    expect(result).toContain("\\n"); // Newlines should be escaped
  });

  it("decodes JavaScript string literals", async () => {
    const input = '"Hello \\"World\\"!\\nNew line"';
    const result = await encodeJsString(input, "decode");
    expect(result).toBe('Hello "World"!\nNew line');
  });

  it("handles round-trip encoding/decoding", async () => {
    const original = 'Test with "quotes" and\nnewlines';
    const encoded = await encodeJsString(original, "encode");
    const decoded = await encodeJsString(encoded, "decode");
    expect(decoded).toBe(original);
  });

  it("handles strings without quotes (decodes anyway)", async () => {
    const input = "Hello World";
    const result = await encodeJsString(input, "decode");
    expect(result).toBe("Hello World");
  });
});

describe("decodeJwt", () => {
  it("decodes valid JWT token", async () => {
    // Standard JWT token (header.payload.signature)
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const result = await decodeJwt(token);
    const parsed = JSON.parse(result);

    expect(parsed).toHaveProperty("header");
    expect(parsed).toHaveProperty("payload");
    expect(parsed.header).toEqual({
      alg: "HS256",
      typ: "JWT",
    });
    expect(parsed.payload).toHaveProperty("sub", "1234567890");
    expect(parsed.payload).toHaveProperty("name", "John Doe");
  });

  it("returns formatted JSON", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.test";
    const result = await decodeJwt(token);
    // Should be valid JSON string
    expect(() => JSON.parse(result)).not.toThrow();
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty("header");
    expect(parsed).toHaveProperty("payload");
  });

  it("throws error on invalid JWT format", async () => {
    const invalidToken = "not.a.valid.jwt.token";
    await expect(decodeJwt(invalidToken)).rejects.toThrow();
  });

  it("throws error on malformed JWT", async () => {
    const malformedToken = "invalid";
    await expect(decodeJwt(malformedToken)).rejects.toThrow();
  });
});
