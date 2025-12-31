import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { MARKDOWN_EXAMPLE } from "@/lib/examples";
import { formatMarkdown } from "./actions";

export const metadata: Metadata = {
  title: "Markdown/MDX Formatter | Codemata",
  description:
    "Format and beautify Markdown and MDX files instantly with Prettier. Free online Markdown formatter with customizable indentation.",
};

export default function MarkdownFormatterPage() {
  const configOptions = [
    {
      id: "indentation",
      label: "Indentation",
      options: [
        { label: "2 Spaces", value: "two-spaces" },
        { label: "4 Spaces", value: "four-spaces" },
        { label: "Tabs", value: "tabs" },
      ],
      defaultValue: "two-spaces",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Markdown/MDX Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your Markdown and MDX files with Prettier
      </p>

      <Transformer
        action={formatMarkdown}
        actionLabel="Format"
        defaultInput={MARKDOWN_EXAMPLE}
        configOptions={configOptions}
        language="markdown"
      />
    </div>
  );
}
