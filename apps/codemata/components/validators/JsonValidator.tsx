"use client";

import { useState } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CodeEditor } from "@/components/CodeEditor";
import { ValidationResults } from "./ValidationResults";
import { createLinter, scrollToError } from "@/lib/validators/diagnostics";
import { validateJson } from "@/app/validators/actions";
import type { ValidationResult, ValidationError } from "@/lib/validators/types";
import type { EditorView } from "@codemirror/view";

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

	return (
		<div className="space-y-4">
			{/* JSON Input */}
			<div>
				<label
					htmlFor="json-input"
					className="text-sm font-medium mb-2 block"
				>
					JSON Input
				</label>
				<CodeEditor
					value={input}
					onChange={setInput}
					language="json"
					extensions={
						result
							? [createLinter([...result.errors, ...result.warnings])]
							: []
					}
					onViewUpdate={setEditorView}
					label="JSON Input"
				/>
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

			{/* Results */}
			{result && (
				<ValidationResults result={result} onErrorClick={handleErrorClick} />
			)}
		</div>
	);
}
