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
		"beautify code",
		"code beautifier",
		"code formatter online",
		"code formatter",
		"code minifier",
		"css formatter",
		"free developer tools",
		"html formatter",
		"javascript formatter",
		"json formatter",
		"online code tools",
		"online developer tools",
		"typescript formatter",
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

	// Page-specific metadata
	pages: {
		home: {
			title: "Codemata | Free Online Developer Tools",
			description:
				"Free online code formatters, minifiers, and developer tools. Format and beautify JavaScript, TypeScript, JSON, CSS, HTML, and more. No installation required.",
		},
		formatters: {
			title: "Code Formatters | Codemata",
			description:
				"Free online code formatters for JavaScript, TypeScript, JSON, CSS, HTML, GraphQL, Markdown, XML, and YAML. Beautify and format your code instantly with proper indentation.",
		},
		minifiers: {
			title: "Code Minifiers | Codemata",
			description:
				"Free online code minifiers for JavaScript, TypeScript, JSON, CSS, HTML, SVG, and XML. Compress and optimize your code for production deployment.",
		},
		encoders: {
			title: "Encoders & Decoders | Codemata",
			description:
				"Free online encoders and decoders for Base64, URL, HTML entities, JavaScript strings, and JWT tokens. Encode and decode data instantly.",
		},
		validators: {
			title: "Validators | Codemata",
			description:
				"Professional validation tools for JSON, HTML, CSS, XML, and more. Test regex patterns, validate schemas, and catch errors before deployment.",
			keywords: [
				"validator",
				"validate",
				"regex tester",
				"json validator",
				"html validator",
				"css validator",
				"xml validator",
				"code validation",
			],
		},
		generators: {
			title: "Code Generators | Codemata",
			description:
				"Generate boilerplate code, configuration files, and templates for your projects. Free online tools for developers.",
			keywords: [
				"generator",
				"gitignore",
				"template",
				"config",
				"boilerplate",
				"code generation",
			],
		},
		viewers: {
			title: "Code & Data Viewers | Codemata",
			description:
				"Preview and visualize code and data formats with live rendering. Markdown previewer and more developer tools.",
			keywords: [
				"viewer",
				"preview",
				"markdown",
				"github",
				"gfm",
				"render",
				"visualize",
				"display",
			],
		},
	},
} as const;
