import { z } from "zod";

/**
 * Schema for individual content sections (heading + markdown content)
 */
export const contentSectionSchema = z.object({
  heading: z.string().describe("Section heading"),
  content: z.string().describe("Markdown formatted content"),
});

export type ContentSection = z.infer<typeof contentSectionSchema>;

/**
 * Schema for contextual tips, facts, and best practices
 */
export const tipSchema = z.object({
  type: z
    .enum(["tip", "fact", "bestPractice"])
    .describe("Type of tip: general tip, interesting fact, or best practice"),
  content: z
    .string()
    .describe("Short, actionable tip or fact (under 150 characters)"),
});

export type Tip = z.infer<typeof tipSchema>;

/**
 * Comprehensive schema for AI-generated tool content
 * Includes SEO metadata, OpenGraph tags, content sections, tips, and recommendations
 */
export const toolContentSchema = z.object({
  // Introductory paragraph (plain text, no markdown)
  intro: z
    .string()
    .describe(
      "Introductory paragraph (1-2 sentences) explaining the tool purpose",
    ),

  // SEO metadata for search engines
  seo: z.object({
    title: z
      .string()
      .describe(
        'Page title optimized for search (50-60 characters). Format: "{Language/Format} {Tool Type} | Codemata"',
      ),
    description: z
      .string()
      .describe(
        "Meta description for search results (150-160 characters). Include tool name, key benefit, and call-to-action.",
      ),
    keywords: z
      .string()
      .describe(
        "Comma-separated keywords for SEO. Include: tool type, language, variations, use cases.",
      ),
  }),

  // OpenGraph metadata for social sharing
  openGraph: z.object({
    title: z
      .string()
      .describe("OpenGraph title (can be longer than SEO title)"),
    description: z
      .string()
      .describe("OpenGraph description (can be longer than SEO description)"),
    type: z.literal("website").describe('OpenGraph type (always "website")'),
  }),

  // Content sections (all with heading + markdown content)
  howToUse: contentSectionSchema
    .describe(
      "Instructions to use the tool: numbered list (3-5 steps) in Markdown",
    )
    .optional(),

  features: contentSectionSchema.describe(
    "Features and benefits: bulleted list highlighting tool features",
  ),

  rationale: contentSectionSchema.describe(
    "Why use this tool: bulleted list explaining benefits and addressing pain points",
  ),

  purpose: contentSectionSchema.describe(
    "What is this language/format: brief paragraph explaining the language",
  ),

  integrate: contentSectionSchema.describe(
    "Workflow integration: tips for using the tool in development workflow (editor plugins, CLI tools, etc.)",
  ),

  faq: contentSectionSchema.describe(
    "Frequently Asked Questions: 3-5 Q&A pairs formatted with **Q:** and **A:** in Markdown",
  ),

  recommendations: z.object({
    heading: z.string().describe('Section heading (e.g., "Related Tools")'),
    content: z
      .string()
      .describe("Markdown formatted list of tool links with descriptions"),
    tools: z
      .array(z.string())
      .describe(
        "Array of tool IDs recommended by AI (will be validated against available tools)",
      ),
  }),

  resources: contentSectionSchema.describe(
    "External resources: links to official documentation and learning resources",
  ),

  // Contextual tips (3-5 tips/facts/best practices)
  tips: z
    .array(tipSchema)
    .min(3)
    .max(5)
    .describe("3-5 contextual tips, facts, or best practices"),
});

export type ToolContent = z.infer<typeof toolContentSchema>;
