import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { CSS_EXAMPLE } from "@/lib/examples";
import { formatCss } from "./actions";

export const metadata: Metadata = {
  title: "CSS/SCSS Formatter | Codemata",
  description:
    "Format and beautify CSS and SCSS stylesheets instantly with Prettier. Free online CSS formatter with customizable indentation.",
};

export default function CssFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">CSS/SCSS Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your CSS and SCSS stylesheets with Prettier
      </p>

      <Transformer
        action={formatCss}
        actionLabel="Format"
        defaultInput={CSS_EXAMPLE}
        configOptions={configOptions}
        language="css"
      />
    </div>
  );
}
