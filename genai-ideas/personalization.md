**Concept:**

The core idea is to use GenAI to suggest relevant tools to the user based on either the tool they are currently viewing or a set of preferences. These recommendations are generated at build time, ensuring there are no runtime costs or performance impacts associated with dynamic GenAI calls.

**Goals:**

- **Enhanced User Experience:** Help users discover tools they might not otherwise find.
- **Increased Engagement:** Encourage users to explore more of your tools.
- **Cross-Promotion:** Drive traffic between your different apps.
- **Build-Time Execution:** Generate recommendations during the build process.

**Implementation Details:**

1. **Prompt Engineering:**

   - You'll craft prompts that instruct the GenAI to recommend tools based on either:
     1. **Current Tool Context:** The tool the user is currently viewing.
     2. **User Preferences:** A set of preferences (which could be inferred or explicitly set in the future).
   - **Prompt Examples:**

**Context-Based:**

```
"Given that the user is currently viewing the {currentToolName} tool, recommend 3 other tools from this list that they might find useful: {list of tool names and descriptions}."
```

**Preference-Based:**

```
"Based on the user's preferences: {userPreferences}, suggest 5 tools from the following list that they are most likely to be interested in: {list of tool names and descriptions}."
```

2. **Data Source:**

   - **Tool Metadata:** You'll need a well-structured dataset that includes:
     1. Tool Name
     2. Tool Description
     3. Tool Category (e.g., "formatter," "minifier," "converter," "calculator")
     4. App (`codemata`, `moni`, or `convertly`)
   - **User Preferences (Future):**
     1. This is more complex and would likely involve user accounts or some form of user tracking. For now, you can focus on context-based recommendations.

3. **Build Script:**

   - Your build script will:
     1. Read the tool metadata.
     2. For each tool, generate a prompt for the GenAI, including the current tool's name and description and potentially a list of other tools.
     3. Call the GenAI API to get the recommendations.
     4. Parse the GenAI's response (which should be a structured format like JSON, listing the recommended tool IDs).
     5. Store the recommendations in a file (e.g., `recommendations.json`) for each tool.

4. **Example `recommendations.json` (for a "JSON Formatter" tool):**

```json
["json-minifier", "xml-formatter", "csv-to-json-converter"]
```

**Advantages:**

- **Highly Relevant:** Recommendations are tailored to the current tool or user preferences.
- **Improved User Experience:** Helps users discover useful tools and navigate your suite of apps.
- **Increased Engagement:** Encourages users to explore more of your offerings.
- **SEO:** Potentially improves internal linking and adds more relevant content to your pages.
- **Cost-Effective:** All GenAI processing happens at build time.

**Considerations:**

- **Prompt Engineering:** You'll need to experiment with different prompt structures to ensure the GenAI provides high-quality recommendations.
- **Cold Start Problem (for Preference-Based):** If you eventually implement user preferences, you'll need a way to handle new users who don't have any preferences yet. You could use default recommendations or ask users a few initial questions to infer their interests.
- **Evaluation:** It's important to evaluate the quality of the generated recommendations. You might need to manually review them or gather user feedback to fine-tune your prompts.

**Example Scenario:**

1. A user visits the "JSON Formatter" tool on `codemata.benmvp.com`.

2. During the build process, a prompt like this was sent to the GenAI:

```
"Given that the user is currently viewing the JSON Formatter tool, recommend 3 other tools from this list that they might find useful: {list of all tool names and descriptions}."
```

3. The GenAI responded with:

```json
["json-minifier", "xml-formatter", "csv-to-json-converter"]
```

4. **This data was saved in `json-formatter/recommendations.json`.**

5. **The `RecommendedTools` component on the "JSON Formatter" page loads `recommendations.json` and displays links to the "JSON Minifier," "XML Formatter," and "CSV to JSON Converter" tools.**
