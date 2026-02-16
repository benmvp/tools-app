"use client";

import { markdown } from "@codemirror/lang-markdown";
import type { ViewerAction } from "@repo/shared";
import CodeMirror from "@uiw/react-codemirror";
import { Copy, Eye, FileText, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAX_VIEWER_INPUT_SIZE } from "@/lib/viewers/constants";

interface Props {
  action: ViewerAction;
  defaultInput?: string;
}

const encoder = new TextEncoder(); // Reuse encoder instance for performance

export function MarkdownViewer({ action, defaultInput = "" }: Props) {
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState("");
  const [lastPreviewedInput, setLastPreviewedInput] = useState(""); // Track what was last previewed
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("markdown");

  // Memoize input size calculation to avoid re-encoding on every render
  const inputSize = useMemo(() => encoder.encode(input).length, [input]);
  const isOverLimit = inputSize > MAX_VIEWER_INPUT_SIZE;
  const isOutputStale = input !== lastPreviewedInput; // Detect when output doesn't match input

  const handlePreview = async () => {
    if (!input.trim()) {
      setError("Please enter some markdown to preview");
      return;
    }

    if (isOverLimit) {
      setError(
        `Input too large. Maximum size is ${MAX_VIEWER_INPUT_SIZE / 1024}KB (~${Math.floor(MAX_VIEWER_INPUT_SIZE / 4)} words).`,
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const rendered = await action(input);
      setOutput(rendered);
      setLastPreviewedInput(input); // Mark this input as previewed
      setError(""); // Clear any previous errors
      toast.success("Markdown previewed successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to preview markdown";
      setError(errorMessage);
      setOutput(""); // Clear stale output on error
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Auto-preview when switching to preview tab if no output or output is stale
    if (value === "preview" && (isOutputStale || !output) && !isLoading) {
      handlePreview();
    }
  };

  const handleCopyHTML = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("HTML copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={handleCopyHTML}
          variant="outline"
          className="gap-2"
          disabled={!output || isLoading || !!error || isOutputStale}
        >
          <Copy className="h-4 w-4" />
          Copy HTML
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          {(inputSize / 1024).toFixed(1)}KB / {MAX_VIEWER_INPUT_SIZE / 1024}KB
          {isOverLimit && (
            <span className="text-destructive font-medium ml-2">
              (Over limit!)
            </span>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger value="markdown" className="gap-2">
            <FileText className="h-4 w-4" />
            Markdown
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="mt-4">
          <div className="border rounded-lg overflow-hidden">
            <CodeMirror
              value={input}
              onChange={(value) => setInput(value)}
              extensions={[markdown()]}
              height="500px"
              placeholder="Enter your markdown here..."
              className="text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="border rounded-lg p-6 min-h-[500px] bg-card">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Rendering markdown...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-destructive">
                <p>{error}</p>
              </div>
            ) : output ? (
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized server-side with sanitize-html
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>
                  Enter markdown in the editor and click this tab to preview
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Tip:</strong> This previewer supports Markdown including
          tables, task lists, strikethrough, and syntax-highlighted code blocks.
          Perfect for previewing README files, documentation, or blog posts
          before publishing.
        </p>
      </div>
    </div>
  );
}
