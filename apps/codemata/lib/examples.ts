export const TYPESCRIPT_EXAMPLE = `function messy(x,y){
if(x>y){return x}
else{return y}}

const data={name:"John",age:30,city:"NYC"}

const arr=[1,2,3,4,5].map(n=>n*2).filter(n=>n>5)
`;

export const JSON_EXAMPLE = `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","coding","hiking"],"isActive":true}`;

export const YAML_EXAMPLE = `name:    John Doe
age:  30
email:  john@example.com
address:  {  street:  123 Main St,  city:  New York,  zipCode:  '10001'  }
hobbies:  [  reading,  coding,  hiking  ]
isActive:  true`;

export const CSS_EXAMPLE = `.button{background-color:#007bff;color:#fff;padding:10px 20px;border:none;border-radius:4px;cursor:pointer}
.button:hover{background-color:#0056b3}
.container{max-width:1200px;margin:0 auto;padding:20px}
@media (max-width: 768px){.container{padding:10px}}`;

export const HTML_EXAMPLE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title></head><body><header><h1>Welcome</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li></ul></nav></header><main><p>This is a sample HTML document.</p></main></body></html>`;

export const GRAPHQL_EXAMPLE = `query GetUser($id: ID!) { user(id: $id) { id name email posts { id title content createdAt } } }

mutation CreatePost($input: PostInput!) { createPost(input: $input) { id title content author { name } } }`;

export const MARKDOWN_EXAMPLE = `# Sample Document

This is a **markdown** document with _various_ formatting.

## Features

- Lists
- **Bold** and *italic* text
- [Links](https://example.com)

### Code Example

\`\`\`javascript
const greeting = "Hello World";
\`\`\`

> A blockquote for emphasis`;

export const XML_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date></book><book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price></book></catalog>`;

// Minifier examples (unminified code that needs compression)
export const TYPESCRIPT_MINIFIER_EXAMPLE = `// Calculate factorial recursively
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
`;

export const JSON_MINIFIER_EXAMPLE = `{
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
}`;

export const CSS_MINIFIER_EXAMPLE = `/* Button styles */
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
}`;

export const HTML_MINIFIER_EXAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <!-- Header section -->
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

  <!-- Main content -->
  <main>
    <p>This is a sample HTML document with extra whitespace.</p>
  </main>
</body>
</html>`;

export const SVG_MINIFIER_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Sample SVG icon -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <title>Heart Icon</title>
  <desc>A simple heart icon</desc>
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
</svg>`;

export const XML_MINIFIER_EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Product catalog -->
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
</catalog>`;
