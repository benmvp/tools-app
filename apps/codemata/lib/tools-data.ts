import {
  Braces,
  Database,
  FileCode,
  FileCode2,
  FileText,
  Globe,
  Image as ImageIcon,
  Palette,
  Settings,
} from "lucide-react";
import {
  formatCss,
  formatGraphql,
  formatHtml,
  formatJson,
  formatMarkdown,
  formatSql,
  formatTypescript,
  formatXml,
  formatYaml,
} from "../app/formatters/actions";
import {
  minifyCss,
  minifyHtml,
  minifyJson,
  minifySvg,
  minifyTypescript,
  minifyXml,
} from "../app/minifiers/actions";
import type { FormatterTool, MinifierTool } from "./types";

/**
 * Formatter Tools - Record-based structure for O(1) lookups
 * Key is the URL slug (e.g., "typescript-formatter")
 */
export const FORMATTER_TOOLS: Record<string, FormatterTool> = {
  "typescript-formatter": {
    id: "typescript",
    name: "TypeScript & JavaScript Formatter",
    description: "Format JS, TS, JSX, and TSX code with proper indentation",
    url: "/formatters/typescript-formatter",
    icon: FileCode2,
    comingSoon: false,
    action: formatTypescript,
    language: "typescript",
    keywords: [
      "js",
      "javascript",
      "ts",
      "typescript",
      "jsx",
      "tsx",
      "ecmascript",
      "code",
    ],
    example: `function messy(x,y){
if(x>y){return x}
else{return y}}

const data={name:"John",age:30,city:"NYC"}

const arr=[1,2,3,4,5].map(n=>n*2).filter(n=>n>5)
`,
    metadata: {
      title: "TypeScript Formatter",
      description:
        "Format and beautify TypeScript code with proper indentation. Free online TypeScript formatter for cleaner, more readable code.",
    },
  },
  "json-formatter": {
    id: "json",
    name: "JSON Formatter",
    description: "Format and beautify JSON data with proper indentation",
    url: "/formatters/json-formatter",
    icon: Braces,
    comingSoon: false,
    action: formatJson,
    language: "json",
    keywords: ["json", "data", "api", "rest", "object"],
    example: `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","coding","hiking"],"isActive":true}`,
    metadata: {
      title: "JSON Formatter",
      description:
        "Format and beautify JSON data with proper indentation. Free online JSON formatter for better readability.",
    },
  },
  "css-formatter": {
    id: "css",
    name: "CSS Formatter",
    description: "Format CSS and SCSS stylesheets with proper indentation",
    url: "/formatters/css-formatter",
    icon: Palette,
    comingSoon: false,
    action: formatCss,
    language: "css",
    keywords: ["css", "scss", "sass", "styles", "stylesheet", "styling"],
    example: `.button{background-color:#007bff;color:#fff;padding:10px 20px;border:none;border-radius:4px;cursor:pointer}
.button:hover{background-color:#0056b3}
.container{max-width:1200px;margin:0 auto;padding:20px}
@media (max-width: 768px){.container{padding:10px}}`,
    metadata: {
      title: "CSS Formatter",
      description:
        "Format and beautify CSS code with proper indentation. Free online CSS formatter for cleaner stylesheets.",
    },
  },
  "html-formatter": {
    id: "html",
    name: "HTML Formatter",
    description: "Format and beautify HTML markup with proper indentation",
    url: "/formatters/html-formatter",
    icon: Globe,
    comingSoon: false,
    action: formatHtml,
    language: "html",
    keywords: ["html", "markup", "web", "htm", "tags"],
    example: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title></head><body><header><h1>Welcome</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li></ul></nav></header><main><p>This is a sample HTML document.</p></main></body></html>`,
    metadata: {
      title: "HTML Formatter",
      description:
        "Format and beautify HTML code with proper indentation. Free online HTML formatter for cleaner markup.",
    },
  },
  "graphql-formatter": {
    id: "graphql",
    name: "GraphQL Formatter",
    description: "Format GraphQL queries and schemas",
    url: "/formatters/graphql-formatter",
    icon: Database,
    comingSoon: false,
    action: formatGraphql,
    language: "graphql",
    keywords: ["graphql", "gql", "query", "api", "graph", "schema"],
    example: `query GetUser($id: ID!) { user(id: $id) { id name email posts { id title content createdAt } } }

mutation CreatePost($input: PostInput!) { createPost(input: $input) { id title content author { name } } }`,
    metadata: {
      title: "GraphQL Formatter",
      description:
        "Format and beautify GraphQL schemas and queries. Free online GraphQL formatter for better readability.",
    },
  },
  "markdown-formatter": {
    id: "markdown",
    name: "Markdown Formatter",
    description: "Format Markdown and MDX files",
    url: "/formatters/markdown-formatter",
    icon: FileText,
    comingSoon: false,
    action: formatMarkdown,
    language: "markdown",
    keywords: ["markdown", "md", "mdx", "docs", "readme", "documentation"],
    example: `# Sample Document

This is a **markdown** document with _various_ formatting.

## Features

- Lists
- **Bold** and *italic* text
- [Links](https://example.com)

### Code Example

\`\`\`javascript
const greeting = "Hello World";
\`\`\`

> A blockquote for emphasis`,
    metadata: {
      title: "Markdown Formatter",
      description:
        "Format and beautify Markdown documents. Free online Markdown formatter for consistent formatting.",
    },
  },
  "xml-formatter": {
    id: "xml",
    name: "XML Formatter",
    description: "Format and beautify XML documents",
    url: "/formatters/xml-formatter",
    icon: FileCode,
    comingSoon: false,
    action: formatXml,
    language: "xml",
    keywords: ["xml", "markup", "soap", "rss", "feed"],
    example: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date></book><book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price></book></catalog>`,
    metadata: {
      title: "XML Formatter",
      description:
        "Format and beautify XML documents with proper indentation. Free online XML formatter for cleaner markup.",
    },
  },
  "yaml-formatter": {
    id: "yaml",
    name: "YAML Formatter",
    description: "Format YAML configuration files",
    url: "/formatters/yaml-formatter",
    icon: Settings,
    comingSoon: false,
    action: formatYaml,
    language: "yaml",
    keywords: ["yaml", "yml", "config", "configuration", "settings"],
    example: `name: John Doe
age:  30
email:  john@example.com
address:  {  street:  123 Main St,  city:  New York,  zipCode:  '10001'  }
hobbies:  [  reading,  coding,  hiking  ]
isActive:  true`,
    metadata: {
      title: "YAML Formatter",
      description:
        "Format and beautify YAML configuration files. Free online YAML formatter for consistent formatting.",
    },
  },
  "sql-formatter": {
    id: "sql",
    name: "SQL Formatter",
    description: "Format SQL queries with proper indentation and keyword case",
    url: "/formatters/sql-formatter",
    icon: Database,
    comingSoon: false,
    action: formatSql,
    language: "sql",
    keywords: [
      "sql",
      "query",
      "database",
      "mysql",
      "postgresql",
      "sqlite",
      "mssql",
      "oracle",
    ],
    example: `SELECT u.id,u.name,u.email,o.order_id,o.total,o.created_at FROM users u INNER JOIN orders o ON u.id=o.user_id WHERE o.total>100 AND u.status='active' ORDER BY o.created_at DESC LIMIT 10`,
    metadata: {
      title: "SQL Formatter",
      description:
        "Format and beautify SQL queries with customizable indentation and keyword case. Free online SQL formatter for all major dialects.",
    },
  },
};

/**
 * Minifier Tools - Record-based structure for O(1) lookups
 * Key is the URL slug (e.g., "typescript-minifier")
 */
export const MINIFIER_TOOLS: Record<string, MinifierTool> = {
  "typescript-minifier": {
    id: "typescript-min",
    name: "TypeScript & JavaScript Minifier",
    description: "Minify and compress JS and TS code",
    url: "/minifiers/typescript-minifier",
    icon: FileCode2,
    comingSoon: false,
    action: minifyTypescript,
    language: "typescript",
    keywords: [
      "js",
      "javascript",
      "ts",
      "typescript",
      "compress",
      "uglify",
      "minify",
    ],
    example: `// Calculate factorial recursively
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Example usage
const result = factorial(5);
console.log("Factorial of 5 is:", result);

// Array utilities
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
const sum = doubled.reduce((acc, val) => acc + val, 0);
`,
    metadata: {
      title: "TypeScript & JavaScript Minifier",
      description:
        "Minify and compress JavaScript and TypeScript code. Free online minifier that removes whitespace, shortens variable names, and optimizes your code for production.",
    },
  },
  "json-minifier": {
    id: "json-min",
    name: "JSON Minifier",
    description: "Compress JSON by removing whitespace",
    url: "/minifiers/json-minifier",
    icon: Braces,
    comingSoon: false,
    action: minifyJson,
    language: "json",
    keywords: ["json", "compress", "minify", "compact"],
    example: `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": [
    "reading",
    "coding",
    "hiking"
  ],
  "isActive": true
}`,
    metadata: {
      title: "JSON Minifier",
      description:
        "Minify and compress JSON data by removing whitespace. Free online JSON minifier for reducing file size.",
    },
  },
  "css-minifier": {
    id: "css-min",
    name: "CSS Minifier",
    description: "Minify and optimize CSS stylesheets",
    url: "/minifiers/css-minifier",
    icon: Palette,
    comingSoon: false,
    action: minifyCss,
    language: "css",
    keywords: ["css", "compress", "minify", "optimize"],
    example: `/* Button styles */
.button {
  background-color: #007bff;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

/* Container styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}`,
    metadata: {
      title: "CSS Minifier",
      description:
        "Minify and optimize CSS stylesheets. Free online CSS minifier that removes whitespace, comments, and optimizes your styles for production.",
    },
  },
  "html-minifier": {
    id: "html-min",
    name: "HTML Minifier",
    description: "Compress HTML by removing whitespace and comments",
    url: "/minifiers/html-minifier",
    icon: Globe,
    comingSoon: false,
    action: minifyHtml,
    language: "html",
    keywords: ["html", "compress", "minify", "optimize"],
    example: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <!-- This is a comment -->
</head>
<body>
  <header>
    <h1>Welcome to My Site</h1>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Article Title</h2>
      <p>This is a sample HTML document with proper formatting.</p>
      <p>It includes multiple elements and whitespace.</p>
    </article>
  </main>

  <footer>
    <p>&copy; 2024 Example Site</p>
  </footer>
</body>
</html>`,
    metadata: {
      title: "HTML Minifier",
      description:
        "Minify and compress HTML code. Free online HTML minifier that removes whitespace, comments, and optimizes your HTML for production.",
    },
  },
  "svg-minifier": {
    id: "svg-min",
    name: "SVG Minifier",
    description: "Optimize and compress SVG images",
    url: "/minifiers/svg-minifier",
    icon: ImageIcon,
    comingSoon: false,
    action: minifySvg,
    language: "xml",
    keywords: ["svg", "image", "vector", "optimize", "compress"],
    example: `<?xml version="1.0" encoding="UTF-8"?>
<!-- SVG Icon Example -->
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#3B82F6" />
  <path d="M 30 50 L 45 65 L 70 35" stroke="white" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    metadata: {
      title: "SVG Minifier",
      description:
        "Optimize and compress SVG images. Free online SVG minifier that removes unnecessary data, comments, and optimizes your SVG files.",
    },
  },
  "xml-minifier": {
    id: "xml-min",
    name: "XML Minifier",
    description: "Compress XML by removing whitespace and comments",
    url: "/minifiers/xml-minifier",
    icon: FileCode,
    comingSoon: false,
    action: minifyXml,
    language: "xml",
    keywords: ["xml", "compress", "minify", "optimize"],
    example: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Book catalog -->
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies.</description>
  </book>
</catalog>`,
    metadata: {
      title: "XML Minifier",
      description:
        "Minify and compress XML documents. Free online XML minifier that removes whitespace, comments, and optimizes your XML for production.",
    },
  },
};

/**
 * Helper arrays for navigation components
 * Use Object.values() to get arrays from Records
 */
export const ALL_FORMATTERS: FormatterTool[] = Object.values(FORMATTER_TOOLS);
export const ALL_MINIFIERS: MinifierTool[] = Object.values(MINIFIER_TOOLS);

/**
 * Centralized tool registry for dynamic counting and category lookups.
 * Used by OG image generation to calculate tool counts automatically.
 */
export const ALL_TOOLS = {
  formatters: ALL_FORMATTERS,
  minifiers: ALL_MINIFIERS,
} as const;

/**
 * Type-safe slug helpers using template literal types
 */
export type FormatterSlug = keyof typeof FORMATTER_TOOLS;
export type MinifierSlug = keyof typeof MINIFIER_TOOLS;
export type ToolSlug = FormatterSlug | MinifierSlug;
