import type { CalculatorTool } from "@/lib/types";

interface CalculatorAIContentProps {
	slug: string;
	calculatorName: string;
	allTools?: CalculatorTool[];
}

// Placeholder type for AI content (will be defined in Phase 2)
// biome-ignore lint/correctness/noUnusedVariables: Defined for future Phase 2 implementation
interface AIContent {
	howToUse?: { heading: string; content: string };
	useCases?: { heading: string; content: string };
	formula?: { heading: string; content: string };
	limitations?: { heading: string; content: string };
	faq?: { heading: string; content: string };
	resources?: { heading: string; content: string };
	recommendations: {
		heading: string;
		tools: string[];
	};
	tips: Array<{
		type: "tip" | "fact" | "bestPractice";
		content: string;
	}>;
}

/**
 * AI-generated content for calculator pages
 *
 * Displays educational content, tips, use cases, and recommendations
 * tailored for financial calculators. This component is wrapped in
 * Suspense for better loading UX.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<AIContentSkeleton />}>
 *   <CalculatorAIContent
 *     slug="simple-interest-calculator"
 *     calculatorName="Simple Interest Calculator"
 *     allTools={allTools}
 *   />
 * </Suspense>
 * ```
 */
export async function CalculatorAIContent({
	slug: _slug,
	calculatorName: _calculatorName,
	allTools: _allTools = [],
}: CalculatorAIContentProps) {
	// TODO: In Phase 2 - Implement AI content generation
	// const aiContent = await getCalculatorContent(slug, calculatorName);

	// Phase 0: No AI content yet (waiting for deployment and Phase 1)
	return null;
}
