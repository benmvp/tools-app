"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { validateUrl } from "@/app/validators/actions";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";

interface UrlValidatorProps {
	example: string;
}

interface ParsedUrl {
	line: number;
	url: string;
	valid: boolean;
	error?: string;
	parsed?: {
		protocol: string;
		hostname: string;
		port?: string;
		pathname?: string;
		query?: Array<{ key: string; value: string | string[] }>;
		hash?: string;
		username?: string;
		password?: string;
	};
}

interface UrlValidationResult {
	validCount: number;
	errorCount: number;
	urls: ParsedUrl[];
}

export function UrlValidator({ example }: UrlValidatorProps) {
	const [input, setInput] = useState(example);
	const [result, setResult] = useState<UrlValidationResult | null>(null);
	const [isValidating, setIsValidating] = useState(false);

	const handleValidate = async () => {
		setIsValidating(true);
		const validationResult = await validateUrl(input);
		setResult(validationResult);
		setIsValidating(false);
	};

	const hasResult = result !== null;

	return (
		<div className="flex flex-col lg:flex-row gap-6">
			{/* Input Section */}
			<div
				className={`flex-1 space-y-4 ${hasResult ? "lg:w-[65%]" : "w-full"}`}
			>
				<div>
					<label htmlFor="url-input" className="text-sm font-medium mb-2 block">
						URLs (one per line)
					</label>
					<CodeEditor
						value={input}
						onChange={setInput}
						label="URLs"
						language="text"
					/>
				</div>

				<Button
					onClick={handleValidate}
					disabled={isValidating}
					className="w-full sm:w-auto"
				>
					{isValidating ? "Validating..." : "Validate URLs"}
				</Button>
			</div>

			{/* Results Section */}
			{hasResult && (
				<div className="flex-1 lg:w-[35%] lg:sticky lg:top-4 lg:self-start">
					<UrlResults result={result} />
				</div>
			)}
		</div>
	);
}

function UrlResults({ result }: { result: UrlValidationResult }) {
	const { validCount, errorCount, urls } = result;
	const errors = urls.filter((u) => !u.valid);
	const validUrls = urls.filter((u) => u.valid);

	return (
		<div className="space-y-4">
			{/* Summary */}
			<div className="p-4 rounded-md border">
				{errorCount === 0 ? (
					<p className="text-sm font-medium text-green-600">
						✓ All {validCount} {validCount === 1 ? "URL is" : "URLs are"} valid
					</p>
				) : (
					<p className="text-sm font-medium">
						✗ {errorCount} {errorCount === 1 ? "error" : "errors"} found,{" "}
						{validCount} {validCount === 1 ? "URL" : "URLs"} valid
					</p>
				)}
			</div>

			{/* Errors */}
			{errors.length > 0 && (
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">Errors ({errors.length})</h3>
					{errors.map((urlData) => (
						<div
							key={urlData.line}
							className="w-full p-3 rounded-md border border-destructive/50 bg-destructive/10"
						>
							<div className="text-sm">
								<span className="font-mono text-destructive">
									Line {urlData.line}:
								</span>{" "}
								<span className="text-muted-foreground break-all">
									{urlData.url}
								</span>
							</div>
							<div className="text-sm text-destructive mt-1">
								→ {urlData.error}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Valid URLs */}
			{validUrls.length > 0 && (
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">
						Valid URLs ({validUrls.length})
					</h3>
					{validUrls.map((urlData) => (
						<UrlDetailsCard key={urlData.line} urlData={urlData} />
					))}
				</div>
			)}
		</div>
	);
}

function UrlDetailsCard({ urlData }: { urlData: ParsedUrl }) {
	const [expanded, setExpanded] = useState(false);
	const { line, url, parsed } = urlData;

	return (
		<div className="rounded-md border">
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				className="w-full p-3 text-left flex items-start justify-between hover:bg-muted/50 transition-colors"
			>
				<div className="flex-1 min-w-0">
					<div className="text-sm font-mono text-muted-foreground">
						Line {line}
					</div>
					<div className="text-sm break-all mt-1">{url}</div>
				</div>
				<ChevronDown
					className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${
						expanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{expanded && parsed && (
				<div className="px-3 pb-3 space-y-3 border-t">
					{/* Basic Info */}
					<div className="space-y-1.5 pt-3">
						<MetadataRow label="Protocol" value={parsed.protocol} />
						<MetadataRow label="Hostname" value={parsed.hostname} />
						{parsed.port && <MetadataRow label="Port" value={parsed.port} />}
						{parsed.pathname && (
							<MetadataRow label="Path" value={parsed.pathname} />
						)}
						{parsed.hash && <MetadataRow label="Hash" value={parsed.hash} />}
						{parsed.username && (
							<MetadataRow label="Username" value={parsed.username} />
						)}
						{parsed.password && (
							<MetadataRow
								label="Password"
								value={parsed.password}
								className="text-muted-foreground italic"
							/>
						)}
					</div>

					{/* Query Parameters Table */}
					{parsed.query && parsed.query.length > 0 && (
						<div>
							<div className="text-sm font-medium mb-2">
								Query Parameters ({parsed.query.length})
							</div>
							<div className="rounded-md overflow-hidden border">
								{parsed.query.map((param, idx) => (
									<QueryParamRow
										key={`${param.key}-${idx}`}
										param={param}
										isEven={idx % 2 === 0}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function MetadataRow({
	label,
	value,
	className = "",
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className="flex gap-2 text-sm">
			<span className="text-muted-foreground w-20 flex-shrink-0">{label}:</span>
			<span className={`font-mono break-all ${className}`}>{value}</span>
		</div>
	);
}

function QueryParamRow({
	param,
	isEven,
}: {
	param: { key: string; value: string | string[] };
	isEven: boolean;
}) {
	const isArray = Array.isArray(param.value);
	const displayValue = isArray
		? `[${(param.value as string[]).join(", ")}]`
		: param.value;

	return (
		<div
			className={`flex gap-3 px-3 py-2 text-sm ${isEven ? "bg-muted/30" : ""}`}
		>
			<span className="font-mono text-muted-foreground w-1/3 break-all">
				{param.key}
			</span>
			<span className="font-mono flex-1 break-all">{displayValue}</span>
		</div>
	);
}
