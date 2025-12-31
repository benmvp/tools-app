import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { JSON_EXAMPLE } from "@/lib/examples";
import { formatJson } from "./actions";

export const metadata: Metadata = {
  title: "JSON Formatter | Codemata",
  description:
    "Format and beautify JSON data instantly with Prettier. Free online JSON formatter with customizable indentation.",
};

export default function JsonFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your JSON data with Prettier
      </p>

      <Transformer
        action={formatJson}
        actionLabel="Format"
        defaultInput={JSON_EXAMPLE}
        configOptions={configOptions}
        language="json"
      />
    </div>
  );
}
