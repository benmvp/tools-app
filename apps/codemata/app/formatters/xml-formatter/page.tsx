import type { Metadata } from "next";
import { Transformer } from "@/components/Transformer";
import { XML_EXAMPLE } from "@/lib/examples";
import { formatXml } from "./actions";

export const metadata: Metadata = {
  title: "XML Formatter | Codemata",
  description:
    "Format and beautify XML documents instantly with Prettier. Free online XML formatter with customizable indentation.",
};

export default function XmlFormatterPage() {
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
      <h1 className="text-3xl font-bold mb-2">XML Formatter</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Format and beautify your XML documents with Prettier
      </p>

      <Transformer
        action={formatXml}
        actionLabel="Format"
        defaultInput={XML_EXAMPLE}
        configOptions={configOptions}
        language="xml"
      />
    </div>
  );
}
