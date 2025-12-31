import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { YAML_EXAMPLE } from "@/lib/examples";
import { formatYaml } from "./actions";

export const metadata: Metadata = {
  title: "YAML Formatter | Codemata",
  description:
    "Format and beautify YAML configuration files instantly with Prettier. Free online YAML formatter with customizable indentation.",
};

export default function YamlFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">YAML Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your YAML configuration files with Prettier
      </p>

      <Transformer
        action={formatYaml}
        actionLabel="Format"
        defaultInput={YAML_EXAMPLE}
        configOptions={configOptions}
        language="yaml"
      />
    </div>
  );
}
