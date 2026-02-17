"use server";

import xmlPlugin from "@prettier/plugin-xml";
import type { FormatConfig, SqlFormatConfig } from "@repo/shared";
import { format } from "prettier";
import { format as formatSqlQuery } from "sql-formatter";

function getFormatterOptions(config: FormatConfig) {
	const tabWidth =
		config.indentation === "tabs"
			? 1
			: config.indentation === "four-spaces"
				? 4
				: 2;
	const useTabs = config.indentation === "tabs";
	return { tabWidth, useTabs };
}

export async function formatTypescript(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "typescript",
			tabWidth,
			useTabs,
			semi: true,
			singleQuote: false,
			trailingComma: "es5",
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatJson(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "json",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatCss(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "css",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatHtml(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "html",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatGraphql(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "graphql",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatMarkdown(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "markdown",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatXml(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "xml",
			plugins: [xmlPlugin],
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatYaml(
	input: string,
	config: FormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = await format(input, {
			parser: "yaml",
			tabWidth,
			useTabs,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

export async function formatSql(
	input: string,
	config: SqlFormatConfig,
): Promise<string> {
	const { tabWidth, useTabs } = getFormatterOptions(config);

	try {
		const formatted = formatSqlQuery(input, {
			language: config.dialect,
			tabWidth,
			useTabs,
			keywordCase: config.keywordCase === "uppercase" ? "upper" : "lower",
			linesBetweenQueries: 2,
		});
		return formatted;
	} catch (error) {
		throw new Error(
			`Formatting failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
