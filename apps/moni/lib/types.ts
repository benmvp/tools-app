import type { LucideIcon } from "lucide-react";

/**
 * Valid calculator category identifiers for Moni
 * Defines the major groupings of financial calculators
 */
export type ToolCategoryId =
	| "savings-investing"
	| "debt-management"
	| "real-estate"
	| "taxes"
	| "budgeting";

/**
 * Base Tool interface for all financial calculators
 */
export interface Tool {
	/** Unique identifier for the calculator */
	id: string;
	/** Display name for navigation and cards */
	name: string;
	/** Short description for cards and OpenGraph */
	description: string;
	/** Absolute URL path (e.g., "/savings-investing/simple-interest-calculator") */
	url: string;
	/** Lucide icon component for visual branding */
	icon: LucideIcon;
	/** Whether this calculator is planned but not yet implemented */
	comingSoon?: boolean;
	/** Search keywords for command menu fuzzy matching */
	keywords?: string[];
	/** SEO metadata (static fallback when AI generation fails) */
	metadata: {
		/** Page title (50-60 chars ideal) */
		title: string;
		/** Meta description (120-160 chars ideal) */
		description: string;
	};
}

/**
 * Calculator tool configuration
 *
 * Financial calculators run client-side for privacy and instant results.
 * Unlike formatters/minifiers, calculators:
 * - Execute in the browser (no Server Actions)
 * - Have custom UIs specific to their calculation type
 * - Use pure calculation functions (lib/calculations/)
 * - Display results with context-dependent decimal formatting
 */
export interface CalculatorTool extends Tool {
	/** Category this calculator belongs to */
	category: ToolCategoryId;
	/** Default input values for calculator initialization */
	defaultInputs: Record<string, string | number>;
	/** Result field keys displayed in output panel */
	resultFields: string[];
}

/**
 * Category containing multiple calculator tools
 *
 * Categories organize calculators by financial domain (e.g., savings,
 * debt management, mortgages). Each category has its own landing page
 * and is displayed as a section on the home page.
 */
export interface ToolCategory {
	/** Unique category identifier (matches ToolCategoryId) */
	id: ToolCategoryId;
	/** Display label for navigation (e.g., "Savings & Investing") */
	label: string;
	/** Singular form for SEO (e.g., "Savings Calculator") */
	singular: string;
	/** Category URL path (e.g., "/savings-investing") */
	url: string;
	/** SEO description for category landing page */
	description: string;
	/** Display order in navigation (lower = higher priority) */
	order: number;
	/** Calculators in this category */
	tools: CalculatorTool[];
}

/**
 * Simple Interest calculation input parameters
 */
export interface SimpleInterestInput {
	/** Initial investment amount (principal) in dollars */
	principal: number;
	/** Annual interest rate as decimal (0.05 = 5%) */
	rate: number;
	/** Investment time period in years */
	years: number;
}

/**
 * Simple Interest calculation results
 */
export interface SimpleInterestResult {
	/** Total value at end of period (principal + interest) */
	finalAmount: number;
	/** Total interest earned over the period */
	totalInterest: number;
	/** Original principal amount echoed back */
	principal: number;
	/** Annual interest rate echoed back */
	rate: number;
	/** Time period in years echoed back */
	years: number;
}
