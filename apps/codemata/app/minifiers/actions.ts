"use server";

import CleanCSS from "clean-css";
import { minify as minifyHtmlLib } from "html-minifier-terser";
import { minify as minifyXmlLib } from "minify-xml";
import { optimize } from "svgo";
import { minify as minifyJsLib } from "terser";

export async function minifyTypescript(input: string): Promise<string> {
	try {
		const result = await minifyJsLib(input, {
			compress: {
				dead_code: true,
				drop_console: false,
				drop_debugger: true,
				keep_classnames: false,
				keep_fnames: false,
			},
			mangle: {
				toplevel: true,
			},
			format: {
				comments: false,
			},
		});

		if (!result.code) {
			throw new Error("Minification produced no output");
		}

		return result.code;
	} catch (error) {
		throw new Error(
			`Failed to minify TypeScript/JavaScript: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function minifyJson(input: string): Promise<string> {
	try {
		const parsed = JSON.parse(input);
		return JSON.stringify(parsed);
	} catch (error) {
		throw new Error(
			`Failed to minify JSON: ${error instanceof Error ? error.message : "Invalid JSON"}`,
		);
	}
}

export async function minifyCss(input: string): Promise<string> {
	try {
		const result = new CleanCSS({
			level: 2,
			format: false,
		}).minify(input);

		if (result.errors.length > 0) {
			throw new Error(result.errors.join(", "));
		}

		return result.styles;
	} catch (error) {
		throw new Error(
			`Failed to minify CSS: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function minifyHtml(input: string): Promise<string> {
	try {
		const result = await minifyHtmlLib(input, {
			collapseWhitespace: true,
			removeComments: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			useShortDoctype: true,
			minifyCSS: true,
			minifyJS: true,
			// biome-ignore lint/suspicious/noExplicitAny: Type definitions are incomplete
		} as any);

		return result;
	} catch (error) {
		throw new Error(
			`Failed to minify HTML: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function minifySvg(input: string): Promise<string> {
	try {
		const result = optimize(input, {
			multipass: true,
			plugins: [
				{
					name: "preset-default",
					params: {
						overrides: {
							cleanupIds: false, // Preserve IDs for functionality
						},
					},
				},
			],
		});

		return result.data;
	} catch (error) {
		throw new Error(
			`Failed to minify SVG: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function minifyXml(input: string): Promise<string> {
	try {
		const result = minifyXmlLib(input, {
			removeComments: true,
			collapseWhitespace: true,
			removeUnusedNamespaces: true,
			// biome-ignore lint/suspicious/noExplicitAny: Type definitions may be incomplete
		} as any);

		return result;
	} catch (error) {
		throw new Error(
			`Failed to minify XML: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
