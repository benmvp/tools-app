import { ContentSection, RecommendedTools } from "@repo/ui";
import { TipCard } from "@/components/TipCard";
import type { CalculatorTool } from "@/lib/types";

interface CalculatorAIContentProps {
	slug: string;
	calculatorName: string;
	allTools?: CalculatorTool[];
}

// Placeholder type for AI content (will be defined in Phase 2)
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
	_slug,
	_calculatorName,
	allTools = [],
}: CalculatorAIContentProps) {
	// TODO: In Phase 2 - Implement AI content generation
	// const aiContent = await getCalculatorContent(slug, calculatorName);

	// Placeholder for Phase 1: Returns null (no AI content yet)
	// This will be replaced with AI-generated content in Phase 2
	return null;

	// The code below will be uncommented in Phase 2
	// biome-ignore lint/correctness/noUnreachable: Dead code intentional until Phase 2
	const aiContent = null as unknown as AIContent;
	const recommendedTools =
		aiContent.recommendations?.tools
			?.map((toolUrl: string) => {
				const tool = allTools.find(
					(t) => t.url === toolUrl || t.url.includes(toolUrl),
				);
				if (!tool) return undefined;
				return {
					displayName: tool.name,
					url: tool.url,
					description: tool.description,
				};
			})
			.filter(
				(
					tool,
				): tool is { displayName: string; url: string; description: string } =>
					tool !== undefined,
			)
			.slice(0, 3) || [];

	return (
		<>
			{/* How to Use Section (right after calculator) */}
			{aiContent.howToUse && (
				<ContentSection
					heading={aiContent.howToUse?.heading ?? ""}
					content={aiContent.howToUse?.content ?? ""}
				/>
			)}

			{/* Tip #1 */}
			{aiContent.tips?.[0] && (
				<TipCard
					type={aiContent.tips[0].type}
					content={aiContent.tips[0].content}
				/>
			)}

			{/* Use Cases Section */}
			{aiContent.useCases && (
				<ContentSection
					heading={aiContent.useCases?.heading ?? ""}
					content={aiContent.useCases?.content ?? ""}
				/>
			)}

			{/* Tip #2 */}
			{aiContent.tips?.[1] && (
				<TipCard
					type={aiContent.tips[1].type}
					content={aiContent.tips[1].content}
				/>
			)}

			{/* Formula/Math Section */}
			{aiContent.formula && (
				<ContentSection
					heading={aiContent.formula?.heading ?? ""}
					content={aiContent.formula?.content ?? ""}
				/>
			)}

			{/* Tip #3 */}
			{aiContent.tips?.[2] && (
				<TipCard
					type={aiContent.tips[2].type}
					content={aiContent.tips[2].content}
				/>
			)}

			{/* Limitations Section */}
			{aiContent.limitations && (
				<ContentSection
					heading={aiContent.limitations?.heading ?? ""}
					content={aiContent.limitations?.content ?? ""}
				/>
			)}

			{/* FAQ Section */}
			{aiContent.faq && (
				<ContentSection
					heading={aiContent.faq?.heading ?? ""}
					content={aiContent.faq?.content ?? ""}
				/>
			)}

			{/* Tip #4 */}
			{aiContent.tips?.[3] && (
				<TipCard
					type={aiContent.tips[3].type}
					content={aiContent.tips[3].content}
				/>
			)}

			{/* Recommendations Section */}
			{recommendedTools.length > 0 && (
				<RecommendedTools
					heading={aiContent.recommendations?.heading ?? ""}
					tools={recommendedTools}
				/>
			)}

			{/* Resources Section */}
			{aiContent.resources && (
				<ContentSection
					heading={aiContent.resources?.heading ?? ""}
					content={aiContent.resources?.content ?? ""}
				/>
			)}

			{/* Tip #5 */}
			{aiContent.tips?.[4] && (
				<TipCard
					type={aiContent.tips[4].type}
					content={aiContent.tips[4].content}
				/>
			)}
		</>
	);
}
