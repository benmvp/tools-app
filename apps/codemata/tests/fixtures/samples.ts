/**
 * Test fixtures for E2E tests
 *
 * Separate from production examples in tools-data.ts to:
 * - Test edge cases that aren't good demos
 * - Maintain test stability (won't break if examples change)
 * - Include malformed/invalid code for error testing
 */

export const FORMATTER_SAMPLES = {
  typescript: {
    valid: `function messy(x,y){if(x>y){return x}else{return y}}const data={name:"Test",age:30}`,
    invalid: `function broken(x,y){if(x>y){return x`,
    empty: "",
    long: `${"const x = 1;\n".repeat(100)}`,
  },
  json: {
    valid: `{"name":"Test","nested":{"value":123,"items":[1,2,3]}}`,
    invalid: `{"name":}`,
    empty: "",
    withSpecialChars: `{"text":"Line\\nbreak","quote":"He said \\"hello\\""}`,
  },
  css: {
    valid: `.btn{background:#007bff;color:#fff;padding:10px 20px}`,
    invalid: `.btn{background:}`,
    empty: "",
    withMediaQuery: `.container{max-width:1200px}@media (max-width: 768px){.container{padding:10px}}`,
  },
  html: {
    valid: `<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>`,
    invalid: `<div><p>Unclosed`,
    empty: "",
    nested: `<div><div><div><p>Deeply nested</p></div></div></div>`,
  },
  graphql: {
    valid: `query GetUser($id:ID!){user(id:$id){id name email}}`,
    invalid: `query{user{`,
    empty: "",
  },
  markdown: {
    valid: `# Title\n\n**Bold** and *italic* text.\n\n- Item 1\n- Item 2`,
    empty: "",
    withCode: "# Code Example\n\n```js\nconst x = 1;\n```",
  },
  xml: {
    valid: `<?xml version="1.0"?><root><item id="1">Test</item></root>`,
    invalid: `<root><item>Unclosed`,
    empty: "",
  },
  yaml: {
    valid: `name: Test\nage: 30\nhobbies:\n  - reading\n  - coding`,
    invalid: `name: Test\n  invalid indentation`,
    empty: "",
  },
  sql: {
    valid: `SELECT u.id,u.name FROM users u WHERE u.status='active' ORDER BY u.created_at DESC LIMIT 10`,
    empty: "",
  },
};

export const MINIFIER_SAMPLES = {
  typescript: {
    valid: `// Calculate factorial\nfunction factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n\nconst result = factorial(5);\nconsole.log("Result:", result);`,
    empty: "",
    withComments: `/* Multi-line\n   comment */\nfunction test() {\n  // Single line comment\n  return 42;\n}`,
  },
  json: {
    valid: `{\n  "name": "Test",\n  "age": 30,\n  "address": {\n    "city": "NYC"\n  }\n}`,
    empty: "",
  },
  css: {
    valid: `/* Button styles */\n.button {\n  background-color: #007bff;\n  padding: 10px 20px;\n}\n\n.button:hover {\n  background-color: #0056b3;\n}`,
    empty: "",
  },
  html: {
    valid: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Test</title>\n  <!-- Comment -->\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>`,
    empty: "",
  },
  svg: {
    valid: `<?xml version="1.0"?>\n<!-- SVG Icon -->\n<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="#3B82F6" />\n</svg>`,
    empty: "",
  },
  xml: {
    valid: `<?xml version="1.0"?>\n<!-- Comment -->\n<catalog>\n  <book id="1">\n    <title>XML Guide</title>\n  </book>\n</catalog>`,
    empty: "",
  },
};

export const ENCODER_SAMPLES = {
  base64: {
    plain: "Hello, World!",
    encoded: "SGVsbG8sIFdvcmxkIQ==",
    invalid: "Invalid!!!Base64@@@",
  },
  url: {
    plain: "Hello World!",
    encoded: "Hello%20World!",
    invalid: "%E0%A4%A", // Invalid percent encoding
  },
  "html-entity": {
    plain: "Hello & World <tag>",
    encoded: "Hello &amp; World &lt;tag&gt;",
    invalid: "&invalid;", // Not a real entity, but won't error - just passes through
  },
  "js-string": {
    plain: 'Hello "World"',
    encoded: '"Hello \\"World\\""',
    invalid: "", // JS string decoder is forgiving
  },
  jwt: {
    valid:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    invalid: "not.a.jwt.token",
  },
};
