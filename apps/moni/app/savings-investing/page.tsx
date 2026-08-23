import { getAppUrl, getOgImageUrl } from "@repo/shared";
import type { Metadata } from "next";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { getCategoryById } from "@/lib/tools-data";

const savingsInvestingCategory = getCategoryById("savings-investing");

if (!savingsInvestingCategory) {
	throw new Error("Savings & Investing category not found");
}

const calculatorCount = savingsInvestingCategory.tools.filter(
	(t) => !t.comingSoon,
).length;

const ogImageUrl = getOgImageUrl(
	`${calculatorCount} Savings & Investing Calculators`,
	SITE_CONFIG.pages["savings-investing"].description,
);

export const metadata: Metadata = {
	title: SITE_CONFIG.pages["savings-investing"].title,
	description: SITE_CONFIG.pages["savings-investing"].description,
	keywords: SITE_CONFIG.pages["savings-investing"]
		.keywords as unknown as string[],
	openGraph: {
		title: SITE_CONFIG.pages["savings-investing"].title,
		description: SITE_CONFIG.pages["savings-investing"].description,
		url: getAppUrl("/savings-investing"),
		images: [
			{
				url: ogImageUrl,
				width: 1200,
				height: 630,
				alt: `Moni - ${calculatorCount} Savings & Investing Calculators`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_CONFIG.pages["savings-investing"].title,
		description: SITE_CONFIG.pages["savings-investing"].description,
		images: [ogImageUrl],
	},
	alternates: {
		canonical: getAppUrl("/savings-investing"),
	},
};

export default function SavingsInvestingPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
			{/* Hero */}
			<section className="text-center py-8 md:py-12 mb-12">
			<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent pb-2">
					Savings & Investing Calculators
				</h1>
				<p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Plan your financial future with our free savings and investment
					calculators. From simple interest to compound growth, make informed
					decisions about your money.
				</p>
			</section>

			{/* Tools Grid */}
			<section>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{savingsInvestingCategory?.tools.map((tool) => (
						<ToolCard key={tool.id} {...tool} />
					))}
				</div>
			</section>

			{/* Educational Content */}
			<section className="mt-16 max-w-3xl mx-auto">
				<div className="text-base text-slate-600 dark:text-slate-400 space-y-4">
					<p>
						Understanding how your money grows is essential for building
						long-term wealth. Our savings and investing calculators help you
						project returns, compare investment options, and plan for major
						financial goals like retirement or a home purchase.
					</p>
					<p>
						All our calculators run in your browser for privacy—your financial
						data never leaves your device. No signup or installation required.
					</p>
				</div>
			</section>

			<ScrollToTopFab />
		</div>
	);
}
