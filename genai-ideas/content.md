# GenAI Content Generation Strategy

This document outlines the strategy for using Generative AI (GenAI) to create and refine content for `codemata.benmvp.com`, `moni.benmvp.com`, and `convertly.benmvp.com` during the build process.

**Goal:** Leverage GenAI to generate high-quality, SEO-friendly content while minimizing runtime costs and maintaining a consistent user experience.

**Approach:**

1.  **Initial Content Creation (Manual):**

    - Use GenAI to assist in creating initial Markdown (`.md`) files for each tool's description, examples, use cases, and a JSON (`.json`) file for FAQ and schema markup.
    - This is a one-time, manual process with careful prompt engineering, review, and editing.
    - These manually-crafted files serve as the "seed" content for future refinements.

2.  **Automated Refinement (Build-Time):**

    - Use GenAI to make small, incremental improvements to the existing content at a set schedule (e.g., weekly or monthly) or triggered by specific events (e.g., data updates).
    - Focus on refinements like:
      - Improving clarity and conciseness.
      - Rephrasing for engagement.
      - Adding more detail or explanation.
      - Incorporating relevant keywords.
      - Adjusting tone and style.
      - Reordering steps or bullets for better flow.
    - Generate multiple variations of content to choose from and potentially A/B test.
    - Use placeholders in prompts for dynamic content.

3.  **Content Storage:**
    - Store the generated content in separate Markdown (`.md`) or JSON (`.json`) files within each tool's directory. For instance:
      - `description.md`
      - `examples.md`
      - `use-cases.md`
      - `faq.json`
      - `schema.json`

**Implementation Details:**

- **Prompt Engineering:**

  - Craft specific prompts for each type of content (description, examples, FAQ, schema, use cases, "Did you know?").
  - Use a consistent format for prompts.
  - Include placeholders for dynamic data (e.g., tool name, keywords).
  - Iteratively refine prompts based on the quality of generated content.
  - Example Prompts:

    - **`description.md` prompt:**

      ```
      You are a technical writer creating documentation for a web developer tool called "{toolName}".

      Write a detailed description (around 200 words) for a developer tool called "{toolName}".

      Explain what the tool does, how it works, and why it's useful for developers.

      Use clear and concise language, and include the following keywords: {keywords}.
      ```

    - **`examples.md` prompt:**

      ```
      Provide 3 examples of how to use the "{toolName}" tool.

      Show the input and the formatted output for each example.
      ```

    - **`faq.json` prompt:**

      ```
      Generate 5 frequently asked questions and answers about using a "{toolName}" tool.

      The questions should cover topics like:
        - What is {toolName}?
        - Why is {toolName} important?
        - How does the tool handle different data types?
        - Are there any limitations to the tool?
        - Is the tool secure?

      Provide concise and informative answers.
      ```

    - **`schema.json` prompt:** (Adapt based on the specific schema type)

      ```
      Generate a JSON-LD schema markup of type "HowTo" for a tool called "{toolName}".

      The tool takes {input} and outputs {output}.

      Include relevant properties like name, description, keywords, and steps.
      ```

    - **`use-cases.md` prompt:**

      ```
      Describe 3 realistic scenarios where a web developer would need to use a "{toolName}" tool.

      Explain the problem the developer is facing and how the "{toolName}" tool helps them solve it.

      Be specific and provide context.
      ```

    - **`did-you-know.json` prompt:**

      ```
      Generate 3 "Did you know?" facts about {topic} that would be interesting to web developers.

      Keep each fact concise and engaging.

      Examples:
        - Did you know that JSON is based on a subset of the JavaScript programming language?
        - Did you know that JSON is the most common data format used for APIs on the web?
      ```

- **Refinement Prompts:**

  - Create a set of prompts to guide the GenAI in refining existing content.
  - Examples:
    - "Improve the clarity and conciseness of this section."
    - "Rephrase this paragraph to make it more engaging."
    - "Add a sentence or two to this section to better explain this concept."
    - "Incorporate the following keywords into this section: {keywords}."
    - "Make the tone of this section more friendly and approachable."
    - "Add a transition sentence to connect these two paragraphs."
    - "Can you reorder these steps to flow better?"
    - "Make sure this section is less than 250 words."

- **Build Script:**

  - Develop a Node.js script (or similar) to be executed during the `next build` process or on a schedule.
  - The script should:
    1.  Read tool metadata (from `minifiers.ts`, `formatters.ts`, etc.).
    2.  Read existing `.md` and `.json` content files.
    3.  Generate prompts for the GenAI, including existing content and refinement instructions.
    4.  Call the GenAI API (e.g., OpenAI API).
    5.  Save the generated/refined content back into the `.md` and `.json` files.
    6.  Potentially, only regenerate content periodically (e.g., weekly) or based on specific triggers.

- **Version Control:**
  - Commit all generated `.md` and `.json` files to Git to track changes and revert if necessary.

**Example Build Script (Conceptual Node.js):**

```javascript
const fs = require('fs')
const path = require('path')
// ... GenAI API setup ...

const toolsDir = path.join(__dirname, 'app/tools') // Adjust path as needed

async function generateOrRefineContent() {
  // ... Read tool metadata (e.g., from tools.ts) ...

  for (const toolId in toolsData) {
    const tool = toolsData[toolId]
    const toolDir = path.join(toolsDir, toolId)

    // 1. Initial Content Generation (if files don't exist)
    if (!fs.existsSync(path.join(toolDir, 'description.md'))) {
      // Generate initial description.md
    }
    if (!fs.existsSync(path.join(toolDir, 'examples.md'))) {
      // Generate initial examples.md
    }
    // ... (generate other initial content files) ...

    // 2. Refinement (if files exist and it's time to update)
    const lastGenerated = getLastGeneratedTimestamp(toolId) // Function to get last generation timestamp
    if (shouldUpdateContent(lastGenerated)) {
      const descriptionMdPath = path.join(toolDir, 'description.md')
      const existingDescription = fs.readFileSync(descriptionMdPath, 'utf-8')

      const refinementPrompt = `
        ${existingDescription}

        ---

        Please refine this content based on the following instruction:

        ${getRandomRefinementPrompt()} // Function to select a random refinement prompt
      `

      const refinedDescription =
        await generateContentWithGenAI(refinementPrompt)

      fs.writeFileSync(descriptionMdPath, refinedDescription)
      saveLastGeneratedTimestamp(toolId, Date.now())
    }
  }
}

generateOrRefineContent()
```
