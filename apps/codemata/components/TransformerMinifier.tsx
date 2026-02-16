"use client";

import type { MinifierTool } from "@repo/shared";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./CodeEditor";

interface TransformerMinifierProps {
	action: (input: string) => Promise<string>;
	actionLabel?: string;
	defaultInput?: string;
	language?: MinifierTool["language"];
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

export function TransformerMinifier({
	action,
	actionLabel = "Minify",
	defaultInput = "",
	language = "typescript",
}: TransformerMinifierProps) {
	const [input, setInput] = useState(defaultInput);
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const inputSize = new Blob([input]).size;
	const outputSize = new Blob([output]).size;
	const savings = inputSize - outputSize;
	const savingsPercent = inputSize > 0 ? (savings / inputSize) * 100 : 0;

	const handleTransform = async () => {
		if (!input) return;

		setLoading(true);
		try {
			const result = await action(input);
			setOutput(result);
			toast.success("Success!", {
				description: "Code minified successfully",
			});
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Minification failed",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		if (!output) return;

		await navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("Copied!", {
			description: "Code copied to clipboard",
		});
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-4">
			{/* Editors */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Input</span>
						{inputSize > 0 && (
							<Badge variant="secondary" className="text-xs">
								{formatBytes(inputSize)}
							</Badge>
						)}
					</div>
					<CodeEditor
						value={input}
						onChange={setInput}
						label=""
						language={language}
					/>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">Output</span>
						{output && (
							<Badge variant="secondary" className="text-xs">
								{formatBytes(outputSize)}
							</Badge>
						)}
					</div>
					<div className="[&_.cm-content]:!whitespace-pre-wrap [&_.cm-content]:!break-all">
						<CodeEditor
							value={output}
							readOnly
							label=""
							language={language}
							lineWrapping
						/>
					</div>
				</div>
			</div>

			{/* Optimization Badge */}
			{output && savings > 0 && (
				<div className="flex justify-center">
					<Badge variant="default" className="text-sm px-4 py-1.5">
						✨ Reduced by {formatBytes(savings)} ({savingsPercent.toFixed(1)}%)
					</Badge>
				</div>
			)}

			{/* Controls */}
			<div className="flex items-center gap-4 flex-wrap justify-center">
				<Button
					onClick={handleTransform}
					disabled={!input || loading}
					className="min-w-32"
					size="lg"
				>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Minifying...
						</>
					) : (
						actionLabel
					)}
				</Button>

				<Button
					variant="outline"
					onClick={handleCopy}
					disabled={!output}
					size="lg"
				>
					{copied ? (
						<>
							<Check className="mr-2 h-4 w-4" />
							Copied!
						</>
					) : (
						<>
							<Copy className="mr-2 h-4 w-4" />
							Copy
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
