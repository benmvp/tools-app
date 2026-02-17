import { SchemaType } from "@google/generative-ai";

/**
 * Convert Zod schema to Gemini-compatible schema format
 * Gemini doesn't support JSON Schema $ref, definitions, or $schema fields
 * We need to inline everything
 */

export function buildGeminiSchema() {
	return {
		type: SchemaType.OBJECT,
		properties: {
			intro: {
				type: SchemaType.STRING,
				description:
					"Introductory paragraph (1-2 sentences) explaining the tool purpose",
			},
			seo: {
				type: SchemaType.OBJECT,
				properties: {
					title: {
						type: SchemaType.STRING,
						description: "Page title optimized for search (50-60 characters)",
					},
					description: {
						type: SchemaType.STRING,
						description:
							"Meta description for search results (150-160 characters)",
					},
					keywords: {
						type: SchemaType.STRING,
						description: "Comma-separated keywords for SEO",
					},
				},
				required: ["title", "description", "keywords"],
			},
			openGraph: {
				type: SchemaType.OBJECT,
				properties: {
					title: {
						type: SchemaType.STRING,
						description: "OpenGraph title",
					},
					description: {
						type: SchemaType.STRING,
						description: "OpenGraph description",
					},
					type: {
						type: SchemaType.STRING,
						description: 'OpenGraph type (always "website")',
					},
				},
				required: ["title", "description", "type"],
			},
			howToUse: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
				nullable: true,
			},
			features: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			rationale: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			purpose: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			integrate: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			faq: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			recommendations: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description:
							"Markdown formatted list of tool links with descriptions",
					},
					tools: {
						type: SchemaType.ARRAY,
						description: "Array of tool IDs recommended by AI",
						items: {
							type: SchemaType.STRING,
						},
					},
				},
				required: ["heading", "content", "tools"],
			},
			resources: {
				type: SchemaType.OBJECT,
				properties: {
					heading: {
						type: SchemaType.STRING,
						description: "Section heading",
					},
					content: {
						type: SchemaType.STRING,
						description: "Markdown formatted content",
					},
				},
				required: ["heading", "content"],
			},
			tips: {
				type: SchemaType.ARRAY,
				description: "3-5 contextual tips, facts, or best practices",
				items: {
					type: SchemaType.OBJECT,
					properties: {
						type: {
							type: SchemaType.STRING,
							description: "Type of tip",
						},
						content: {
							type: SchemaType.STRING,
							description:
								"Short, actionable tip or fact (under 150 characters)",
						},
					},
					required: ["type", "content"],
				},
			},
		},
		required: [
			"intro",
			"seo",
			"openGraph",
			"features",
			"rationale",
			"purpose",
			"integrate",
			"faq",
			"recommendations",
			"resources",
			"tips",
		],
	};
}
