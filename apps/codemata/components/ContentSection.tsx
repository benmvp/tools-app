import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface ContentSectionProps {
	heading: string;
	content: string;
}

/**
 * Content section component with markdown rendering
 * All sections are expanded (no collapsing)
 */
export function ContentSection({ heading, content }: ContentSectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
			<div className="prose prose-slate dark:prose-invert max-w-none">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={
						{
							code(props) {
								const { children, className, ...rest } = props;
								const match = /language-(\w+)/.exec(className || "");
								const isInline = !match;

								return !isInline && match ? (
									<SyntaxHighlighter
										// biome-ignore lint/suspicious/noExplicitAny: Style types don't match but work at runtime
										style={oneDark as any}
										language={match[1]}
										PreTag="div"
									>
										{String(children).replace(/\n$/, "")}
									</SyntaxHighlighter>
								) : (
									<code className={className} {...rest}>
										{children}
									</code>
								);
							},
						} as Components
					}
				>
					{content}
				</ReactMarkdown>
			</div>
		</section>
	);
}
