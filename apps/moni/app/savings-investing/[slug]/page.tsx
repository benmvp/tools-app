import { getToolStructuredData } from "@repo/shared";
import { CategoryBackLink, JsonLd } from "@repo/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CalculatorAIContent } from "@/components/CalculatorAIContent";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { SimpleInterestCalculator } from "@/components/SimpleInterestCalculator";
import { VisitTracker } from "@/components/VisitTracker";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { getAllTools, SAVINGS_INVESTING_TOOLS } from "@/lib/tools-data";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Valid calculator slugs
type CalculatorSlug = keyof typeof SAVINGS_INVESTING_TOOLS;

/**
 * Generate static params for all calculators at build time
 * This enables Static Site Generation (SSG) for all calculator pages
 */
export function generateStaticParams() {
	return Object.keys(SAVINGS_INVESTING_TOOLS).map((slug) => ({
		slug,
	}));
}

/**
 * Generate metadata for calculator pages dynamically
 */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const calculator = SAVINGS_INVESTING_TOOLS[slug as CalculatorSlug];

	if (!calculator) {
		return {
			title: "Calculator Not Found",
		};
	}

	return generateToolMetadata({
		slug,
		category: "savings-investing",
		tools: SAVINGS_INVESTING_TOOLS,
		// biome-ignore lint/suspicious/noExplicitAny: ToolType union doesn't include calculator yet
		toolType: "calculator" as any,
	});
}

/**
 * Calculator tool page
 * Displays calculator UI, financial disclaimer, and AI-generated educational content
 */
export default async function CalculatorPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const calculator = SAVINGS_INVESTING_TOOLS[slug as CalculatorSlug];

	if (!calculator) {
		notFound();
	}

	const allTools = getAllTools();

	return (
		<>
			{/* JSON-LD Structured Data */}
			<JsonLd data={getToolStructuredData(calculator.url, calculator.name)} />

			{/* Visit Tracker for Analytics */}
			<VisitTracker url={calculator.url} />

			<div className="mx-auto max-w-7xl px-4 py-3 lg:py-8">
				{/* Category Navigation */}
				<CategoryBackLink
					href="/savings-investing"
					label="Savings & Investing"
				/>

				{/* Page Title */}
				<h1 className="mb-2 text-4xl font-bold">{calculator.name}</h1>

				{/* Intro paragraph */}
				<p className="mb-8 text-slate-600 dark:text-slate-400">
					{calculator.description}
				</p>

				{/* Calculator Component */}
				{slug === "simple-interest-calculator" && <SimpleInterestCalculator />}

				{/* Financial Disclaimer */}
				<div className="mt-8">
					<FinancialDisclaimer />
				</div>

				{/* AI-Generated Content Sections with Suspense */}
				<div className="mt-12 space-y-8">
					<Suspense fallback={<AIContentSkeleton />}>
						<CalculatorAIContent
							slug={slug}
							calculatorName={calculator.name}
							allTools={allTools}
						/>
					</Suspense>
				</div>

				{/* Scroll to Top FAB */}
				<ScrollToTopFab />
			</div>
		</>
	);
}
