"use client";

import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeEditor } from "./CodeEditor";

interface ConfigOption {
  id: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue: string;
}

interface TransformerProps<
  T extends Record<string, string> = Record<string, string>,
> {
  action: (input: string, config: T) => Promise<string>;
  actionLabel?: string;
  defaultInput?: string;
  configOptions?: ConfigOption[];
}

export function Transformer<
  T extends Record<string, string> = Record<string, string>,
>({
  action,
  actionLabel = "Format",
  defaultInput = "",
  configOptions = [],
}: TransformerProps<T>) {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState("");
  const [config, setConfig] = useState<T>(() => {
    const initial: Record<string, string> = {};
    configOptions.forEach((opt) => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial as T;
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTransform = async () => {
    if (!input) return;

    setLoading(true);
    try {
      const result = await action(input, config);
      setOutput(result);
      toast.success("Success!", {
        description: "Code formatted successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Formatting failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied!", {
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(defaultInput);
  };

  return (
    <div className="space-y-4">
      {/* Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Input</span>
            {defaultInput && (
              <Button variant="ghost" size="sm" onClick={loadExample}>
                Load Example
              </Button>
            )}
          </div>
          <CodeEditor value={input} onChange={setInput} label="" />
        </div>

        <div>
          <span className="text-sm font-medium mb-2 block">Output</span>
          <CodeEditor value={output} readOnly label="" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Config dropdowns */}
        {configOptions.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <span className="text-sm font-medium">{opt.label}:</span>
            <Select
              value={config[opt.id]}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, [opt.id]: value }) as T)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opt.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="ml-auto flex gap-2">
          <Button
            onClick={handleTransform}
            disabled={!input || loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Formatting...
              </>
            ) : (
              actionLabel
            )}
          </Button>

          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
