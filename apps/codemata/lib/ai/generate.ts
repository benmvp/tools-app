import { shouldGenerateAI } from "../utils";
import { getCachedContent, setCachedContent } from "./cache";
import { callGeminiWithRetry } from "./client";
import {
  buildUserPrompt,
  getFormatterSystemPrompt,
  getMinifierSystemPrompt,
} from "./prompts";
import { type ToolContent, toolContentSchema } from "./schema";

/**
 * Process content to convert literal \n strings to actual newlines
 * The AI sometimes returns escaped newlines as literal strings
 */
function processContentNewlines(content: ToolContent): ToolContent {
  const processString = (str: string): string => {
    // Replace literal \n with actual newlines
    return str.replace(/\\n/g, "\n");
  };

  return {
    ...content,
    intro: processString(content.intro),
    howToUse: content.howToUse
      ? {
          heading: content.howToUse.heading,
          content: processString(content.howToUse.content),
        }
      : undefined,
    features: {
      heading: content.features.heading,
      content: processString(content.features.content),
    },
    rationale: {
      heading: content.rationale.heading,
      content: processString(content.rationale.content),
    },
    purpose: {
      heading: content.purpose.heading,
      content: processString(content.purpose.content),
    },
    integrate: {
      heading: content.integrate.heading,
      content: processString(content.integrate.content),
    },
    faq: {
      heading: content.faq.heading,
      content: processString(content.faq.content),
    },
    recommendations: {
      heading: content.recommendations.heading,
      content: processString(content.recommendations.content),
      tools: content.recommendations.tools,
    },
    resources: {
      heading: content.resources.heading,
      content: processString(content.resources.content),
    },
  };
}

/**
 * Generate AI content for a tool (formatter or minifier)
 * Returns undefined if generation fails (graceful degradation)
 */
export async function generateToolContent(
  toolId: string,
  toolName: string,
  toolType: "formatter" | "minifier",
  availableTools: Array<{ displayName: string; url: string }>,
): Promise<ToolContent | undefined> {
  // Skip AI generation based on environment mode
  if (!shouldGenerateAI()) {
    console.log(
      `Skipping AI generation for ${toolType}-${toolId} (AI disabled in current mode)`,
    );
    return undefined;
  }

  // Check cache first
  const cacheKey = `${toolType}-${toolId}`;
  const cached = getCachedContent<ToolContent>(cacheKey);

  if (cached) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached;
  }

  console.log(`Generating AI content for ${cacheKey}...`);

  try {
    // Get appropriate system prompt
    const systemPrompt =
      toolType === "formatter"
        ? getFormatterSystemPrompt()
        : getMinifierSystemPrompt();

    // Build user prompt with tool context
    const userPrompt = buildUserPrompt(toolName, toolType, availableTools);

    // Call Gemini API with retry logic
    const content = await callGeminiWithRetry<ToolContent>(
      systemPrompt,
      userPrompt,
    );

    if (!content) {
      console.error(`Failed to generate content for ${cacheKey}`);
      return undefined;
    }

    // Validate response with Zod
    const validated = toolContentSchema.safeParse(content);

    if (!validated.success) {
      console.error(
        `Validation failed for ${cacheKey}:`,
        JSON.stringify(validated.error.format(), null, 2),
      );
      return undefined;
    }

    // Post-process content: convert literal \n strings to actual newlines
    const processedData = processContentNewlines(validated.data);

    // Cache successful result
    setCachedContent(cacheKey, processedData);

    console.log(`Successfully generated content for ${cacheKey}`);
    return processedData;
  } catch (error) {
    console.error(`Error generating content for ${cacheKey}:`, error);
    return undefined;
  }
}
