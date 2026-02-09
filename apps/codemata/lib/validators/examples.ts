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
  <head><title>Test Page</title></head>
  <body>
    <p>Unclosed paragraph
    <span>Content</div>
  </body>
</html>`,

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
  <item id="2">Second Item</item>
  <mismatched></wrong>
</root>`,

  url: `https://example.com/api/users?page=1&limit=10
example.com
ftp://user:pass@files.company.com:21/assets
http://localhost:3000

https://192.168.1.1/admin#settings`,

  dockerfile: `# Base image without tag
from node

# Missing -y flag and dev dependencies
run apt-get update && apt-get install git build-essential

# Using sudo (not recommended)
RUN sudo npm install -g pnpm

# Multiple WORKDIR changes
WORKDIR /app
COPY package.json .
run npm install
WORKDIR /app/src

EXPOSE 80 443

# Missing CMD
`,
};
