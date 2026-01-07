/**
 * Central site configuration for Codemata
 * Contains shared metadata, branding, and site-wide constants
 */

export const SITE_CONFIG = {
	name: "Codemata",
	title: "Codemata | Free Online Developer Tools",
	tagline: "Developer Tools for Code Transformation",
	description:
		"Free online code formatters, minifiers, and developer tools. Format and beautify JavaScript, TypeScript, JSON, CSS, HTML, and more. No installation required.",

	// Social
	author: {
		name: "Ben Ilegbodu",
		url: "https://www.benmvp.com",
		twitter: "@benmvp",
	},

	// Common keywords used across pages
	keywords: [
		"code formatter",
		"code minifier",
		"online developer tools",
		"beautify code",
		"javascript formatter",
		"typescript formatter",
		"json formatter",
		"css formatter",
		"html formatter",
		"free developer tools",
	],

	// OpenGraph defaults
	openGraph: {
		type: "website" as const,
		locale: "en_US",
		siteName: "Codemata",
		description:
			"Transform your code instantly with free formatters and minifiers. Support for JavaScript, TypeScript, JSON, CSS, HTML, and more.",
		images: {
			url: "/logo.svg",
			width: 400,
			height: 400,
			alt: "Codemata - Developer Tools",
		},
	},

	// Twitter Card defaults
	twitter: {
		card: "summary_large_image" as const,
		description:
			"Transform your code instantly with free formatters and minifiers. Support for JavaScript, TypeScript, JSON, CSS, HTML, and more.",
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
} as const;
