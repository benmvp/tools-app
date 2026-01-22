export const VALIDATOR_EXAMPLES = {
  json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "javascript"],
}`,

  jsonSchema: `{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number", "minimum": 0 },
    "email": { "type": "string", "format": "email" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}`,

  regex: {
    pattern: String.raw`(\w+)@(\w+\.\w+)`,
    flags: "gi",
    testString: "Contact us at john@example.com or jane@test.org for support.",
  },

  html: `<!DOCTYPE html>
<html>
  <head><title>Test Page</title>
  <body>
    <div>
      <p>Unclosed paragraph
      <span>Mismatched nesting</div>
    </span>
  </body>`,

  css: `.container {
  color: #ff0000;
  background: blue
  padding: 20px;
}

.header {
  font-size: 24px;
  font-weight bold;
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">First Item</item>
  <item id="2">
    <name>Second Item
    <value>Missing closing tag
  </item>
  <mismatched></wrong>
</root>`,

  url: `https://example.com/path/to/resource?param=value#section`,
};
