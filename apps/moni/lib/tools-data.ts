import { TrendingUp } from "lucide-react";
import type { CalculatorTool, ToolCategory, ToolCategoryId } from "./types";

/**
 * Savings & Investing Calculators
 *
 * Record-based structure for O(1) lookups by slug.
 * Key is the URL slug (e.g., "simple-interest-calculator")
 */
export const SAVINGS_INVESTING_TOOLS: Record<string, CalculatorTool> = {
	"simple-interest-calculator": {
		id: "simple-interest",
		name: "Simple Interest Calculator",
		description: "Calculate simple interest on investments and savings",
		url: "/savings-investing/simple-interest-calculator",
		icon: TrendingUp,
		comingSoon: false,
		category: "savings-investing",
		defaultInputs: {
			principal: 10000,
			rate: 5,
			years: 10,
		},
		resultFields: ["finalAmount", "totalInterest"],
		keywords: [
			"simple interest",
			"investment",
			"savings",
			"CD",
			"certificate of deposit",
			"bonds",
			"interest rate",
		],
		metadata: {
			title: "Simple Interest Calculator | Moni",
			description:
				"Calculate simple interest on your investments. Free online calculator for savings accounts, CDs, and bonds with instant results.",
		},
	},
};

/**
 * Convert Record to array for iteration
 */
const ALL_SAVINGS_INVESTING = Object.values(SAVINGS_INVESTING_TOOLS);

/**
 * All calculator categories with their tools
 *
 * This is the single source of truth for all categories and tools.
 * Add new categories here as they're implemented.
 */
export const ALL_TOOLS: Record<ToolCategoryId, ToolCategory> = {
	"savings-investing": {
		id: "savings-investing",
		label: "Savings & Investing",
		singular: "Savings Calculator",
		url: "/savings-investing",
		description:
			"Calculate investment growth, savings goals, and retirement planning. Free calculators for compound interest, emergency funds, and FIRE planning.",
		order: 1,
		tools: ALL_SAVINGS_INVESTING,
	},
	// Future categories (Phase 1+)
	"debt-management": {
		id: "debt-management",
		label: "Debt Management",
		singular: "Debt Calculator",
		url: "/debt-management",
		description:
			"Pay off debt faster with snowball and avalanche strategies. Calculate loan amortization, debt consolidation, and payoff timelines.",
		order: 2,
		tools: [],
	},
	"real-estate": {
		id: "real-estate",
		label: "Real Estate & Mortgages",
		singular: "Mortgage Calculator",
		url: "/real-estate",
		description:
			"Calculate mortgage payments, affordability, and rent vs buy decisions. Plan your home purchase with confidence.",
		order: 3,
		tools: [],
	},
	taxes: {
		id: "taxes",
		label: "Taxes",
		singular: "Tax Calculator",
		url: "/taxes",
		description:
			"Estimate federal and state taxes, self-employment taxes, and tax brackets. Understand your tax obligations.",
		order: 4,
		tools: [],
	},
	budgeting: {
		id: "budgeting",
		label: "Budgeting",
		singular: "Budget Calculator",
		url: "/budgeting",
		description:
			"Create and manage your budget with the 50/30/20 rule. Track expenses and plan your financial future.",
		order: 5,
		tools: [],
	},
};

/**
 * Get all categories sorted by display order
 *
 * Memoized for performance - returns same reference on subsequent calls
 * Only returns categories that have at least one tool
 *
 * @returns Array of categories sorted by order property (ascending), filtered to non-empty categories
 */
let categoriesByOrderCache: ToolCategory[] | null = null;
export function getCategoriesByOrder(): ToolCategory[] {
	if (!categoriesByOrderCache) {
		categoriesByOrderCache = Object.values(ALL_TOOLS)
			.filter((category) => category.tools.length > 0)
			.sort((a, b) => a.order - b.order);
	}
	return categoriesByOrderCache;
}

/**
 * Get all calculator tools across all categories (flattened)
 *
 * @returns Array of all calculator tools, excluding coming soon items
 */
export function getAllTools(): CalculatorTool[] {
	return getCategoriesByOrder().flatMap((category) =>
		category.tools.filter((tool) => !tool.comingSoon),
	);
}

/**
 * Get total count of implemented calculators
 *
 * Excludes coming soon tools. Used for homepage metadata and cache busting.
 *
 * @returns Number of calculators available
 */
export function getTotalToolCount(): number {
	return getAllTools().length;
}

/**
 * Get category by ID with type safety
 *
 * @param id - Category identifier
 * @returns Category if found, undefined otherwise
 */
export function getCategoryById(id: ToolCategoryId): ToolCategory | undefined {
	return ALL_TOOLS[id];
}
