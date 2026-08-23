/**
 * Central site configuration for Moni
 * Contains shared metadata, branding, and site-wide constants
 */

export const SITE_CONFIG = {
	name: "Moni",
	title: "Moni | Free Financial Calculators",
	tagline: "Financial Calculators",
	description:
		"Free online financial calculators and planning tools. Calculate compound interest, debt payoff, mortgage payments, budgets, and more. Make informed financial decisions.",

	// Social
	author: {
		name: "Ben Ilegbodu",
		url: "https://www.benmvp.com",
		twitter: "@benmvp",
	},

	// Common keywords used across pages
	keywords: [
		"financial calculator",
		"compound interest calculator",
		"debt payoff calculator",
		"mortgage calculator",
		"budget calculator",
		"savings calculator",
		"investment calculator",
		"loan calculator",
		"retirement calculator",
		"free financial tools",
		"online calculator",
		"personal finance",
	],

	// OpenGraph defaults
	openGraph: {
		type: "website" as const,
		locale: "en_US",
		siteName: "Moni",
		description:
			"Free financial calculators and planning tools. Calculate savings, debt payoff, mortgages, and more. Make informed financial decisions.",
		images: {
			url: "/logo.svg",
			width: 400,
			height: 400,
			alt: "Moni - Financial Calculators",
		},
	},

	// Twitter Card defaults
	twitter: {
		card: "summary_large_image" as const,
		description:
			"Free financial calculators and planning tools. Calculate savings, debt payoff, mortgages, and more. Make informed financial decisions.",
		images: ["/logo.svg"],
	},

	// Robots configuration
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large" as const,
			"max-snippet": -1,
		},
	},

	// Page-specific metadata
	pages: {
		home: {
			title: "Moni | Free Financial Calculators",
			description:
				"Free online financial calculators for budgeting, investing, debt payoff, and mortgages. Plan your financial future with accurate, easy-to-use tools.",
		},
		"savings-investing": {
			title: "Savings & Investing Calculators | Moni",
			description:
				"Free calculators for compound interest, retirement savings, emergency funds, and investment returns. Plan your financial goals with confidence.",
			keywords: [
				"compound interest calculator",
				"savings calculator",
				"investment calculator",
				"retirement calculator",
				"FIRE calculator",
				"emergency fund calculator",
			],
		},
	},
} as const;
