import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { HTML_EXAMPLE } from "@/lib/examples";
import { formatHtml } from "./actions";

export const metadata: Metadata = {
  title: "HTML Formatter | Codemata",
  description:
    "Format and beautify HTML code instantly with Prettier. Free online HTML formatter with customizable indentation.",
};

export default function HtmlFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">HTML Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your HTML code with Prettier
      </p>

      <Transformer
        action={formatHtml}
        actionLabel="Format"
        defaultInput={HTML_EXAMPLE}
        configOptions={configOptions}
        language="html"
      />
    </div>
  );
}
