declare module "css-tree" {
	export interface ParseError {
		message: string;
		line: number;
		column: number;
		offset?: number;
		name?: string;
		formattedMessage?: string;
	}

	export interface ParseOptions {
		context?: string;
		positions?: boolean;
		onParseError?: (error: ParseError) => void;
	}

	export interface CssNode {
		type: string;
		[key: string]: unknown;
	}

	export function parse(input: string, options?: ParseOptions): CssNode;
}
