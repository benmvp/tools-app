"use client";

import { ChevronDown, Download, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CodeEditor } from "@/components/CodeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FRAMEWORKS,
	GITIGNORE_TEMPLATES,
	type GitignoreTemplate,
	IDES,
	LANGUAGES,
	OPERATING_SYSTEMS,
	TOOLS,
} from "@/lib/gitignore-templates";

interface Props {
	action: (templateIds: string[]) => Promise<string>;
}

export function GitignoreGenerator({ action }: Props) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [output, setOutput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);

	// Filter templates by search query
	const filteredCategories = useMemo(() => {
		if (!searchQuery) {
			return { LANGUAGES, FRAMEWORKS, IDES, OPERATING_SYSTEMS, TOOLS };
		}

		const query = searchQuery.toLowerCase();
		const filterFn = (t: GitignoreTemplate) =>
			t.name.toLowerCase().includes(query);

		return {
			LANGUAGES: LANGUAGES.filter(filterFn),
			FRAMEWORKS: FRAMEWORKS.filter(filterFn),
			IDES: IDES.filter(filterFn),
			OPERATING_SYSTEMS: OPERATING_SYSTEMS.filter(filterFn),
			TOOLS: TOOLS.filter(filterFn),
		};
	}, [searchQuery]);

	const handleToggle = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const result = await action(selectedIds);
			setOutput(result);
		} catch (error) {
			console.error("Failed to generate .gitignore:", error);
			toast.error("Failed to generate .gitignore. Please try again.");
		} finally {
			setIsGenerating(false);
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(output);
		toast.success("Copied to clipboard!");
	};

	const handleDownload = () => {
		const blob = new Blob([output], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "gitignore";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Downloaded gitignore (rename to .gitignore)");
	};

	const selectedTemplates = selectedIds
		.map((id) => GITIGNORE_TEMPLATES[id])
		.filter(Boolean);

	const hasResults =
		filteredCategories.LANGUAGES.length > 0 ||
		filteredCategories.FRAMEWORKS.length > 0 ||
		filteredCategories.IDES.length > 0 ||
		filteredCategories.OPERATING_SYSTEMS.length > 0 ||
		filteredCategories.TOOLS.length > 0;

	return (
		<div className="space-y-6">
			{/* Search */}
			<div className="space-y-2">
				<label htmlFor="template-search" className="text-sm font-medium">
					Search templates
				</label>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						id="template-search"
						type="text"
						placeholder="Search for languages, frameworks, tools..."
						value={searchQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchQuery(e.target.value)
						}
						className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
			</div>

			{/* Selected Templates */}
			{selectedIds.length > 0 && (
				<div className="space-y-2">
					<p className="text-sm font-medium">
						Selected ({selectedIds.length}):
					</p>
					<div className="flex flex-wrap gap-2">
						{selectedTemplates.map((template) => (
							<Badge
								key={template.id}
								variant="secondary"
								className="gap-1 pr-1"
							>
								{template.name}
								<Button
									size="icon"
									variant="ghost"
									className="h-4 w-4 p-0 hover:bg-transparent"
									onClick={() => handleToggle(template.id)}
									aria-label={`Remove ${template.name}`}
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Category Pills */}
			{hasResults ? (
				<div className="space-y-4">
					{filteredCategories.LANGUAGES.length > 0 && (
						<CategorySection
							title="Languages"
							templates={filteredCategories.LANGUAGES}
							selectedIds={selectedIds}
							onToggle={handleToggle}
						/>
					)}
					{filteredCategories.FRAMEWORKS.length > 0 && (
						<CategorySection
							title="Frameworks"
							templates={filteredCategories.FRAMEWORKS}
							selectedIds={selectedIds}
							onToggle={handleToggle}
						/>
					)}
					{filteredCategories.IDES.length > 0 && (
						<CategorySection
							title="IDEs & Editors"
							templates={filteredCategories.IDES}
							selectedIds={selectedIds}
							onToggle={handleToggle}
						/>
					)}
					{filteredCategories.OPERATING_SYSTEMS.length > 0 && (
						<CategorySection
							title="Operating Systems"
							templates={filteredCategories.OPERATING_SYSTEMS}
							selectedIds={selectedIds}
							onToggle={handleToggle}
						/>
					)}
					{filteredCategories.TOOLS.length > 0 && (
						<CategorySection
							title="Tools"
							templates={filteredCategories.TOOLS}
							selectedIds={selectedIds}
							onToggle={handleToggle}
						/>
					)}
				</div>
			) : (
				<p className="text-sm text-muted-foreground text-center py-8">
					No templates found matching "{searchQuery}"
				</p>
			)}

			{/* Generate Button */}
			<Button
				onClick={handleGenerate}
				disabled={selectedIds.length === 0 || isGenerating}
				className="w-full sm:w-auto"
			>
				{isGenerating ? "Generating..." : "Generate .gitignore"}
			</Button>

			{/* Output Editor */}
			<div className="space-y-2">
				<p className="text-sm font-medium">Generated .gitignore:</p>
				<CodeEditor
					value={
						output ||
						"# Select templates above to generate .gitignore\n\n# Your generated .gitignore will appear here..."
					}
					language="text"
					readOnly
					label="Generated .gitignore"
				/>
			</div>

			{/* Actions */}
			{output && (
				<div className="flex flex-col sm:flex-row gap-2">
					{/* Copy Button (Primary) with Download Dropdown */}
					<div className="flex w-full sm:w-auto gap-0">
						<Button
							onClick={handleCopy}
							variant="outline"
							className="flex-1 sm:flex-none rounded-r-none"
						>
							📋 Copy to Clipboard
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="rounded-l-none border-l-0"
									aria-label="More actions"
								>
									<ChevronDown className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleDownload}>
									<Download className="h-4 w-4 mr-2" />
									Download .gitignore
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Clear Button */}
					<Button
						onClick={() => setOutput("")}
						variant="outline"
						className="w-full sm:w-auto"
					>
						<X className="h-4 w-4 mr-2" />
						Clear
					</Button>
				</div>
			)}
		</div>
	);
}

interface CategorySectionProps {
	title: string;
	templates: GitignoreTemplate[];
	selectedIds: string[];
	onToggle: (id: string) => void;
}

function CategorySection({
	title,
	templates,
	selectedIds,
	onToggle,
}: CategorySectionProps) {
	return (
		<div className="space-y-2">
			<p className="text-sm font-medium text-muted-foreground">{title}</p>
			<div className="flex flex-wrap gap-2">
				{templates.map((template) => (
					<Button
						key={template.id}
						variant={selectedIds.includes(template.id) ? "default" : "outline"}
						size="sm"
						onClick={() => onToggle(template.id)}
					>
						{template.name}
					</Button>
				))}
			</div>
		</div>
	);
}
