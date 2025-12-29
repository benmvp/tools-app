import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { TYPESCRIPT_EXAMPLE } from "@/lib/examples";
import { formatTypescript } from "./actions";

export const metadata: Metadata = {
  title: "TypeScript & JavaScript Formatter | Codemata",
  description:
    "Format and beautify TypeScript, JavaScript, JSX, and TSX code instantly with Prettier. Free online formatter with customizable indentation.",
};

export default function TypeScriptFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">
        TypeScript & JavaScript Formatter
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your JS, TS, JSX, and TSX code with Prettier
      </p>

      <Transformer
        action={formatTypescript}
        actionLabel="Format"
        defaultInput={TYPESCRIPT_EXAMPLE}
        configOptions={configOptions}
      />
    </div>
  );
}
