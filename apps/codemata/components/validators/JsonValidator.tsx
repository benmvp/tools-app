"use client";

import type { EditorView } from "@codemirror/view";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { validateJson } from "@/app/validators/actions";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createLinter, scrollToError } from "@/lib/validators/diagnostics";
import type { ValidationError, ValidationResult } from "@/lib/validators/types";
import { ValidationResults } from "./ValidationResults";

interface JsonValidatorProps {
	example: string;
	exampleSchema?: string;
}

export function JsonValidator({
	example,
	exampleSchema = "",
}: JsonValidatorProps) {
	const [input, setInput] = useState(example);
	const [schema, setSchema] = useState(exampleSchema);
	const [showSchema, setShowSchema] = useState(false);
	const [result, setResult] = useState<ValidationResult | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const [editorView, setEditorView] = useState<EditorView | null>(null);

	const handleValidate = async () => {
		setIsValidating(true);
		try {
			const validationResult = await validateJson(
				input,
				showSchema ? schema : undefined,
			);
			setResult(validationResult);
		} catch (error) {
			console.error("Validation failed:", error);
			setResult({
				valid: false,
				errors: [
					{
						line: 1,
						column: 1,
						message: "Validation failed. Please try again.",
						severity: "error",
					},
				],
				warnings: [],
			});
		} finally {
			setIsValidating(false);
		}
	};

	const handleErrorClick = (error: ValidationError) => {
		if (editorView) {
			scrollToError(editorView, error.line, error.column);
		}
	};

	// Memoize extensions to prevent unnecessary CodeMirror reconfiguration
	const editorExtensions = useMemo(() => {
		return result ? [createLinter([...result.errors, ...result.warnings])] : [];
	}, [result]);

	return (
		<div
			className={
				result ? "grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-4" : ""
			}
		>
			{/* Left Column: Input + Button + Schema */}
			<div className="space-y-4">
				{/* JSON Input */}
				<CodeEditor
					value={input}
					onChange={setInput}
					language="json"
					extensions={editorExtensions}
					onViewUpdate={setEditorView}
					label="JSON Input"
				/>

				{/* Validate Button */}
				<div className="flex gap-2">
					<Button
						onClick={handleValidate}
						disabled={!input.trim() || isValidating}
						className="w-full sm:w-auto"
						size="default"
					>
						{isValidating ? "Validating..." : "Validate JSON"}
					</Button>
				</div>

				{/* Schema (Collapsible) */}
				<Collapsible open={showSchema} onOpenChange={setShowSchema}>
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="gap-2 text-muted-foreground hover:text-foreground"
						>
							<Settings className="w-4 h-4" />
							Advanced: Validate Against JSON Schema
							{showSchema ? (
								<ChevronUp className="w-4 h-4" />
							) : (
								<ChevronDown className="w-4 h-4" />
							)}
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="mt-2">
						<label
							htmlFor="json-schema"
							className="text-sm font-medium mb-2 block"
						>
							JSON Schema (Optional)
						</label>
						<CodeEditor
							value={schema}
							onChange={setSchema}
							language="json"
							placeholder="Paste JSON Schema here..."
							label="JSON Schema (Optional)"
						/>
						<p className="text-xs text-muted-foreground mt-2">
							Provide a JSON Schema to validate your JSON structure, types, and
							constraints.
						</p>
					</CollapsibleContent>
				</Collapsible>
			</div>

			{/* Right Column: Results */}
			{result && (
				<div className="lg:sticky lg:top-4 lg:self-start">
					<ValidationResults result={result} onErrorClick={handleErrorClick} />
				</div>
			)}
		</div>
	);
}
